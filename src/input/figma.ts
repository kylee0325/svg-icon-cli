import Figma, { ClientInterface, FileImageResponse, FileNodesResponse, FileResponse } from 'figma-js';
import got from 'got';
import { InputPluginImpl, FigmaInputOptions, SourceIcon, InputSource } from '../types.js';
import { logger, addPrefix, writeSourceData, getQueryParams } from '../utils/index.js';

interface Node extends Partial<SourceIcon> {
  id: string;
  name: string;
  type?: string;
  key?: string;
  images?: string;
  parentNames?: string[];
  children?: Node[];
}

interface FigmaSourceData {
  document: Node;
  components: Record<string, any>;
}

/**
 * 判断节点是否component类型
 * @param node
 * @returns boolean
 */
const isComponent = (node: Node) => node.type === 'COMPONENT';

/**
 * 格式化原始node
 * @param node 节点
 * @param parents 父级节点集合
 * @param components 存储所有组件类型节点的key值对象
 * @returns
 */
const formatIconComponent = ({
  node,
  parents,
  components,
}: {
  node: Node;
  parents: Node[];
  components: Record<string, any>;
}): Node => {
  const { name, id } = node;
  const { key } = components[node.id];
  const parentNames = parents.map((p) => p.name);

  return {
    name,
    id,
    key,
    parentNames,
  };
};

/**
 * 解析 fileId
 * @param {String} figmaUrl
 * @returns string
 */
const formatFileIdByUrl = (figmaUrl: string) => {
  const arr = figmaUrl.match(/file\/([a-z0-9]+)\//i);
  if (arr && arr.length > 0 && arr[1]) {
    return arr[1];
  }
  throw Error('Cannot find fileId in figma url.');
};

/**
 * 解析 nodeId
 * @param {String} figmaUrl
 * @returns string
 */
const formatNodeIdByUrl = (figmaUrl: string): string => {
  let nodeId = '';
  try {
    nodeId = getQueryParams(figmaUrl, 'node-id');
  } catch (e) {}

  return nodeId;
};

/**
 * 获取icon的svg url
 * @returns
 */
const fetchNodes = (figmaClient: ClientInterface, fileId: string, nodeId?: string) => {
  if (nodeId) {
    return figmaClient.fileNodes(fileId, { ids: [nodeId] }).then(({ data }: { data: FileNodesResponse }) => {
      if (data.nodes) {
        Object.values(data.nodes).forEach((item: any) => {
          Object.assign(data, { ...item, nodes: undefined });
        });
      }
      return { data };
    });
  }

  return figmaClient.file(fileId);
};

/**
 * 收集icon列表
 * @param {*} figmaTree
 * @returns
 */
const collectIconNodes = (figmaSourceData: FigmaSourceData): Node[] => {
  // 递归
  const pickComponentList = (node: Node, parents: Node[] = [], icons: Node[] = []) => {
    if (isComponent(node)) {
      icons.push(
        formatIconComponent({
          node,
          parents,
          components: figmaSourceData.components,
        }),
      );
    } else if (node.children) {
      // 递归处理
      node.children.forEach((n) => pickComponentList(n, [node, ...parents], icons));
    }

    return icons;
  };

  return pickComponentList(figmaSourceData.document);
};

/**
 * modules过滤
 * @param {*} icons
 * @param {*} modules
 * @returns filtered icons
 */
const filterIconsByModules = (icons: Node[], modules?: string[]) => {
  // 通过modules过滤图标
  if (modules && modules.length) {
    icons = icons.filter((icon) => {
      const { parentNames } = icon;
      const isInModule =
        !parentNames ||
        (parentNames && parentNames.length === 0) ||
        !!parentNames.find((item) => modules.includes(item));
      return isInModule;
    });
  }
  // 去除parentNames
  icons = icons.map(({ parentNames, ...rest }) => rest);

  return icons;
};

/**
 * 获取icon的svg url
 * @returns
 */
const fetchIconSvgUrl = ({
  icons,
  figmaClient,
  fileId,
}: {
  icons: Node[];
  figmaClient: ClientInterface;
  fileId: string;
}): Promise<Node[]> => {
  const ids = icons.map((i) => i.id);

  return figmaClient
    .fileImages(fileId, {
      format: 'svg',
      ids: ids,
      scale: 1,
    })
    .then(({ data }: { data: FileImageResponse }) => {
      const imagesMaps = data.images;
      icons.forEach((icon) => {
        const id = icon.id;
        if (imagesMaps[id]) {
          icon.images = imagesMaps[id];
        } else {
          console.warn(`${icon.name} icon can not fetch file Image`);
        }
      });
      return icons;
    });
};

/**
 * 获取具体svg内容
 * @returns
 */
const fetchIconSvgContent = async (svgUrl: string): Promise<string> => {
  return got.get(svgUrl, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
    encoding: 'utf8',
    resolveBodyOnly: true,
    responseType: 'text',
  }) as any;
};

async function getIcons(options: FigmaInputOptions): Promise<SourceIcon[]> {
  logger.info('figma input options:');
  console.log(options);
  let { url, token, modules, prefix, filter } = options || {};

  if (!url) {
    logger.errorExit('Cannot find figma url in process!');
  }
  if (!token) {
    logger.errorExit('Cannot find figma token in process!');
  }
  // 获取figma url上的fileId
  const fileId = formatFileIdByUrl(url);
  // 获取figma url上的nodeId
  const nodeId = formatNodeIdByUrl(url);

  // 连接figma
  const figmaClient = Figma.Client({
    personalAccessToken: token,
  });

  const icons: SourceIcon[] = await fetchNodes(figmaClient, fileId, nodeId)
    .then(({ data }: { data: FileNodesResponse | FileResponse }) => {
      writeSourceData(data, 'figma-source');
      // 提取icon列表
      return collectIconNodes(data as any);
    })
    .then((icons: Node[]) => {
      // 通过modules过滤图标
      icons = filterIconsByModules(icons, modules);
      if (filter && typeof filter == 'function') {
        icons = icons.filter(filter);
      }
      if (icons.length === 0) {
        throw Error('did not find any icons');
      }
      return icons;
    })
    .then((icons: Node[]) => {
      // 获取 icon 对应的 image 链接
      return fetchIconSvgUrl({ icons, figmaClient, fileId });
    })
    .then(async (icons: Node[]) => {
      writeSourceData(icons, 'figma-images');
      // 根据 image 链接获取 svg 内容
      return Promise.all(
        icons
          .filter((i) => i.images)
          .map((icon: Node) => {
            return fetchIconSvgContent(icon.images || '').then((body) => {
              if (prefix) {
                icon.name = addPrefix(icon.name, prefix);
              }
              icon.content = body;
              icon.source = InputSource.FIGMA;
              // @ts-ignore
              delete icon.id;
              delete icon.key;
              delete icon.images;
              return icon as SourceIcon;
            });
          }),
      );
    })
    .catch((error: Error) => {
      const errorMsg = `Error fetching components from Figma: ${error}`;
      throw Error(errorMsg);
    });

  writeSourceData(icons, 'figma-icons');
  logger.info(`Find figma icons (total: ${icons.length}): ${icons.map((icon: SourceIcon) => icon.name)}`);

  return icons;
}

export const figma: InputPluginImpl<FigmaInputOptions> = (options: FigmaInputOptions) => {
  return {
    name: InputSource.FIGMA,
    run: async () => await getIcons(options),
  };
};

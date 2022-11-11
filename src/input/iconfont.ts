import fetch from 'node-fetch';
import { IconfontInputOptions, SourceIcon, InputSource, InputPluginImpl } from '../types.js';
import { logger, addPrefix, getSvgContent, formatTree, writeSourceData } from '../utils/index.js';
import { parse, stringify } from 'svgson';

async function getIcons(options: IconfontInputOptions): Promise<SourceIcon[]> {
  logger.info('iconfont input options:');
  console.log(options);
  let { url, prefix, filter } = options || {};

  if (!url) {
    logger.errorExit('Cannot find iconfont url in process!');
  }

  if (!url.startsWith('https:')) {
    url = `https:${url}`;
  }

  const response = await fetch(url);

  const body = await response.text();
  writeSourceData(body, 'iconfont-source', { ext: 'js', isString: true });

  const svgContent = getSvgContent(body);

  const svgNode = await parse(svgContent);

  const list = (svgNode && svgNode.children) || [];

  if (!list.length) {
    return [];
  }

  const formatList = formatTree(list, (node) => {
    if (node.name === 'path' && !node.attributes.fill) {
      node.attributes.fill = 'currentColor';
    }
    if (node.name === 'symbol') {
      node.attributes.xmlns = 'http://www.w3.org/2000/svg';
      node.name = 'svg';
    }
    return node;
  });

  let icons = formatList.map((node) => {
    let name = `${node.attributes.id}`;
    if (prefix) {
      name = addPrefix(name, prefix);
    }
    delete node.attributes.id;
    return {
      name,
      content: stringify(node),
      source: InputSource.ICONFONT,
    };
  });

  if (filter && typeof filter == 'function') {
    icons = icons.filter(filter);
  }

  writeSourceData(icons, "iconfont-icons");
  logger.info(`Find iconfont icons (total: ${icons.length}): ${icons.map((icon) => icon.name)}`);

  return icons;
}

export const iconfont: InputPluginImpl<IconfontInputOptions> = (options: IconfontInputOptions) => {
  return {
    name: InputSource.ICONFONT,
    run: async () => await getIcons(options),
  };
};

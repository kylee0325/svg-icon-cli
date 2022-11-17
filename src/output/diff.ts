import { fs, path } from 'zx';
import { OutputOptions, OutputIcon, OutputTypes, OutputPluginImpl } from '../types.js';
import { logger, mergeOptions, getPath, getDateStr } from '../utils/index.js';

const { ensureDir, readFile, writeFile, existsSync } = fs;
const { join, parse } = path;

export interface DiffOutputOptions extends OutputOptions {
  jsonFile?: string;
}

export const defaultDiffOutputOptions: DiffOutputOptions = {
  dir: 'src/diff',
  jsonFile: 'src/icons.json',
};

async function outputIcons(icons: OutputIcon[], options?: DiffOutputOptions): Promise<void> {
  logger.info('diff output options:');
  console.log(options);

  const { dir, jsonFile } = mergeOptions<DiffOutputOptions>(defaultDiffOutputOptions, options);

  if (!dir || !jsonFile) {
    return;
  }

  const jsonPathInfo = parse(jsonFile);
  const outputFileName = `${jsonPathInfo.name}.json`;
  const jsonFileDir = getPath(jsonPathInfo.dir);
  const outputFilePath = join(jsonFileDir, outputFileName);

  let oldFile = '';
  let oldIcons = [];
  if (!existsSync(outputFilePath)) {
    logger.error(`cannot find json file: ${outputFileName}`);
  } else {
    try {
      oldFile = await readFile(outputFilePath, 'utf8');
      oldIcons = JSON.parse(oldFile);
    } catch (error) {
      logger.error(`cannot read json file: ${outputFileName}`);
    }
  }

  // 先组装所有icon的对象，同名icon放入一起，方便后续比对差异
  const newLen = icons.length;
  const iconsMap: Record<string, any> = {};
  [...icons, ...oldIcons].forEach((icon, index) => {
    const curr = iconsMap[icon.name];
    iconsMap[icon.name] = {
      ...curr,
      [index > newLen - 1 ? 'old' : 'new']: icon,
    };
  });
  // 排序，输出结果方便查看
  const sortedIconKeys = Object.keys(iconsMap).sort();
  const arr: any = [];
  sortedIconKeys.forEach((key) => {
    const icon = iconsMap[key];
    const oldIcon = icon.old;
    const newIcon = icon.new;
    if (oldIcon && newIcon) {
      // 如果有新旧版本，则比较差异
      // images每次返回的链接都是变化的，所以排除
      const keys = Object.keys(newIcon).filter((_) => _ !== 'images');
      let obj: Record<string, any> = {
        name: newIcon.name,
      };
      let isChanged = false;
      keys.forEach((key) => {
        if (newIcon[key] !== oldIcon[key]) {
          obj[key] = newIcon[key];
          obj[`old_${key}`] = oldIcon[key];
          isChanged = true;
        }
      });
      if (isChanged) {
        logger.info(`Diff icons: ${newIcon.name} icon has been updated`);
        arr.push({
          ...obj,
          diffType: 'update',
        });
      }
    } else if (newIcon) {
      // 如果只有新版本，则输出新增
      logger.info(`Diff icons: ${newIcon.name} icon has been created`);
      arr.push({
        ...newIcon,
        diffType: 'create',
      });
    } else if (oldIcon) {
      // 如果只有旧版本，则输出删除
      logger.info(`Diff icons: ${oldIcon.name} icon has been deleted`);
      arr.push({
        name: oldIcon.name,
        diffType: 'delete',
      });
    }
  });

  if (!arr.length) {
    logger.info(`Nothing changed! Skip create diff file`);
    return;
  }
  const iconsStr = JSON.stringify(arr, null, '\t');
  const diffFileDir = getPath(dir);
  const diffFile = join(diffFileDir, `diff_${getDateStr()}.json`);

  logger.info(`Create diff file: ${diffFile}`);
  /**
   * 写入文件
   */
  await ensureDir(join(diffFileDir));
  await writeFile(diffFile, iconsStr, 'utf8');
}

export const diff: OutputPluginImpl<DiffOutputOptions> = (options?: DiffOutputOptions) => {
  return {
    name: OutputTypes.DIFF,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

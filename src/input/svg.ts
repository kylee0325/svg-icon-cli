import { fs, path } from 'zx';
import { SvgInputOptions, SourceIcon, InputSource, InputPluginImpl } from '../types.js';
import { logger, getPath, getFiles, addPrefix, writeSourceData } from '../utils/index.js';

const { readFile } = fs;
const { parse } = path;

async function getIcons(options: SvgInputOptions): Promise<SourceIcon[]> {
  logger.info('svg input options:');
  console.log(options);
  let { dir, prefix, filter } = options || {};

  if (!dir) {
    logger.errorExit('Cannot find svg dir in process!');
  }

  const dirPath = getPath(dir);
  const files = await getFiles(dirPath);
  if (!files || files.length === 0) return [];

  const fileMap = {} as Record<string, any>;

  await Promise.all(
    files.map(async (file) => {
      const fileInfo = parse(file);
      let name = fileInfo.name;
      const filePath = getPath(file);
      try {
        const content = await readFile(filePath, 'utf8');
        if (prefix) {
          name = addPrefix(name, prefix);
        }

        fileMap[name] = {
          name,
          content,
          source: InputSource.SVG,
        };
      } catch (error) {
        logger.error(`cannot read svg file: ${filePath}`);
      }
    }),
  );

  writeSourceData(fileMap, 'svg-data');
  let icons = Object.keys(fileMap).map((key) => fileMap[key]);

  if (filter && typeof filter == 'function') {
    icons = icons.filter(filter);
  }

  writeSourceData(icons, 'svg-icons');
  logger.info(`Find svg icons (total: ${icons.length}): ${icons.map((icon) => icon.name)}`);

  return icons;
}

export const svg: InputPluginImpl<SvgInputOptions> = (options: SvgInputOptions) => {
  return {
    name: InputSource.SVG,
    run: async () => await getIcons(options),
  };
};

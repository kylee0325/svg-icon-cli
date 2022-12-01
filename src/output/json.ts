import { fs, path } from 'zx';
import { OutputIcon, OutputTypes, OutputPluginImpl } from '../types.js';
import { logger, mergeOptions, getPath } from '../utils/index.js';
import { JsonOutputOptions, defaultJsonOutputOptions } from './common.js';

const { ensureDir, writeFile } = fs;
const { join, extname, parse } = path;

async function outputIcons(icons: OutputIcon[], options?: JsonOutputOptions): Promise<void> {
  logger.info('json output options:');
  console.log(options);
  const { dir, filename } = mergeOptions<JsonOutputOptions>(defaultJsonOutputOptions, options);

  if (!dir || !filename) {
    return;
  }
  const jsonPathInfo = parse(filename);
  const outputFileName = `${jsonPathInfo.name}.json`;
  const outputDir = getPath(dir);
  const outputFilePath = join(outputDir, outputFileName);
  const isJsonType = extname(filename) === '.json';
  if (!isJsonType) {
    logger.error(`${filename} is not a json file, reset to ${outputFileName}`);
  }
  const iconsStr = JSON.stringify(icons, null, '\t');
  logger.info(`Create icons json file: ${outputFileName}, path: ${outputFilePath}`);
  /**
   * 写入文件
   */
  await ensureDir(join(outputDir));
  await writeFile(outputFilePath, iconsStr, 'utf8');
}

export const json: OutputPluginImpl<JsonOutputOptions> = (options?: JsonOutputOptions) => {
  return {
    name: OutputTypes.JSON,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

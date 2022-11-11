import { fs, path } from 'zx';
import { JsonInputOptions, SourceIcon, InputSource, InputPluginImpl } from '../types.js';
import { logger, getPath, addPrefix, writeSourceData } from '../utils/index.js';

const { readFile } = fs;
const { parse } = path;

async function getIcons(options: JsonInputOptions): Promise<SourceIcon[]> {
  logger.info('json input options:');
  console.log(options);
  let { file, prefix, filter } = options || {};

  if (!file) {
    logger.errorExit('Cannot find json file in process!');
  }

  const filePath = getPath(file);
  const jsonPathInfo = parse(filePath);

  if (jsonPathInfo.ext !== '.json') {
    logger.error(`${filePath} is not a json file`);
    return [];
  }

  let icons: SourceIcon[] = [];
  try {
    const jsonFile = await readFile(filePath, 'utf8');
    icons = JSON.parse(jsonFile);
  } catch (error) {
    logger.error(`cannot read json file: ${filePath}`);
  }

  icons = icons.map((icon) => {
    let name = icon.name;
    if (prefix) {
      name = addPrefix(name, prefix);
    }

    return {
      ...icon,
      name,
      source: InputSource.JSON,
    };
  });

  if (filter && typeof filter == 'function') {
    icons = icons.filter(filter);
  }

  writeSourceData(icons, 'json-icons');
  logger.info(`Find json icons (total: ${icons.length}): ${icons.map((icon) => icon.name)}`);

  return icons;
}

export const json: InputPluginImpl<JsonInputOptions> = (options: JsonInputOptions) => {
  return {
    name: InputSource.JSON,
    run: async () => await getIcons(options),
  };
};

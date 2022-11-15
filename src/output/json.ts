import { fs, path } from 'zx';
import { OutputOptions, OutputIcon, OutputTypes, OutputPluginImpl } from '../types.js';
import { logger, mergeOptions, getPath, addPrefix, writeSourceData } from '../utils/index.js';

const { readFile } = fs;
const { parse } = path;

export interface JsonOutputOptions extends OutputOptions {
  filename?: string;
}

export const defaultJsonOutputOption = {
  dir: 'src',
  filename: 'icons.json',
};

async function outputIcons(icons: OutputIcon[], options?: JsonOutputOptions): Promise<void> {
  logger.info('json output options:');
  console.log(options);
  console.log(icons.length);
  const { dir, filename } = mergeOptions<JsonOutputOptions>(defaultJsonOutputOption, options);
}

export const json: OutputPluginImpl<JsonOutputOptions> = (options?: JsonOutputOptions) => {
  return {
    name: OutputTypes.JSON,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

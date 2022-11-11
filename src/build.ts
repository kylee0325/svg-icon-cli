import { NormalizedIconConfig, SourceIcon } from './types.js';
import { logger, writeSourceData } from './utils/index.js';
import { sort, repeat, formatName, formatType } from './middleware/index.js';

/**
 * output icons
 * @param {*} outputs
 * @param {*} icons
 */
const outputIcons = async () => {};

/**
 * build icons
 * @param {*} config
 */
const buildIcons = async (config: NormalizedIconConfig) => {
  const defaultMiddleware = [sort, repeat, formatName, formatType];
  let { input: inputs, middleware = defaultMiddleware, output: outputs } = config;
  if (!inputs || inputs.length === 0) {
    logger.errorExit('input cannot be empty!');
  }

  let icons: SourceIcon[] = [];
  for await (const input of inputs) {
    const arr = await input.run();
    icons = icons.concat(arr);
  }
  writeSourceData(icons, 'source-icons');

  if (middleware && Array.isArray(middleware) && middleware.length > 0) {
    for await (const mw of middleware) {
      if (typeof mw === 'string') {
        const mwt = defaultMiddleware.find((item) => item.name === mw);
        if (mwt) {
          icons = await mwt.run(icons);
        }
      } else {
        icons = await mw.run(icons);
      }
    }
  }
  writeSourceData(icons, 'output-icons');
};

export { buildIcons, outputIcons };

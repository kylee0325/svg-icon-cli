import {
  NormalizedIconConfig,
  SourceIcon,
  InputPlugin,
  OutputIcon,
  OutputType,
  OutputTypes,
  OutputPlugin,
  Middleware,
  MiddlewareType,
} from './types.js';
import { logger, writeSourceData } from './utils/index.js';
import { sort, repeat, formatName, formatType } from './middleware/index.js';
import { json, svg, diff, symbol, component } from './output/index.js';

/**
 * input icons
 * @param {*} inputs
 */
const inputIcons = async (inputs: InputPlugin[]): Promise<SourceIcon[]> => {
  let icons: SourceIcon[] = [];
  for await (const input of inputs) {
    const arr = await input.run();
    icons = icons.concat(arr);
  }
  return icons;
};

const defaultMiddlewares = [sort, repeat, formatName, formatType];

/**
 * format icons
 * @param {*} icons
 * @param {*} middleware
 */
const formatIcons = async (
  icons: SourceIcon[],
  middleware: Array<Middleware | MiddlewareType>,
): Promise<OutputIcon[]> => {
  let arr = icons;
  if (middleware && Array.isArray(middleware) && middleware.length > 0) {
    for await (const mw of middleware) {
      if (typeof mw === 'string') {
        const mwt = defaultMiddlewares.find((item) => item.name === mw);
        if (mwt) {
          arr = mwt.run(arr);
        }
      } else {
        arr = mw.run(arr);
      }
    }
  }
  return arr;
};

/**
 * output icons
 * @param {*} icons
 * @param {*} outputs
 */
const outputIcons = async (icons: OutputIcon[], outputs: Array<OutputType | OutputPlugin>): Promise<void> => {
  if (!icons || icons.length === 0) {
    logger.error('output icons cannot be empty!');
  }

  if (outputs && Array.isArray(outputs) && outputs.length > 0) {
    // diff 文件需要在json前面输出
    const isDiff = (o: OutputType | OutputPlugin) => {
      const n = typeof o === 'string' ? o : o.name;
      return n === OutputTypes.DIFF;
    };
    outputs = outputs.sort((a, b) => (isDiff(a) ? 0 : 1) - (isDiff(b) ? 0 : 1));

    const defaultOutputs: Record<string, OutputPlugin> = {
      json: json(),
      svg: svg(),
      diff: diff(),
      symbol: symbol(),
      component: component(),
    };
    for await (const output of outputs) {
      if (typeof output === 'string') {
        const outputT = defaultOutputs[output];
        if (outputT) {
          await outputT.run(icons);
        }
      } else {
        await output.run(icons);
      }
    }
  }
};

/**
 * build icons
 * @param {*} config
 */
const buildIcons = async (config: NormalizedIconConfig) => {
  let { input: inputs, middleware = defaultMiddlewares, output: outputs } = config;
  if (!inputs || inputs.length === 0) {
    logger.errorExit('input cannot be empty!');
  }
  if (!outputs || outputs.length === 0) {
    logger.errorExit('output cannot be empty!');
  }

  let icons: SourceIcon[] = await inputIcons(inputs);

  writeSourceData(icons, 'source-icons');

  icons = await formatIcons(icons, middleware);

  writeSourceData(icons, 'output-icons');

  await outputIcons(icons, outputs);
};

export { buildIcons, inputIcons, formatIcons, outputIcons };

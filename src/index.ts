import * as input from './input/index.js';
import * as middleware from './middleware/index.js';
import * as output from './output/index.js';

import { IconConfig, NormalizedIconConfig, InputPlugin, OutputPlugin } from './types.js';

function formatOptions<T>(options: T | T[]): T[] {
  if (!Array.isArray(options)) {
    options = [options];
  }

  return options;
}

export function defineIconConfig(options: IconConfig | IconConfig[]): NormalizedIconConfig[] {
  if (!Array.isArray(options)) {
    options = [options];
  }

  const config: NormalizedIconConfig[] = options.map((option: IconConfig) => {
    return Object.assign(
      {},
      {
        ...option,
        input: formatOptions<InputPlugin>(option.input),
        output: formatOptions<OutputPlugin>(option.output),
      },
    );
  });

  return config;
}

export { input, middleware, output };

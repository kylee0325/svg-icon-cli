import JoyCon from 'joycon';
import { bundleRequire } from 'bundle-require';
import { isFunction, isObject } from 'lodash-es';
import { path, chalk } from 'zx';
import { IconConfig } from '../types.js';

/**
 * Load custom configuration
 */
export async function loadConfig(configFile: string): Promise<IconConfig | IconConfig[]> {
  const rootDir = process.cwd();
  const configJoycon = new JoyCon();
  const configPath = await configJoycon.resolve([configFile], rootDir, path.parse(rootDir).root);
  if (configPath) {
    const config = await bundleRequire({
      filepath: configPath,
    });

    const ret = config.mod.default || config.mod;
    let data = {};
    if (isFunction(ret)) {
      data = await ret();
    } else if (isObject(ret)) {
      data = ret;
    }

    if (!isObject(ret)) {
      throw new Error(
        `The content of ${chalk.cyan(
          `${configPath}`,
        )} or the return value type of the function needs to be an object type`,
      );
    }
    return data as IconConfig | IconConfig[];
  }
  return [] as IconConfig[];
}

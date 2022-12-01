import { fs, path } from 'zx';
import { OutputIcon, OutputTypes, OutputPluginImpl } from '../types.js';
import { logger, mergeOptions, getPath } from '../utils/index.js';
import { SvgOutputOptions, defaultSvgOutputOptions } from './common.js';

const { ensureDir, writeFile, emptyDir } = fs;
const { join } = path;

async function outputIcons(icons: OutputIcon[], options?: SvgOutputOptions): Promise<void> {
  logger.info('svg output options:');
  console.log(options);
  const { dir, formatName, formatContent } = mergeOptions<SvgOutputOptions>(defaultSvgOutputOptions, options);

  if (!dir) {
    return;
  }
  const fileDirPath = getPath(dir);
  // 先清空目录
  await ensureDir(fileDirPath);
  await emptyDir(fileDirPath);

  /**
   * 写入svg单文件
   * @returns
   */
  const writeSvgFile = async (body: string, name: string) => {
    const filePath = join(fileDirPath, `${name}.svg`);
    logger.info(`Create svg file: ${name}.svg, path: ${filePath}`);

    await writeFile(filePath, body, 'utf8');
  };

  await Promise.all(
    icons.map((icon) => {
      let name: string = icon.name;
      let content: string = icon.content!;
      if (formatName && typeof formatName === 'function') {
        name = formatName(name);
      }
      if (formatContent && typeof formatContent === 'function') {
        content = formatContent(content);
      }
      return writeSvgFile(content, name);
    }),
  );
}

export const svg: OutputPluginImpl<SvgOutputOptions> = (options?: SvgOutputOptions) => {
  return {
    name: OutputTypes.SVG,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

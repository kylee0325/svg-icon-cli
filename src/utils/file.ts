import { fs, path, argv } from 'zx';
import { logger } from './logger.js';
import { getBasePath, getPath } from './path.js';

const { readdir, stat, existsSync, readFile, ensureDir, writeFile, ensureFile, appendFile } = fs;

const { parse, join } = path;

/**
 * 写入模板文件
 * @param {string} outputDir
 * @param {string} file
 * @param {object} options
 */
export const writeTemplateFile = async (
  outputDir: string,
  file: string,
  options?: { format?: Function; log?: boolean },
): Promise<void> => {
  const { format, log = true } = options || {};
  outputDir = getPath(outputDir);
  const outputFile = join(outputDir, file);

  if (existsSync(outputFile)) {
    logger.errorExit(`操作失败，文件${file}已存在`);
  }

  let fileContent = await readFile(getBasePath(`/templates/${file}`), 'utf8');

  if (format && typeof format === 'function') {
    fileContent = format(fileContent);
  }

  await ensureDir(outputDir);
  await writeFile(outputFile, fileContent, function (err: any) {
    if (err) {
      logger.errorExit(`创建文件失败：${JSON.stringify(err)}`);
    } else if (log) {
      logger.success('创建文件成功！');
    }
  });
};

/**
 * 写入原始数据，开发用
 */
export const writeSourceData = async (
  data: any,
  file: string,
  options?: { append?: boolean; ext?: string; isString?: boolean },
) => {
  if (argv.d || argv.D || argv.debug) {
    if (!data || !file) {
      return;
    }
    try {
      const { append, ext = 'json', isString } = options || {};
      let dataStr = data;
      if (!isString) {
        dataStr = JSON.stringify(data, null, '\t');
      }
      const fileExt = `.${ext}`;
      const outputDir = join(getPath('debug'));
      const outputFile = join(outputDir, `${file}${file.endsWith(fileExt) ? '' : fileExt}`);
      await ensureDir(outputDir);
      if (append) {
        await ensureFile(outputFile);
        await appendFile(outputFile, dataStr, 'utf8');
      } else {
        await writeFile(outputFile, dataStr, 'utf8');
      }
    } catch (error) {}
  }
};

export const getFiles = async (dirPath: string): Promise<string[]> => {
  const pathInfo = parse(getPath(dirPath));

  if (pathInfo.ext) {
    logger.errorExit(`${dirPath} is not a dir path`);
    return [];
  }

  const fileArr: string[] = [];

  const exploreFiles = async (dir: string) => {
    const files = await readdir(dir);
    for await (const file of files) {
      const filePath = `${dir}/${file}`;
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await exploreFiles(filePath);
      } else {
        fileArr.push(filePath);
      }
    }
  };

  await exploreFiles(dirPath);

  return fileArr;
};

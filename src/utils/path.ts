import { fileURLToPath } from 'node:url';
import { path } from 'zx';

export function getBasePath(filePath: string): string {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), '../../', filePath);
}

export const getPath = (filePath: string): string => {
  if (path.isAbsolute(filePath)) {
    const cwd = process.cwd();
    return path.normalize(path.join(cwd, filePath));
  }
  return filePath;
};

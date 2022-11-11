import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import dts from 'rollup-plugin-dts';
import { fs } from 'zx';

const { readdir, stat, remove } = fs;

const fileArr = [];
const exploreFiles = async (path) => {
  const files = await readdir(path);
  for await (const file of files) {
    const filePath = `${path}/${file}`;
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      await exploreFiles(filePath);
    } else {
      fileArr.push(filePath);
    }
  }
};
await remove('dist');
await exploreFiles('./src');

const configs = [];

fileArr.map((file) => {
  const filePath = file.replace(/^\.\/src/, './dist');
  configs.push(
    {
      input: file,
      output: {
        file: filePath.replace(/\.ts$/, '.js'),
        format: 'esm',
      },
      plugins: [resolve(), commonjs(), typescript()],
      external: () => true,
    },
    {
      input: file,
      output: {
        file: filePath.replace(/\.ts$/, '.d.ts'),
        format: 'esm',
      },
      plugins: [dts()],
      external: () => true,
    },
  );
});

export default configs;

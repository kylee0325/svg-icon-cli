import { fs, path, $ } from 'zx';
import { OutputIcon, OutputTypes, OutputPluginImpl } from '../types.js';
import { logger, mergeOptions, getPath, withOrigin, addPrefix, writeTemplateFile } from '../utils/index.js';
import {
  ComponentFormatOptions,
  ComponentOutputOptions,
  defaultComponentOutputOptions,
  defaultFormatStyle,
  defaultFormatSvg,
  appendToIndex,
  getComponentName,
} from './common.js';
import { parseSync, stringify } from 'svgson';

const { join } = path;

const { ensureDir, writeFile, existsSync, mkdirSync, writeFileSync, emptyDir } = fs;

const defaultFormatComponent = ({ content, componentName, className, style }: ComponentFormatOptions) =>
  `<template>
    ${content}
</template>
<script>
export default {
    name: '${componentName}',
};
</script>
${
  (style &&
    `<style>
${style}
</style>`) ||
  ''
}`;

const defaultFormatComponentCss = ({ content, componentName }: ComponentFormatOptions) =>
  `<template>
  ${content}
</template>
<script>
import { useInsertStyles } from "./utils.js";

export default {
  name: '${componentName}',
  beforeCreate() {
    useInsertStyles();
  },
};
</script>
`;

async function outputIcons(icons: OutputIcon[], options?: ComponentOutputOptions): Promise<void> {
  logger.info('component output options:');
  console.log(options);
  const {
    dir,
    dirname,
    filename,
    className,
    tag,
    svgAttr,
    prefix,
    style,
    cssInjectedByJs = false,
    ext = 'vue',
    cssVars,
    hideCustomVar,
    formatStyle,
    formatSvg,
    formatComponent,
    formatExportString,
  } = mergeOptions<ComponentOutputOptions>(defaultComponentOutputOptions, options);

  if (!dir || !filename || !dirname) {
    return;
  }

  const fileDirPath = getPath(dir);
  const indexFilePath = join(fileDirPath, filename);
  const componentDirPath = join(fileDirPath, dirname);
  // 先清空components目录
  await ensureDir(fileDirPath);
  await ensureDir(componentDirPath);
  await emptyDir(componentDirPath);

  let styleContent = '';
  if (cssInjectedByJs) {
    await writeTemplateFile(componentDirPath, 'insert-css.js', { log: false });
    await writeTemplateFile(componentDirPath, 'utils.js', {
      format: (str: string) => {
        // 格式化style
        const styleParams = { className, style };
        styleContent = withOrigin({
          params: styleParams,
          defaultFn: defaultFormatStyle,
          customFn: formatStyle,
        });
        return str.replace('$target$', styleContent);
      },
      log: false,
    });
  }

  /**
   * 写入component单文件
   * @returns
   */
  const writeComponentFile = async ({
    content,
    name,
    componentName,
    type,
  }: {
    content: string;
    name: string;
    componentName: string;
    type: string;
  }) => {
    const filePath = join(componentDirPath, `${name}.${ext}`);
    logger.info(`Create icon component: ${componentName}, path: ${filePath}`);

    // 格式化svg
    const svgParams = {
      content,
      name,
      className,
      type,
      svgAttr,
      tag,
      cssVars,
      hideCustomVar,
      parse: parseSync,
      stringify,
    };
    const svgContent = withOrigin({
      params: svgParams,
      defaultFn: defaultFormatSvg,
      customFn: formatSvg,
    });

    // 格式化style
    if (!cssInjectedByJs) {
      const styleParams = { name, className, style };
      styleContent = withOrigin({
        params: styleParams,
        defaultFn: defaultFormatStyle,
        customFn: formatStyle,
      });
    }

    // 格式化组件
    const componentParams = {
      componentName,
      content: svgContent,
      className,
      name,
      tag,
      style: styleContent,
    };

    const componentStr = withOrigin({
      params: componentParams,
      defaultFn: cssInjectedByJs ? defaultFormatComponentCss : defaultFormatComponent,
      customFn: formatComponent,
    });

    await writeFile(filePath, componentStr, 'utf8');
  };

  // generate index file
  const generateIndex = () => {
    if (!existsSync(fileDirPath)) {
      mkdirSync(fileDirPath);
    } else if (!existsSync(componentDirPath)) {
      mkdirSync(componentDirPath);
    }

    writeFileSync(indexFilePath, '', 'utf-8');
  };

  generateIndex();

  await Promise.all(
    icons.map((icon) => {
      const iconName = icon.name;
      return writeComponentFile({
        type: icon.type!,
        content: icon.content!,
        name: iconName,
        componentName: addPrefix(iconName, prefix),
      });
    }),
  );

  for await (const icon of icons) {
    const iconName = icon.name;
    const componentName = getComponentName(iconName, prefix);

    await appendToIndex({
      componentName: componentName,
      name: iconName,
      file: indexFilePath,
      iconDir: dirname,
      ext,
      formatExportString,
    });
  }

  logger.info(`Create index file, path: ${indexFilePath}`);
  logger.success(`Create icon components success, total: ${icons.length}`);

  try {
    await $`prettier --write '${fileDirPath}/**/*'`;
  } catch (error) {}
}

export const component: OutputPluginImpl<ComponentOutputOptions> = (options?: ComponentOutputOptions) => {
  return {
    name: OutputTypes.COMPONENT,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

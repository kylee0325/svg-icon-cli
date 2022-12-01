import { fs, path, $ } from 'zx';
import { OutputIcon, OutputTypes, OutputPluginImpl, IconTypes } from '../types.js';
import { logger, mergeOptions, getPath, withOrigin, addPrefix, writeTemplateFile } from '../utils/index.js';
import {
  SvgFormatOptions,
  ComponentFormatOptions,
  ComponentImgOutputOptions,
  defaultComponentOutputOptions,
  defaultFormatStyle,
  appendToIndex,
  getComponentName,
} from './common.js';
import { parseSync, stringify } from 'svgson';

const { join } = path;

const { ensureDir, writeFile, existsSync, mkdirSync, writeFileSync, emptyDir } = fs;

const defaultFormatSvg = ({ content, type }: SvgFormatOptions) => {
  // 判断是否可变色
  const isConfigurable = type === IconTypes.CONFIGURABLE;
  // 去除svg标签中无用的width/height
  content = content.replace(/ width=".+?"/gi, '');
  content = content.replace(/ height=".+?"/gi, '');

  content = content.replace(/\n|\t/gi, '');
  if (isConfigurable) {
    // 颜色替换
    content = content.replace(/fill="none"/gi, 'fill-none');
    content = content.replace(/fill="(#FFFFFF|white)"/gi, 'white-color');
    content = content.replace(/fill=".+?"/gi, "fill='${this.color}'");
    content = content.replace(/stroke=".+?"/gi, "stroke='${this.color}'");
    content = content.replace(/white-color/gi, "fill='white'");
    content = content.replace(/fill-none/gi, "fill='none'");
  }

  return content;
};

const defaultFormatComponent = ({
  content,
  componentName,
  className,
  name,
  style,
  defaultColor = '',
  defaultSize = '16px',
}: ComponentFormatOptions) =>
  `<template>
    <img class="${className} ${className}-${name}" alt="${name}" :src="image" :style="{ fontSize }" />
</template>
<script>
export default {
    name: '${componentName}',
    props: {
        color: {
            type: String,
            default: '${defaultColor}',
        },
        size: {
            type: [Number, String],
            default: '${defaultSize}',
        },
    },
    computed: {
        image() {
            return \`data:image/svg+xml;base64,\${btoa(\`${content}\`)}\`;
        },
        fontSize() {
            return typeof this.size === "number" ? this.size + "px" : this.size;
        },
    },
};
</script>
${
  (style &&
    `<style>
${style}
</style>`) ||
  ''
}`;

const defaultFormatComponentCss = ({
  content,
  componentName,
  className,
  name,
  defaultColor = '',
  defaultSize = '16px',
}: ComponentFormatOptions) =>
  `<template>
    <img class="${className} ${className}-${name}" alt="${name}" :src="image" :style="{ fontSize }" />
</template>
<script>
import { useInsertStyles } from "./utils.js";

export default {
    name: '${componentName}',
    props: {
        color: {
            type: String,
            default: '${defaultColor}',
        },
        size: {
            type: [Number, String],
            default: '${defaultSize}',
        },
    },
    computed: {
        image() {
            return \`data:image/svg+xml;base64,\${btoa(\`${content}\`)}\`;
        },
        fontSize() {
            return typeof this.size === "number" ? this.size + "px" : this.size;
        },
    },
    beforeCreate() {
        useInsertStyles();
    },
};
</script>
`;

async function outputIcons(icons: OutputIcon[], options?: ComponentImgOutputOptions): Promise<void> {
  logger.info('component_bg output options:');
  console.log(options);
  defaultComponentOutputOptions.style = `display: inline-block;width: 1em;height: 1em;`;
  const {
    dir,
    dirname,
    filename,
    className,
    prefix,
    style,
    cssInjectedByJs = false,
    ext = 'vue',
    formatStyle,
    formatSvg,
    formatComponent,
    formatExportString,
  } = mergeOptions<ComponentImgOutputOptions>(defaultComponentOutputOptions, options);

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
    if (!$.env.TEST) {
      await $`prettier --write '${fileDirPath}/**/*'`;
    }
  } catch (error) {}
}

export const component_img: OutputPluginImpl<ComponentImgOutputOptions> = (options?: ComponentImgOutputOptions) => {
  return {
    name: OutputTypes.COMPONENT_IMG,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

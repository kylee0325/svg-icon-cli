import { fs } from 'zx';
import { IconType, IconTypes, OutputOptions } from '../types.js';
import { replaceColorHelper, toPascalCase, withOrigin } from '../utils/index.js';
import { parseSync, stringify } from 'svgson';

const { appendFile } = fs;

export interface FormatOptions {
  name: string;
  origin: string;
}

export interface StyleFormatOptions extends FormatOptions {
  className: string;
  style?: string;
}

export interface SvgFormatOptions extends FormatOptions {
  content: string;
  className: string;
  type: IconType;
  svgAttr?: string;
  tag?: string;
  cssVars?: Record<string, string>;
  hideCustomVar?: boolean;
  parse?: typeof parseSync;
  stringify?: typeof stringify;
}

export interface ComponentFormatOptions extends FormatOptions {
  content: string;
  componentName: string;
  className: string;
  tag?: string;
  defaultColor?: string;
  defaultSize?: string | number;
  style?: string;
}

export interface ExportStringFormatOptions extends FormatOptions {
  componentName: string;
  iconDir: string;
  ext: string;
}

export const CONFIG = {
  ROOT: 'src',
  JSON_FILE: 'icons.json',
  CLASS_NAME: 'svg-icon',
  STYLE: 'display:inline-block;width:1em;height:1em;font-size:16px;vertical-align:-0.125em;fill:currentColor;',
  COMPONENT_DIR: 'components',
  COMPONENT_ENTRY: 'index.js',
  EXT: 'vue',
};

// diff start
export interface DiffOutputOptions extends OutputOptions {
  jsonFile?: string;
}

export const defaultDiffOutputOptions: DiffOutputOptions = {
  dir: `${CONFIG.ROOT}/diff`,
  jsonFile: `${CONFIG.ROOT}/${CONFIG.JSON_FILE}`,
};
// diff end

// json start
export interface JsonOutputOptions extends OutputOptions {
  filename?: string;
}

export const defaultJsonOutputOptions: JsonOutputOptions = {
  dir: CONFIG.ROOT,
  filename: CONFIG.JSON_FILE,
};
// json end

// svg start
export interface SvgOutputOptions extends OutputOptions {
  formatName?: (name: string) => string;
  formatContent?: (content: string) => string;
}

export const defaultSvgOutputOptions: SvgOutputOptions = {
  dir: `${CONFIG.ROOT}/svg`,
};
// svg end

// symbol start
export interface SymbolOutputOptions extends OutputOptions {
  filename?: string;
  className?: string;
  style?: string;
  cssVars?: Record<string, string>;
  hideCustomVar?: boolean;
  formatStyle?: (opts: StyleFormatOptions) => string;
}

export const defaultSymbolOutputOptions: SymbolOutputOptions = {
  dir: CONFIG.ROOT,
  filename: CONFIG.CLASS_NAME,
  className: CONFIG.CLASS_NAME,
  style: CONFIG.STYLE,
};
// symbol end

// component start
export interface BaseComponentOutputOptions extends OutputOptions {
  dirname?: string;
  filename?: string;
  prefix?: string;
  className?: string;
  style?: string;
  cssInjectedByJs?: boolean;
  ext?: string;
  svgAttr?: string;
  tag?: string;
  defaultColor?: string;
  defaultSize?: string | number;
  cssVars?: Record<string, string>;
  hideCustomVar?: boolean;
  formatStyle?: (options: StyleFormatOptions) => string;
  formatSvg?: (options: SvgFormatOptions) => string;
  formatComponent?: (options: ComponentFormatOptions) => string;
  formatExportString?: (options: ExportStringFormatOptions) => string;
}

export type ComponentOutputOptions = Omit<BaseComponentOutputOptions, 'defaultColor' | 'defaultSize'>;

export type ComponentBgOutputOptions = Omit<BaseComponentOutputOptions, 'svgAttr' | 'cssVars' | 'hideCustomVar'>;

export type ComponentImgOutputOptions = Omit<
  BaseComponentOutputOptions,
  'tag' | 'svgAttr' | 'cssVars' | 'hideCustomVar'
>;

export const defaultComponentOutputOptions: ComponentOutputOptions = {
  dir: CONFIG.ROOT,
  dirname: CONFIG.COMPONENT_DIR,
  filename: CONFIG.COMPONENT_ENTRY,
  className: CONFIG.CLASS_NAME,
  style: CONFIG.STYLE,
  ext: CONFIG.EXT,
};
// component end

export const defaultFormatStyle = ({ name, className, style }: StyleFormatOptions) =>
  style ? `.${className}{${style}}` : '';

export const defaultFormatSvg = ({
  content,
  name,
  className,
  type,
  svgAttr,
  tag,
  cssVars,
  hideCustomVar,
}: SvgFormatOptions) => {
  // 判断是否固定色
  const isStatic = type === IconTypes.STATIC;
  const isMultiple = type === IconTypes.MULTIPLE;

  // 去除svg标签中无用的width/height
  content = content.replace(/ width=".+?"/gi, '');
  content = content.replace(/ height=".+?"/gi, '');

  // 固定色跳过颜色替换的逻辑
  if (!isStatic) {
    // 把白色跟none先替换成临时值
    content = content.replace(/fill="none"/gi, 'fill-none');
    content = content.replace(/fill="(#FFFFFF|white)"/gi, 'white-color');

    // 替换颜色
    const colorReplacer = replaceColorHelper({
      name: `${className}-${name}`,
      cssVars,
      isMultiple,
      hideCustomVar,
    }).replacer;
    content = content.replace(/fill=".+?"/gi, colorReplacer);
    content = content.replace(/stroke=".+?"/gi, colorReplacer);

    // 把白色跟none替换回来
    content = content.replace(/white-color/gi, 'fill="white"');
    content = content.replace(/fill-none/gi, 'fill="none"');
  }

  const cName = `${className} ${className}-${name}`;

  const ariaAttr = `focusable="false" data-icon="${name}" aria-hidden="true"`;
  const attr = typeof svgAttr !== 'undefined' ? svgAttr : `v-on="$listeners"`;

  const tagAttr = `role="img" aria-label="${name}"`;

  if (tag) {
    content = content.replace(/<svg/gi, `<svg ${ariaAttr}${attr || ' '}`);
    content = `<${tag} ${tagAttr} class="${cName}">
     ${content}
   </${tag}>`;
  } else {
    content = content.replace(/<svg/gi, `<svg ${tagAttr} class="${cName}" ${ariaAttr}${attr || ' '}`);
  }

  return content;
};

export const defaultFormatExportString = ({ componentName, iconDir, name, ext }: ExportStringFormatOptions) =>
  `export { default as ${componentName} } from './${iconDir}/${name}.${ext}';\r\n`;

interface AppendIndexOptions extends Omit<ExportStringFormatOptions, 'origin'> {
  file: string;
  formatExportString?: (options: ExportStringFormatOptions) => string;
}

export const appendToIndex = async ({
  componentName,
  iconDir,
  name,
  ext,
  file,
  formatExportString,
}: AppendIndexOptions) => {
  const exportStringParams = {
    componentName,
    iconDir,
    name,
    ext,
  };
  const exportString = withOrigin({
    params: exportStringParams,
    defaultFn: defaultFormatExportString,
    customFn: formatExportString,
  });
  await appendFile(file, exportString, 'utf-8');
};

export const getComponentName = (name: string, prefix?: string) => {
  return (prefix ? toPascalCase(prefix) : '') + toPascalCase(name);
};

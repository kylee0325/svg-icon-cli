import { fs, path } from 'zx';
import { OutputOptions, OutputIcon, OutputTypes, OutputPluginImpl, IconTypes } from '../types.js';
import { logger, mergeOptions, getPath, replaceColorHelper, withOrigin } from '../utils/index.js';
import { SvgFormatOptions, StyleFormatOptions, defaultFormatStyle } from './common.js';

const { join } = path;
const { ensureDir, writeFile, existsSync } = fs;

export interface SymbolOutputOptions extends OutputOptions {
  filename?: string;
  className?: string;
  style?: string;
  cssVars?: Record<string, string>;
  hideCustomVar?: boolean;
  formatStyle?: (opts: StyleFormatOptions) => string;
}

export const defaultSymbolOutputOptions: SymbolOutputOptions = {
  dir: 'src',
  filename: 'svg-icon',
  className: 'svg-icon',
  style: 'display:inline-block;width:1em;height:1em;fill:currentColor;vertical-align:-0.125em;font-size:16px;',
};

/**
 * 格式化svg内容
 * @param {Object} params
 * @returns {string}
 */
const formatSvg = ({ content, name, type, cssVars, hideCustomVar }: Omit<SvgFormatOptions, 'svgAttr' | 'tag'>) => {
  // 判断是否固定色
  const isStatic = type === IconTypes.STATIC;
  const isMultiple = type === IconTypes.MULTIPLE;

  content = content.replace(/\n|\t/gi, '');

  // 固定色跳过颜色替换的逻辑
  if (!isStatic) {
    // 把白色跟none先替换成临时值
    content = content.replace(/fill="none"/gi, 'fill-none');
    content = content.replace(/fill="(#FFFFFF|white)"/gi, 'white-color');

    const colorReplacer = replaceColorHelper({
      name,
      cssVars,
      isMultiple,
      hideCustomVar,
    }).replacer;

    // 替换颜色
    content = content.replace(/fill=".+?"/gi, colorReplacer);

    content = content.replace(/stroke=".+?"/gi, colorReplacer);

    // 把白色跟none替换回来
    content = content.replace(/white-color/gi, 'fill="white"');
    content = content.replace(/fill-none/gi, 'fill="none"');
  }

  // 去除无用属性
  content = content.replace(/(width|height|fill-rule|clip-rule)=".+?" /gi, '');

  // 替换成symbol
  content = content.replace(/<svg/gi, `<symbol id="${name}"`);
  content = content.replace(/<\/svg>/gi, '</symbol>');
  return content;
};

const formatOutput = ({ content, className, style }: { content: string; className: string; style: string }) => {
  const key = className.replace(/-/gi, '_');
  return `!function(t){var e,o,i,l,n,a='<svg>${content}</svg>',c=(c=document.getElementsByTagName("script"))[c.length-1].getAttribute("data-injectcss"),d=function(t,e){e.parentNode.insertBefore(t,e)};if(!t.__${key}__svg__cssinject__){t.__${key}__svg__cssinject__=!0;try{var style = document.createElement("style");const ct="${style}";try{style.appendChild(document.createTextNode(ct));} catch (ex) {style.styleSheet.cssText = ct;}var head = document.getElementsByTagName("head")[0];head.appendChild(style);}catch(t){console&&console.log(t)}}function s(){n||(n=!0,i())}function h(){try{l.documentElement.doScroll("left")}catch(t){return void setTimeout(h,50)}s()}e=function(){var t,e=document.createElement("div");e.innerHTML=a,a=null,(e=e.getElementsByTagName("svg")[0])&&(e.setAttribute("aria-hidden","true"),e.style.position="absolute",e.style.width=0,e.style.height=0,e.style.overflow="hidden",e=e,(t=document.body).firstChild?d(e,t.firstChild):t.appendChild(e))},document.addEventListener?~["complete","loaded","interactive"].indexOf(document.readyState)?setTimeout(e,0):(o=function(){document.removeEventListener("DOMContentLoaded",o,!1),e()},document.addEventListener("DOMContentLoaded",o,!1)):document.attachEvent&&(i=e,l=t.document,n=!1,h(),l.onreadystatechange=function(){"complete"==l.readyState&&(l.onreadystatechange=null,s())})}(window);`;
};

const formatComponent = ({ className }: { className: string }) =>
  `<template>
    <svg role="img" :aria-label="name" :class="['${className}', \`${className}-\${name}\`]" focusable="false" :data-icon="name" aria-hidden="true">
      <use :xlink:href="\`#\${name}\`" />
    </svg>
  </template>
  <script>
  export default {
    name: "svg-icon",
    props: {
      name: {
        type: String,
        required: true,
      },
    },
  };
  </script>`;

async function outputIcons(icons: OutputIcon[], options?: SymbolOutputOptions): Promise<void> {
  logger.info('symbol output options:');
  console.log(options);
  const { dir, filename, className, style, cssVars, hideCustomVar, formatStyle } = mergeOptions<SymbolOutputOptions>(
    defaultSymbolOutputOptions,
    options,
  );

  if (!dir || !filename) {
    return;
  }

  const fileDirPath = getPath(dir);

  await ensureDir(fileDirPath).then(async () => {
    const svgContent = icons
      .map((icon) => {
        // 格式化svg
        const svgParams = { name: icon.name, content: icon.content, type: icon.type, cssVars, hideCustomVar };
        return withOrigin({
          params: svgParams,
          defaultFn: formatSvg,
        });
      })
      .join('');

    // 格式化style
    const styleParams = { className, style };
    const styleContent = withOrigin({
      params: styleParams,
      defaultFn: defaultFormatStyle,
      customFn: formatStyle,
    });

    const outputContent = formatOutput({ content: svgContent, className: className!, style: styleContent });

    await writeFile(join(fileDirPath, `${filename}.js`), outputContent, 'utf8');

    logger.info(`Create file ${filename}.js success, path: ${fileDirPath}/${filename}.js`);

    const iconFile = join(fileDirPath, `${filename}.vue`);

    if (existsSync(iconFile)) {
      logger.success(`file ${filename}.vue already exists, skip creation`);
      return;
    }

    await writeFile(iconFile, formatComponent({ className: className! }), 'utf8');

    logger.success(`Create file ${filename}.vue success, path: ${fileDirPath}/${filename}.vue`);
  });
}

export const symbol: OutputPluginImpl<SymbolOutputOptions> = (options?: SymbolOutputOptions) => {
  return {
    name: OutputTypes.SYMBOL,
    run: async (icons: OutputIcon[]) => await outputIcons(icons, options),
  };
};

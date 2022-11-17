/**
 * Get svgContent from iconfont js file.
 * @param {string} str - A string.
 * @returns {string}
 */
export function getSvgContent(str: string): string {
  const reg = /<svg>.*?<\/svg>/gi;
  const arr = str.match(reg);
  return arr && arr.length ? arr[0] : '';
}

/**
 * 树形数组的遍历格式化(有返回值)
 * @param {T} tree
 * @param {Function} func 每一项执行的格式化函数，需要返回
 * @returns {T} tree
 */
export function formatTree<T>(tree: T[], func: (item: T) => T): T[] {
  if (!tree || !Array.isArray(tree)) {
    return [];
  }
  if (!func || typeof func !== 'function') {
    return tree;
  }
  return tree.map((item) => {
    // @ts-ignore
    const { children, ...rest } = item;
    if (children) {
      return {
        // @ts-ignore
        ...func({ ...rest }),
        children: formatTree(children, func),
      };
    }
    return func(item);
  });
}

/**
 * 给图标增加前缀
 * @param {string} name
 * @param {string} prefix
 * @returns {string}
 */
export function addPrefix(name: string, prefix: string): string {
  return `${prefix}${prefix && prefix.endsWith('-') ? '' : '-'}${name}`;
}

/**
 * 获取链接上的搜索参数
 * @param {string} url
 * @param {string} key
 */
export function getQueryParams(url: string, key: string): string {
  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  const params: Record<string, any> = {};
  paramArr.map((param) => {
    const [key, val] = param.split('=');
    params[key] = decodeURIComponent(val);
  });
  return key ? params[key] : params;
}

/**
 * 合并参数
 * @param {T} defaultOptions
 * @param {T} options
 * @returns {T}
 */
export function mergeOptions<T>(defaultOptions: T, options?: T): T {
  return Object.assign({}, defaultOptions, options);
}

export const padStart = (v: number): string => `${v < 10 ? '0' : ''}${v}`;

/**
 * 获取时间字符串
 */
export const getDateStr = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = padStart(date.getMonth() + 1);
  const day = padStart(date.getDate());
  const hour = padStart(date.getHours());
  const minute = padStart(date.getMinutes());
  const second = padStart(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export function formatCssVars(cssVars: Record<string, string>) {
  if (cssVars) {
    let o: Record<string, string> = {};
    Object.keys(cssVars).forEach((key) => {
      o[`${key}`.toUpperCase()] = cssVars[key];
    });
    return o;
  }
  return cssVars;
}

export function replaceColorHelper({
  name,
  cssVars,
  isMultiple = false,
  hideCustomVar = false,
}: {
  name: string;
  cssVars?: Record<string, string>;
  isMultiple?: boolean;
  hideCustomVar?: boolean;
}) {
  // 记录替换颜色值是否有相同的，相同者取相同的命名
  let o: Record<string, string> = {};
  return {
    replacer: (colorStr: string) => {
      const colorBase = colorStr.replace(/'|"|fill|stroke|=/g, '');
      const color = colorBase.toUpperCase();
      const str = isMultiple ? color : 'currentColor';

      let customVar = str;
      if (isMultiple && cssVars && cssVars[color]) {
        if (!o[color]) {
          const len = Object.values(o).length;
          o[color] = `--${name}${len ? len + 1 : ''}`;
        }
        if (hideCustomVar) {
          customVar = `var(${cssVars[color]}, ${str})`;
        } else {
          customVar = `var(${o[color]}, var(${cssVars[color]}, ${str}))`;
        }
      }
      return colorStr.replace(colorBase, customVar);
    },
  };
}

/**
 * 使参数带上origin
 */
export const withOrigin = ({ params, defaultFn, customFn }: any) => {
  let result = defaultFn(params);
  if (customFn && typeof customFn === 'function') {
    result = customFn({
      ...params,
      origin: result,
    });
  }
  return result;
};

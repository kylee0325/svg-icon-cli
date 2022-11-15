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

import { SourceIcon, OutputIcon, Middleware, IconType } from '../types.js';
import { logger } from '../utils/index.js';

function sortIcons(icons: SourceIcon[]): SourceIcon[] {
  return icons.sort((a, b) => a.name.localeCompare(b.name));
}

const sort: Middleware = {
  name: 'sort',
  run: sortIcons,
};

function hasRepeatIcon(icons: SourceIcon[]) {
  const listMap: Record<string, any> = {};
  const names: string[] = [];
  icons.forEach((i) => {
    if (listMap[i.name]) {
      names.push(i.name);
    }
    listMap[i.name] = true;
  });
  if (names.length > 0) {
    const errMessage = `存在相同命名的图标, 可能导致输出异常: ${names}`;
    logger.error(errMessage);
  }
  return icons;
}

const repeat: Middleware = {
  name: 'repeat',
  run: hasRepeatIcon,
};

function formatIconName(icons: SourceIcon[]): SourceIcon[] {
  return icons.map((icon) => {
    let iconName = icon.name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/_/g, '-')
      .replace(/--/g, '-');

    return {
      ...icon,
      name: iconName,
    };
  });
}

const formatName: Middleware = {
  name: 'formatName',
  run: formatIconName,
};

/**
 * Check iconType is fixed type.
 * @param {string} iconName - A string.
 * @returns {string}
 */
export function isType(iconName: string, type: IconType) {
  return iconName ? iconName.endsWith(type) : false;
}

/**
 * Get iconType of icon.
 * @param {string} iconName - A string.
 * @returns {string}
 */
export function getIconType(iconName: string): IconType {
  if (isType(iconName, IconType.STATIC)) {
    return IconType.STATIC;
  } else if (isType(iconName, IconType.MULTIPLE)) {
    return IconType.MULTIPLE;
  }
  return IconType.CONFIGURABLE;
}

function formatIconType(icons: SourceIcon[]): OutputIcon[] {
  return icons.map((icon) => {
    return {
      ...icon,
      type: getIconType(icon.name),
    };
  });
}

const formatType: Middleware = {
  name: 'formatType',
  run: formatIconType,
};

export { sort, repeat, formatName, formatType };

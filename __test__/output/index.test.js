import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { root, getTestPath, isFileExist, cleanRoot } from '../common';
import { output } from '../../src/index';
import { outputIcons } from '../../src/build';
import { OutputTypes } from '../../src/types';
import { logger } from '../../src/utils';
import { icons } from '../common/data';

const isComponentFileExist = () => isFileExist('icons/index.js') && isFileExist('icons/components/add.vue');
const isComponentBgFileExist = () => isFileExist('bg-icons/index.js') && isFileExist('bg-icons/components/add.vue');
const isComponentImgFileExist = () => isFileExist('img-icons/index.js') && isFileExist('img-icons/components/add.vue');
const isDiffFileExist = () => isFileExist('diff/');
const isSvgFileExist = () => isFileExist('svg/add.svg');
const isSymbolFileExist = () => isFileExist('svg-icon/svg-icon.vue') && isFileExist('svg-icon/svg-icon.js');
const isJsonFileExist = () => isFileExist('icons.json');

describe('output/check output type', () => {
  beforeAll(() => {
    root.reset();
    logger.hideLog();
  });

  afterEach(async () => {
    await cleanRoot();
  });

  afterAll(() => logger.showLog());

  const config = [
    output.svg({
      dir: getTestPath('svg'),
    }),
    output.diff({ dir: getTestPath('diff'), jsonFile: getTestPath('icons.json') }),
    output.json({ dir: getTestPath() }),
    output.symbol({
      dir: getTestPath('svg-icon'),
    }),
    output.component({
      dir: getTestPath('icons'),
    }),
    output.component_bg({
      dir: getTestPath('bg-icons'),
    }),
    output.component_img({
      dir: getTestPath('img-icons'),
    }),
  ];

  it(
    '给定全部输出类型，输出正确',
    async () => {
      const c = config.concat([]);

      await outputIcons(icons, c);

      expect(isComponentFileExist()).toEqual(true);
      expect(isComponentBgFileExist()).toEqual(true);
      expect(isComponentImgFileExist()).toEqual(true);
      expect(isDiffFileExist()).toEqual(true);
      expect(isSvgFileExist()).toEqual(true);
      expect(isSymbolFileExist()).toEqual(true);
      expect(isJsonFileExist()).toEqual(true);
    },
    { timeout: 20000 },
  );

  const actionMap = {
    SVG: (v) => expect(isSvgFileExist()).toEqual(v),
    DIFF: (v) => expect(isDiffFileExist()).toEqual(v),
    JSON: (v) => expect(isJsonFileExist()).toEqual(v),
    COMPONENT: (v) => expect(isComponentFileExist()).toEqual(v),
    COMPONENT_BG: (v) => expect(isComponentBgFileExist()).toEqual(v),
    COMPONENT_IMG: (v) => expect(isComponentImgFileExist()).toEqual(v),
    SYMBOL: (v) => expect(isSymbolFileExist()).toEqual(v),
  };

  const testSome = async (arr = []) => {
    const keys = Object.keys(OutputTypes);
    arr.forEach((ele) => {
      const key = ele.name.toUpperCase();
      if (keys.includes(key)) {
        actionMap[key] && actionMap[key](true);
        keys.splice(keys.indexOf(key), 1);
      }
    });
    keys.forEach((key) => {
      actionMap[key] && actionMap[key](false);
    });
  };

  it(
    '给定任意一种输出类型，输出正确',
    async () => {
      for await (const item of config) {
        let c = [item];
        if (item.name === OutputTypes.DIFF) {
          c = [item, config[2]];
        }
        await cleanRoot();
        await outputIcons(icons, c);

        await testSome(c);
      }
    },
    { timeout: 20000 },
  );
});

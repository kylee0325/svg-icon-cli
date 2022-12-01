import { describe, it, beforeAll, afterAll } from 'vitest';
import { input } from '../../src/index';
import { inputIcons } from '../../src/build';
import { logger } from '../../src/utils';
import { checkInputIcons } from '../common';

describe('input/inputIcons', () => {
  beforeAll(() => {
    logger.hideLog();
  });

  afterAll(() => logger.showLog());

  it(
    '给定iconfont配置，正常输出图标',
    async () => {
      const config = {
        url: '//at.alicdn.com/t/c/font_3618149_92hhy4flyeb.js',
      };

      const icons = await inputIcons([input.iconfont(config)]);

      checkInputIcons(icons);
    },
    { timeout: 5000 },
  );
});

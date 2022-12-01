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
    '给定json配置，正常输出图标',
    async () => {
      const config = {
        file: '__test__/common/icons.json',
      };

      const icons = await inputIcons([input.json(config)]);

      checkInputIcons(icons);

      const config2 = {
        file: '__test__/common/icons.js',
      };

      const icons2 = await inputIcons([input.json(config2)]);

      checkInputIcons(icons2);
    },
    { timeout: 5000 },
  );
});

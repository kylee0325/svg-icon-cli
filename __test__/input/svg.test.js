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
    '给定svg配置，正常输出图标',
    async () => {
      const config = {
        dir: '__test__/common/svg',
      };

      const icons = await inputIcons([input.svg(config)]);

      checkInputIcons(icons);
    },
    { timeout: 5000 },
  );
});

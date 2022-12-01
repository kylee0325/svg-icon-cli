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
    '给定figma配置，正常输出图标',
    async () => {
      const config = {
        token: '291200-0792e958-bc89-47ab-8a04-12478816ec02',
        url: 'https://www.figma.com/file/IEzK7h0fkCRtMpwOJWTrLp/%40gdesign%2Ficons?node-id=1%3A2088&t=L80XpSpyv0KKVpNa-0',
      };

      const icons = await inputIcons([input.figma(config)]);

      checkInputIcons(icons);
    },
    { timeout: 20000 },
  );
});

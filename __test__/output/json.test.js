import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { root, getTestPath, isFileExist, cleanRoot } from '../common';
import { output } from '../../src/index';
import { outputIcons } from '../../src/build';
import { logger } from '../../src/utils';
import { icons } from '../common/data';

describe('output/json', () => {
  beforeAll(() => {
    root.update('json');
    logger.hideLog();
  });

  afterEach(async () => {
    await cleanRoot();
  });

  afterAll(() => logger.showLog());

  it('给定dir，输出正确', async () => {
    const config = [output.json({ dir: getTestPath() })];

    await outputIcons(icons, config);

    expect(isFileExist('icons.json')).toEqual(true);
  });

  it('变更dir，输出正确', async () => {
    const config = [output.json({ dir: getTestPath('main') })];

    await outputIcons(icons, config);

    expect(isFileExist('icons.json')).toEqual(false);
    expect(isFileExist('main/icons.json')).toEqual(true);
  });

  it('给定正确filename，输出正确', async () => {
    const config = [output.json({ dir: getTestPath(), filename: 'icons2.json' })];

    await outputIcons(icons, config);

    expect(isFileExist('icons.json')).toEqual(false);
    expect(isFileExist('icons2.json')).toEqual(true);
  });

  it('给定错误filename，输出正确', async () => {
    const config = [output.json({ dir: getTestPath(), filename: 'icons2.js' })];

    await outputIcons(icons, config);

    expect(isFileExist('icons.json')).toEqual(false);
    expect(isFileExist('icons2.js')).toEqual(false);
    expect(isFileExist('icons2.json')).toEqual(true);
  });
});

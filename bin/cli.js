#!/usr/bin/env node
import 'zx/globals';
import { path, fs, argv } from 'zx';
import { logger, getBasePath, writeTemplateFile, loadConfig } from '../dist/utils/index.js';
import { buildIcons } from '../dist/build.js';

const { join } = path;
const { existsSync, readJson } = fs;

chalk.level = 1;
$.verbose = false;

await (async function main() {
  logger.log('argv', argv);

  if (argv.v || argv.V || argv.version) {
    const version = await getVersion();
    console.log(version);
    return;
  }

  if (argv.h || argv.help) {
    printUsage();
    return;
  }

  if (argv._.includes('init')) {
    writeTemplateFile('./', 'svg-icon.config.ts');
    return;
  }

  if (argv._.includes('template')) {
    const index = argv._.findIndex((item) => item === 'template');
    const outputDir = argv._[index + 1] || './';

    const choices = ['icon', 'preview', 'both'];

    const res = await question(
      '请选择你想要的模板 => icon: 集成所有图标的Icon组件模板, preview: 图标预览页模板, both: 全部',
      {
        choices,
      },
    );

    if (!choices.includes(res)) {
      logger.errorExit(`该选项无效：${res}`);
    }

    if (res === 'icon' || res === 'both') {
      writeTemplateFile(outputDir, 'icon.vue');
    }

    if (res === 'preview' || res === 'both') {
      writeTemplateFile(outputDir, 'preview.vue');
    }
    return;
  }

  if (argv._.includes('build')) {
    const index = argv._.findIndex((item) => item === 'build');
    const configFile = argv._[index + 1] || 'svg-icon.config.ts';
    const configFilePath = join(process.cwd(), configFile);
    if (!existsSync(configFilePath)) {
      logger.errorExit(`配置文件不存在：${configFile}`);
    }

    const configs = await loadConfig(join(process.cwd(), configFile));
    logger.success('完整配置信息：');
    console.log(configs);
    console.log(JSON.stringify(configs, '', 2));

    logger.warn('开始拉取图标文件');
    const isMultiple = configs.length > 1;
    for await (const config of configs) {
      if (isMultiple) {
        logger.warn('执行当前配置：');
        console.log(JSON.stringify(config, '', 2));
      }
      await buildIcons(config);
      if (isMultiple) {
        logger.success('执行当前配置成功');
      }
    }
    logger.success('拉取图标文件成功');
    return;
  }

  printUsage();
})().catch((err) => {
  console.error(err);
});

async function getVersion() {
  let { version } = await readJson(getBasePath('package.json'));
  return version;
}

async function printUsage() {
  const version = await getVersion();
  console.log(`
 ${chalk.bold('svg-icon-cli ' + version)}
   A command-line interface for managing svg icons. 
   It can do many things, such as convert icons from figma/iconfont to svg files/components, generate iconfont file from figma icons, etc.

 ${chalk.bold('Usage')}
   svg-icon-cli [options]

 ${chalk.bold('Options')}
   init                   init config file
   build [configFile]     build icons
   template [outputDir]   write template files
   --version, -v          print current version
   --help, -h             print help
`);
}

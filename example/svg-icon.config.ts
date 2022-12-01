import { defineIconConfig, input, middleware, output } from '../dist/index.js';

const { iconfont, figma, svg, json } = input;
const { repeat, sort } = middleware;

export default defineIconConfig({
  input: [
    // figma({
    //   token: '291200-0792e958-bc89-47ab-8a04-12478816ec02',
    //   url: 'https://www.figma.com/file/lNtZjYrzLjkZohZLP0OVnz/123',
    //   modules: ['通用图标'],
    //   prefix: 'figma',
    //   filter: (icon, index, array) => {
    //     return index < 5;
    //   },
    // }),
    // iconfont({
    //   url: '//at.alicdn.com/t/c/font_3618149_92hhy4flyeb.js',
    //   prefix: 'iconfont',
    //   filter(icon, index, array) {
    //     return index < 4;
    //   },
    // }),
    svg({
      prefix: 'svg',
      dir: 'input/svg',
      //   filter(icon, index, array) {
      //     return index < 4;
      //   },
    }),
    json({
      prefix: 'json',
      file: 'input/icons.json',
      //   filter(icon, index, array) {
      //     return index < 4;
      //   },
    }),
  ],
  middleware: ['formatName', 'repeat', 'sort', 'formatType'],
  output: [
    // 'json',
    // 'svg',
    // 'diff',
    output.json({ dir: 'src/components', filename: 'icon.js' }),
    output.svg({
      dir: 'src/components/svg',
      formatName(name) {
        return name.replace(/-([a-z])/g, (s) => s.replace(/-/g, '').toUpperCase());
      },
      formatContent(content) {
        return content.replace(/<svg/g, '<svg focusable="false"');
      },
    }),
    output.diff({ dir: 'src/components/diff', jsonFile: 'src/icons.js' }),
    // 'symbol',
    output.symbol({
      dir: 'src/components/svg-icon',
      filename: 'index',
      className: 'fly-icon',
      style: 'width: 1em;',
      formatStyle(o) {
        // console.log('o', o);
        return o.origin;
      },
    }),
    // 'component',
    output.component({
      dir: 'src/components/icons',
      className: 'fly-icon',
      tag: 'i',
      cssInjectedByJs: true,
      svgAttr: '',
      formatSvg(o) {
        // console.log('o', o.parse && o.parse(o.origin));
        return o.origin;
      },
      cssVars: {
        '#B4B8BF': '--main-color',
        '#222529': '--second-color',
      },
    }),
  ],
});

import { defineIconConfig, input, middleware } from 'svg-icon-cli';

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
      filter(icon, index, array) {
        return index < 4;
      },
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
  output: [],
});

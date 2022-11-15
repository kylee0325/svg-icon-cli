import { defineIconConfig, input, middleware } from 'svg-icon-cli';
// import { defineIconConfig, input, middleware } from '../src';

const { iconfont, figma, svg, json } = input;
const { repeat, sort } = middleware;

export default defineIconConfig({
  input: [
    figma({
      token: '',
      url: '',
      modules: ['通用图标'],
      prefix: 'figma',
      filter: (icon, index, array) => {
        return index < 5;
      },
    }),
    iconfont({
      url: '',
      prefix: 'iconfont',
      filter(icon, index, array) {
        return index < 4;
      },
    }),
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
      filter(icon, index, array) {
        return index < 4;
      },
    }),
  ],
  middleware: ['formatName', 'repeat', 'sort', 'formatType'],
  output: [],
});

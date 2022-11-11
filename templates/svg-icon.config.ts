import { defineIconConfig, input } from 'svg-icon-cli';
// import { defineIconConfig, input } from '../src';

const { iconfont } = input;

export default defineIconConfig({
  input: [
    iconfont({
      url: '//at.alicdn.com/t/c/font_3618149_92hhy4flyeb.js',
      prefix: 'fly',
      filter(icon, index, array) {
        return index < 4;
      },
    }),
  ],
  output: [],
});

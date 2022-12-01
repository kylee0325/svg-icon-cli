import { defineIconConfig, input, middleware } from 'svg-icon-cli';

const { iconfont, figma, svg, json } = input;
const { repeat, sort } = middleware;

const cssVars = {
  '#B4B8BF': '--main-color',
  '#222529': '--second-color',
};

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
      cssVars,
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
      cssVars,
    }),
    output.component_bg({
      dir: 'src/components/bg-icons',
      className: 'bg-icon',
      tag: 'span',
      cssInjectedByJs: true,
    }),
    output.component_img({
      dir: 'src/components/img-icons',
      className: 'img-icon',
      cssInjectedByJs: true,
    }),
  ],
});

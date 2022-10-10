import { defineIconConfig, InputType, OutputType } from "@gaoding/gdicon-cli";

export default defineIconConfig({
  input: [
    {
      type: InputType.FIGMA,
      token: "",
      url: "",
    },
    // {
    //   type: InputType.ICONFONT,
    //   url: "",
    // },
  ],
  output: [
    {
      type: OutputType.COMPONENT,
    },
    // {
    //   type: OutputType.SYMBOL,
    // },
    // {
    //   type: OutputType.DIFF,
    // },
    // {
    //   type: OutputType.JSON,
    // },
    // {
    //   type: OutputType.SVG,
    // },
  ],

  // 数据源，可传对象或数组
  // input: [
  //   {
  //     type: InputType.FIGMA,
  //     token: "291200-0792e958-bc89-47ab-8a04-12478816ec02", // figma图标拉取时所需的token（必填）
  //     url: "https://www.figma.com/file/lNtZjYrzLjkZohZLP0OVnz/123", // figma图标文件地址（必填）
  //     prefix: "", // 图标name的前缀, 为了防止不同input间有同名的图标
  //     modules: [], // 自定义选择 figma 模块内的图标进行输出
  //     filter: (icon: Icon, index: number, array: Array<Icon>) => boolean; // 过滤图标的函数
  //     formatIconName?: (name: string) => string; // 格式化图标的名称
  //     formatIconType?: (name: string) => IconType; // 格式化图标的类型
  //     // 可根据需求，过滤掉不需要的图标
  //     filter: (icon, index, array) => {
  //       return icon.type === "configurable";
  //     },
  //     // 可自定义修改图标的名称
  //     formatIconName: (name) => {
  //       return name.replace('Icon', '');
  //     },
  //     // 可自定义控制图标的类型，默认为name后面为static的图标是固定色的，其他为可变色
  //     formatIconType: (name) => {
  //       return name.indexOf('static')? "static" : "configurable";
  //     },
  //   },
  //   {
  //     type: InputType.ICONFONT,
  //     url: "//at.alicdn.com/t/c/font_3618149_92hhy4flyeb.js", // iconfont图标文件地址（必填）
  //     prefix: "", // 图标name的前缀, 为了防止不同input间有同名的图标
  //     filter: (icon: Icon, index: number, array: Array<Icon>) => boolean; // 过滤图标的函数
  //     formatIconName?: (name: string) => string; // 格式化图标的名称
  //     formatIconType?: (name: string) => IconType; // 格式化图标的类型
  //   },
  // ],

  // 输出，可传对象或数组，可选类型: component-组件, diff-差异对比文件, json-图标数据json文件, svg-全部svg文件, symbol-输出类似 iconfont symbol 方式的文件
  // output: [
  //   {
  //     type: OutputType.JSON,
  //     dir: "", // 图标数据json文件输出目录, 选填, 默认 "src"
  //     filename: "", // 图标数据json文件的文件名, 选填, 默认 "icons.json"
  //   },
  //   {
  //     type: OutputType.SVG,
  //     dir: "", // svg文件输出目录, 选填, 默认 "src/svgs"
  //   },
  //   {
  //     type: OutputType.DIFF,
  //     dir: "", // diff文件输出目录, 选填, 默认 "src/diff"
  //   },
  //   {
  //     type: OutputType.SYMBOL,
  //     dir: "", // 文件输出目录, 选填, 默认 "src"
  //     className: "gdicon", // 图标组件上的class名
  //     style: "display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;", // 图标的默认样式
  //   },
  //   {
  //     type: OutputType.COMPONENT,
  //     format: "", // 预置的格式化方式, 选填, 默认 "vue", 可选 vue: 使用svg标签的vue组件; img: 使用img标签的vue组件
  //     dir: "", // 输出图标组件的目录, 选填, 默认 "src"
  //     dirname: "", // 图标组件输出时内部目录的名称, 选填, 默认 "components"
  //     filename: "", // 输出图标组件的入口文件名, 选填, 默认 "index.js"
  //     prefix: "icon", // 生成图标组件的前缀
  //     className: "gdicon", // 图标组件上的class名
  //     tag: "span", // format=bg时生效，自定义组件的标签
  //     defaultColor: "", // format=img|bg时生效，图标组件默认颜色值
  //     defaultSize: "", // format=img|bg时生效，图标组件默认大小
  //     svgAttr: 'aria-hidden="true" v-on="$listeners"', // format=vue时有效，svg标签上额外的属性
  //     style: "display: inline-block;width: 1em;height: 1em;vertical-align: -0.15em;font-size:20px;", // 图标的默认样式
  //     formatSvg: (options: SvgFormatOptions) => string; // 自定义格式化 svg 的函数
  //     formatComponent?: (options: ComponentFormatOptions) => string; // 自定义格式化组件的函数
  //     formatExportString?: (options: ExportStringFormatOptions) => string; // 自定义格式化导出组件的字符串

  //     //自定义格式化函数的使用方法，先通过formatSvg格式化svg，返回参数以svgContent传入formatComponent格式化组件
  //     formatSvg: ({ name, content, className, type }) => {
  //       const str = `${name}+${content}+${className}+${type}`;
  //       console.log(`formatSvg-${name}`, str);
  //       return str;
  //     },
  //     formatComponent: ({ svgContent, componentName }) => {
  //       const str = `${svgContent}+${componentName}`;
  //       console.log(`formatComponent-${componentName}`, str);
  //       return str;
  //     },
  //     //自定义index文件内导出组件的字符串，如：export { default as IconAdd } from './components/add.vue';
  //     formatExportString: ({ componentName, iconDirName, name }) =>
  //       `export { default as ${componentName} } from './${
  //         iconDirName || "components"
  //       }/${name}.vue';\r\n`,
  //   },
  // ],
});

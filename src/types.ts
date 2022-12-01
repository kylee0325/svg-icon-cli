export const InputTypes = {
  FIGMA: 'figma',
  ICONFONT: 'iconfont',
  SVG: 'svg',
  JSON: 'json',
} as const;

export type InputType = typeof InputTypes[keyof typeof InputTypes];

export interface SourceIcon {
  name: string;
  content?: string;
  source?: InputType;
}

export interface InputOptions {
  prefix?: string;
  filter?: (icon: SourceIcon, index: number, array: Array<SourceIcon>) => boolean;
}

export const IconTypes = {
  CONFIGURABLE: 'configurable',
  STATIC: 'static',
  MULTIPLE: 'multiple',
} as const;

export type IconType = typeof IconTypes[keyof typeof IconTypes];

export interface OutputIcon extends SourceIcon {
  type?: IconType;
}

export interface Middleware {
  name: string;
  run: (icons: SourceIcon[]) => OutputIcon[];
}

export const MiddlewareTypes = {
  REPEAT: 'repeat',
  SORT: 'sort',
  FORMAT_TYPE: 'formatType',
  FORMAT_NAME: 'formatName',
} as const;

export type MiddlewareType = typeof MiddlewareTypes[keyof typeof MiddlewareTypes];

export const OutputTypes = {
  SVG: 'svg',
  DIFF: 'diff',
  JSON: 'json',
  SYMBOL: 'symbol',
  COMPONENT: 'component',
  COMPONENT_IMG: 'component_img',
  COMPONENT_BG: 'component_bg',
} as const;

export type OutputType = typeof OutputTypes[keyof typeof OutputTypes];

export interface OutputOptions {
  dir?: string;
}

export interface InputPlugin {
  name: string;
  run: () => Promise<SourceIcon[]>;
}

export type InputPluginImpl<O extends object = object> = (options: O) => InputPlugin;

export interface OutputPlugin {
  name: string;
  run: (icons: OutputIcon[]) => Promise<void>;
}

export type OutputPluginImpl<O extends object = object> = (options?: O) => OutputPlugin;

export interface IconConfig {
  input: InputPlugin | InputPlugin[];
  middleware?: Array<Middleware | MiddlewareType>;
  output: OutputType | OutputPlugin | Array<OutputType | OutputPlugin>;
}

export interface NormalizedIconConfig {
  input: InputPlugin[];
  middleware?: Array<Middleware | MiddlewareType>;
  output: Array<OutputType | OutputPlugin>;
}

export enum InputSource {
  FIGMA = 'figma',
  ICONFONT = 'iconfont',
  SVG = 'svg',
  JSON = 'json',
}

export interface SourceIcon {
  name: string;
  content?: string;
  source?: InputSource;
}

export interface InputOptions {
  prefix?: string;
  filter?: (icon: SourceIcon, index: number, array: Array<SourceIcon>) => boolean;
}

export interface IconfontInputOptions extends InputOptions {
  url: string;
}

export interface FigmaInputOptions extends InputOptions {
  url: string;
  token: string;
  modules?: string[];
}

export interface SvgInputOptions extends InputOptions {
  dir: string;
}

export interface JsonInputOptions extends InputOptions {
  file: string;
}

export enum IconType {
  CONFIGURABLE = 'configurable',
  STATIC = 'static',
  MULTIPLE = 'multiple',
}

export interface OutputIcon extends SourceIcon {
  type?: IconType;
}

export interface Middleware {
  name: string;
  run: (icons: SourceIcon[]) => OutputIcon[];
}

export interface OutputOptions {
  name: string;
}

export interface InputPlugin {
  name: string;
  run: () => Promise<SourceIcon[]>;
}

export type InputPluginImpl<O extends object = object> = (options: O) => InputPlugin;

export interface OutputPlugin {
  name: string;
  run: (options: OutputOptions) => Promise<void>;
}

export type OutputPluginImpl<O extends object = object> = (options: O) => OutputPlugin;

export type MiddlewareType = 'repeat' | 'sort' | 'formatType' | 'formatName';

export interface IconConfig {
  input: InputPlugin | InputPlugin[];
  middleware?: Array<Middleware | MiddlewareType>;
  output: OutputPlugin | OutputPlugin[];
}

export interface NormalizedIconConfig {
  input: InputPlugin[];
  middleware?: Array<Middleware | MiddlewareType>;
  output: OutputPlugin[];
}

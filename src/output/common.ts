import { IconType } from '../types.js';

export interface FormatOptions {
  name: string;
  origin: string;
}

export interface StyleFormatOptions extends FormatOptions {
  className: string;
  style?: string;
}

export interface SvgFormatOptions extends FormatOptions {
  content: string;
  className: string;
  type: IconType;
  svgAttr?: string;
  tag?: string;
  cssVars?: Record<string, string>;
  hideCustomVar?: boolean;
}

export interface ComponentFormatOptions extends FormatOptions {
  content: string;
  componentName: string;
  className: string;
  tag?: string;
  defaultColor?: string;
  defaultSize?: string | number;
  style?: string;
}

export interface ExportStringFormatOptions extends FormatOptions {
  componentName: string;
  iconDir: string;
}

export const defaultFormatStyle = ({ name, className, style }: StyleFormatOptions) => `.${className}{${style}}`;

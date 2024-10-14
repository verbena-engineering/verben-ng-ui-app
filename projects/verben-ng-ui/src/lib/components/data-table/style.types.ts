export interface BaseStyles {
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  background?: string;
  backgroundColor?: string;
  color?: string;
  shadow?: string;
  boxShadow?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  verticalAlign?: string;
  cursor?: string;
  overflow?: string;
  zIndex?: string;
  opacity?: string;
}

interface NTHStyles {
  interval?: number;
  style?: BaseStyles;
}

export interface TableSectionStyles {
  even?: BaseStyles;
  odd?: BaseStyles;
  nth?: NTHStyles;
}

export interface TableStyles extends BaseStyles {
  rows?: TableSectionStyles | BaseStyles;
  cells?: TableSectionStyles | BaseStyles;
  footer?: BaseStyles;
  header?: BaseStyles;
  borderCollapse?: 'separate' | 'collapse';
  borderSpacing?: string;
}

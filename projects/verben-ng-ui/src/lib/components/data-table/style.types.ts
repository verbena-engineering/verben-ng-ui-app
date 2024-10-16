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
  borderRadius?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  verticalAlign?: string;
  cursor?: string;
  opacity?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  zIndex?: string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
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
  body?: BaseStyles;
  tableLayout?: 'auto' | 'fixed';
  borderCollapse?: 'separate' | 'collapse';
  borderSpacing?: string;
}

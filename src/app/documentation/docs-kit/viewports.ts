/** A preview width the docs can switch to (the icon is an SVG path, 24×24) */
export interface DocsViewport {
  label: string;
  width: string;
  icon: string;
}

const DESKTOP = 'M3 4h18v12H3zM8 20h8M12 16v4';
const TABLET = 'M6 2h12v20H6zM11 18h2';
const PHONE = 'M8 2h8v20H8zM11 18h2';

/** Playground pages: they use the whole content width, so a tablet size is useful */
export const PLAYGROUND_VIEWPORTS: DocsViewport[] = [
  { label: 'Desktop', width: '100%', icon: DESKTOP },
  { label: 'Tablet (768px)', width: '768px', icon: TABLET },
  { label: 'Mobile (390px)', width: '390px', icon: PHONE },
];

/** Component examples: the docs column is about 800px, so only full and phone sizes */
export const EXAMPLE_VIEWPORTS: DocsViewport[] = [
  { label: 'Full width', width: '100%', icon: DESKTOP },
  { label: 'Mobile (390px)', width: '390px', icon: PHONE },
];

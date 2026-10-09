/*
 * Lets docs pages show a real source file as code, so it can't drift from
 * what runs (esbuild import attribute, see the Vendor Invoices playground):
 *   import html from './x.component.html' with { loader: 'text' };
 */
declare module '*.html' {
  const text: string;
  export default text;
}

declare module '*.css' {
  const text: string;
  export default text;
}

declare module '*.scss' {
  const text: string;
  export default text;
}

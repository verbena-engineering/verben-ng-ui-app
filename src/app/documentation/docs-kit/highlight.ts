/**
 * Tiny syntax highlighter for the docs code blocks (no extra dependency).
 * Returns HTML with <span class="tok-*"> wrappers; colors live in docs.scss.
 * Everything is escaped, so the result is safe to bind with [innerHTML].
 */

export type DocsLang = 'html' | 'ts' | 'css' | 'bash' | 'text';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const tok = (kind: string, s: string) =>
  `<span class="tok-${kind}">${escape(s)}</span>`;

export function highlightCode(code: string, lang: DocsLang): string {
  switch (lang) {
    case 'html':
      return highlightHtml(code);
    case 'ts':
      return highlightTs(code);
    case 'css':
      return highlightCss(code);
    case 'bash':
      return highlightBash(code);
    default:
      return escape(code);
  }
}

// Walks the template: comments, tags (name, attributes, values), {{ }} and text
function highlightHtml(src: string): string {
  let out = '';
  let i = 0;
  const rest = () => src.slice(i);

  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i);
      const j = end < 0 ? src.length : end + 3;
      out += tok('comment', src.slice(i, j));
      i = j;
      continue;
    }

    const tag = /^<\/?[\w-]+/.exec(rest());
    if (tag) {
      const closing = tag[0].startsWith('</');
      out += tok('punct', closing ? '</' : '<');
      out += tok('tag', tag[0].slice(closing ? 2 : 1));
      i += tag[0].length;

      while (i < src.length && src[i] !== '>' && !src.startsWith('/>', i)) {
        const space = /^\s+/.exec(rest());
        const attr = /^[^\s=>/"']+/.exec(rest());
        if (space) {
          out += space[0];
          i += space[0].length;
        } else if (attr) {
          out += tok('attr', attr[0]);
          i += attr[0].length;
        } else if (src[i] === '"' || src[i] === "'") {
          const end = src.indexOf(src[i], i + 1);
          const j = end < 0 ? src.length : end + 1;
          out += tok('string', src.slice(i, j));
          i = j;
        } else {
          out += tok('punct', src[i]);
          i++;
        }
      }
      if (src.startsWith('/>', i)) {
        out += tok('punct', '/>');
        i += 2;
      } else if (src[i] === '>') {
        out += tok('punct', '>');
        i++;
      }
      continue;
    }

    if (src.startsWith('{{', i)) {
      const end = src.indexOf('}}', i);
      const j = end < 0 ? src.length : end + 2;
      out += tok('interp', src.slice(i, j));
      i = j;
      continue;
    }

    let j = i + 1;
    while (j < src.length && src[j] !== '<' && !src.startsWith('{{', j)) j++;
    out += escape(src.slice(i, j));
    i = j;
  }
  return out;
}

const TS_KEYWORDS =
  'import|from|export|class|const|let|var|new|return|if|else|this|constructor|' +
  'private|public|protected|readonly|implements|extends|interface|type|async|' +
  'await|true|false|null|undefined|of|in|for|void|string|number|boolean|any';

// One regex, one capture group per token kind (order matters)
const TS_RE = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // 1 comment
    String.raw`('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|` + '`(?:\\\\.|[^`\\\\])*`)', // 2 string
    String.raw`(@\w+)`, // 3 decorator
    String.raw`\b(${TS_KEYWORDS})\b`, // 4 keyword
    String.raw`\b(\d+(?:\.\d+)?)\b`, // 5 number
    String.raw`\b([A-Z][A-Za-z0-9_]*)\b`, // 6 type / class
    String.raw`\b([a-z_$][\w$]*)(?=\s*\()`, // 7 function call
  ].join('|'),
  'g',
);
const TS_KINDS = ['', 'comment', 'string', 'decorator', 'keyword', 'number', 'type', 'fn'];

function highlightTs(src: string): string {
  return replaceTokens(src, TS_RE, TS_KINDS);
}

const CSS_RE =
  /(\/\*[\s\S]*?\*\/)|('[^']*'|"[^"]*")|(--[\w-]+)|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%)?)|(@[\w-]+)/g;
const CSS_KINDS = ['', 'comment', 'string', 'attr', 'number', 'keyword'];

function highlightCss(src: string): string {
  return replaceTokens(src, CSS_RE, CSS_KINDS);
}

function highlightBash(src: string): string {
  return src
    .split('\n')
    .map((line) =>
      line.trim().startsWith('#')
        ? tok('comment', line)
        : line.replace(/^(\s*)(\S+)(.*)$/, (_, sp, cmd, args) =>
            sp + tok('fn', cmd) + escape(args),
          ),
    )
    .join('\n');
}

function replaceTokens(src: string, re: RegExp, kinds: string[]): string {
  let out = '';
  let last = 0;
  re.lastIndex = 0;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    out += escape(src.slice(last, m.index));
    const group = m.findIndex((g, idx) => idx > 0 && g !== undefined);
    out += tok(kinds[group], m[0]);
    last = m.index + m[0].length;
  }
  return out + escape(src.slice(last));
}

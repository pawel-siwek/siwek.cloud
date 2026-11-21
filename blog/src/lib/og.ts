import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const font = (p: string) => readFileSync(require.resolve(p));

// fontsource subsets are disjoint (latin has no Ł, latin-ext has no A–Z), so each subset gets its own
// family name and every fontFamily lists both; satori falls back glyph by glyph.
const ANTON = 'Anton, "Anton Ext"';
const NARROW = '"Archivo Narrow", "Archivo Narrow Ext"';

const fonts = [
  { name: 'Anton', data: font('@fontsource/anton/files/anton-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Anton Ext', data: font('@fontsource/anton/files/anton-latin-ext-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Archivo Narrow', data: font('@fontsource/archivo-narrow/files/archivo-narrow-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Archivo Narrow Ext', data: font('@fontsource/archivo-narrow/files/archivo-narrow-latin-ext-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
];

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function renderOg(title: string, kicker: string, footer: string): Promise<Buffer> {
  // Explicit inner box (no padding on the root) so nothing depends on satori's box model.
  const W = 1200, H = 630, BAR = 14, PX = 72, PY = 56;
  const inner = { w: W - 2 * PX, h: H - BAR - 2 * PY };
  const tree = el('div', { width: W, height: H, display: 'flex', flexDirection: 'column', background: '#0B0E18', color: '#FFFFFF' }, [
    el('div', { width: W, height: BAR, background: '#5BC9B0' }),
    el(
    'div',
    { width: inner.w, height: inner.h, margin: `${PY}px ${PX}px`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    [
      el('div', { display: 'flex', fontFamily: NARROW, fontSize: 26, letterSpacing: 6, color: '#5BC9B0', textTransform: 'uppercase' }, kicker),
      el('div', { display: 'flex', width: inner.w, fontFamily: ANTON, fontSize: title.length > 60 ? 68 : 84, lineHeight: 1.04, textTransform: 'uppercase' }, title),
      el('div', { display: 'flex', width: inner.w, justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: NARROW, fontSize: 24, letterSpacing: 4, color: '#C5C6CB', textTransform: 'uppercase' }, [
        el('div', { display: 'flex', fontFamily: ANTON, fontSize: 40, letterSpacing: 0, color: '#FFFFFF' }, [
          el('span', {}, 'SIWEK'),
          el('span', { color: '#5BC9B0' }, '.CLOUD'),
        ]),
        el('div', { display: 'flex' }, footer),
      ]),
    ],
    ),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

export const WIDTH = 1200;
export const HEIGHT = 630;

export const palettes = [
  { name: "Petrol & amber", paper: "#d8c79f", ink: "#153c3d", dark: "#182526", accent: "#bd793b" },
  { name: "Plum & oxidised teal", paper: "#d9c8ad", ink: "#4a2941", dark: "#28202b", accent: "#4f9187" },
  { name: "Oxblood & terminal green", paper: "#d3c09a", ink: "#713746", dark: "#282427", accent: "#77936d" },
  { name: "Midnight & faded coral", paper: "#cec3aa", ink: "#27364c", dark: "#20252e", accent: "#b96358" },
  { name: "Tobacco & electric violet", paper: "#d5bd91", ink: "#695137", dark: "#29231f", accent: "#77577f" },
  { name: "Graphite & signal blue", paper: "#d4cdb9", ink: "#3b3c3d", dark: "#202426", accent: "#397a8e" },
];

export const compositions = ["The fold", "The eclipse", "The archive", "The signal", "The aperture"];

export function hashSeed(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const points = (values) => values.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function artwork(index, palette, random) {
  if (index === 0) {
    const top = 390 + random() * 260;
    const bottom = 250 + random() * 250;
    const seam = 26 + random() * 42;
    return `
      <rect width="1200" height="630" fill="${palette.paper}"/>
      <polygon points="${points([[top, 0], [1200, 0], [1200, 630], [bottom, 630]])}" fill="${palette.ink}"/>
      <polygon points="${points([[top, 0], [top + seam, 0], [bottom + seam, 630], [bottom, 630]])}" fill="${palette.accent}"/>
      <polygon points="${points([[0, 504], [bottom, 630], [0, 630]])}" fill="${palette.dark}" opacity=".52"/>`;
  }

  if (index === 1) {
    const x = WIDTH * (0.46 + random() * 0.18);
    const y = HEIGHT * (0.42 + random() * 0.14);
    const radius = 250 + random() * 85;
    const start = [x + Math.cos(Math.PI * 0.12) * (radius + 44), y + Math.sin(Math.PI * 0.12) * (radius + 44)];
    const end = [x + Math.cos(Math.PI * 1.18) * (radius + 44), y + Math.sin(Math.PI * 1.18) * (radius + 44)];
    return `
      <rect width="1200" height="630" fill="${palette.dark}"/>
      <circle cx="${x}" cy="${y}" r="${radius}" fill="${palette.paper}"/>
      <circle cx="${x + radius * 0.38}" cy="${y - radius * 0.08}" r="${radius * 0.93}" fill="${palette.ink}"/>
      <path d="M ${start[0]} ${start[1]} A ${radius + 44} ${radius + 44} 0 1 1 ${end[0]} ${end[1]}" fill="none" stroke="${palette.accent}" stroke-width="16"/>`;
  }

  if (index === 2) {
    const lean = -70 + random() * 140;
    const widths = [0.47, 0.24, 0.13];
    const colors = [palette.dark, palette.ink, palette.accent];
    const plates = widths.map((ratio, i) => {
      const x = 120 + i * 175 + random() * 70;
      const width = WIDTH * ratio;
      return `<polygon points="${points([[x + lean, 0], [x + width + lean, 0], [x + width, 630], [x, 630]])}" fill="${colors[i]}"/>`;
    }).join("");
    return `<rect width="1200" height="630" fill="${palette.paper}"/>${plates}<rect x="876" width="3" height="630" fill="${palette.paper}" opacity=".34"/>`;
  }

  if (index === 3) {
    const rise = 120 + random() * 190;
    return `
      <rect width="1200" height="630" fill="${palette.ink}"/>
      <polygon points="${points([[0, 630], [0, 630 - rise], [1200, 120], [1200, 630]])}" fill="${palette.dark}"/>
      <path d="M -80 478.8 L 1296 138.6" stroke="${palette.paper}" stroke-width="68"/>
      <path d="M -70 516.6 L 1296 176.4" stroke="${palette.accent}" stroke-width="12"/>`;
  }

  const x = WIDTH * (0.48 + random() * 0.14);
  const y = HEIGHT * (0.48 + random() * 0.08);
  return `
    <rect width="1200" height="630" fill="${palette.paper}"/>
    <circle cx="${x}" cy="${y}" r="520" fill="${palette.dark}"/>
    <circle cx="${x}" cy="${y}" r="374.4" fill="${palette.ink}"/>
    <circle cx="${x}" cy="${y}" r="223.6" fill="${palette.accent}"/>
    <circle cx="${x}" cy="${y}" r="98.8" fill="${palette.paper}"/>
    <rect width="168" height="630" fill="${palette.dark}"/>`;
}

export function coverSvg(seed, options = {}) {
  const value = seed.trim() || "untitled";
  const seedHash = hashSeed(value);
  const random = makeRandom(seedHash);
  const paletteIndex = options.palette === "auto" || options.palette === undefined
    ? seedHash % palettes.length
    : Math.max(0, Math.min(palettes.length - 1, Number(options.palette) || 0));
  const compositionIndex = options.composition === "auto" || options.composition === undefined
    ? Math.floor(seedHash / palettes.length) % compositions.length
    : Math.max(0, Math.min(compositions.length - 1, Number(options.composition) || 0));
  const patina = Math.max(0, Math.min(24, Number(options.patina) || 0));
  const palette = palettes[paletteIndex];
  const stains = Array.from({ length: 34 }, () => {
    const radius = 30 + random() * 125;
    const fill = random() > 0.42 ? "#5b3923" : "#efdaaf";
    return `<ellipse cx="${random() * WIDTH}" cy="${random() * HEIGHT}" rx="${radius}" ry="${radius * (0.45 + random())}" transform="rotate(${random() * 180})" fill="${fill}" opacity="${0.025 + random() * 0.045}"/>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <filter id="stains" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="38"/></filter>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".58" numOctaves="2" seed="${seedHash % 997}"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <radialGradient id="edge"><stop offset="0" stop-color="#301d19" stop-opacity="0"/><stop offset=".72" stop-color="#301d19" stop-opacity="0"/><stop offset="1" stop-color="#301d19" stop-opacity="${patina / 145}"/></radialGradient>
    </defs>
    <g>${artwork(compositionIndex, palette, random)}</g>
    <rect width="1200" height="630" fill="#704b2a" opacity="${patina / 300}" style="mix-blend-mode:multiply"/>
    <g filter="url(#stains)" opacity="${Math.min(1, patina / 18)}" style="mix-blend-mode:soft-light">${stains}</g>
    <rect width="1200" height="630" filter="url(#grain)" opacity="${patina / 520}" style="mix-blend-mode:soft-light"/>
    <rect width="1200" height="630" fill="url(#edge)"/>
  </svg>`;

  return { svg, seedHash, paletteIndex, compositionIndex, palette, composition: compositions[compositionIndex] };
}

// Determinism guard: changing this value redraws every published cover.
console.assert(hashSeed("when-an-mcp-client-knocks") === 0x5d11b44c, "endpaper hash changed");

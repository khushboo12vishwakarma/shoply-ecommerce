export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

// Generates a clean SVG placeholder image (data URI) from the product name.
export const placeholder = (text = "Product") => {
  const initials = text.slice(0, 18);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <rect width='100%' height='100%' fill='#e2e8f0'/>
    <text x='50%' y='50%' font-family='Inter, sans-serif' font-size='22'
      fill='#64748b' text-anchor='middle' dominant-baseline='middle'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

import localFont from "next/font/local";

const base = "../node_modules/@fontsource";

export const body = localFont({
  src: [
    { path: `${base}/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2`, weight: "400" },
    { path: `${base}/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2`, weight: "500" },
    { path: `${base}/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2`, weight: "600" },
  ],
  display: "swap",
});

export const mono = localFont({
  src: [
    { path: `${base}/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2`, weight: "400" },
    { path: `${base}/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2`, weight: "500" },
  ],
  display: "swap",
});

export const display = localFont({
  src: [
    { path: `${base}/fraunces/files/fraunces-latin-500-normal.woff2`, weight: "500", style: "normal" },
    { path: `${base}/fraunces/files/fraunces-latin-600-normal.woff2`, weight: "600", style: "normal" },
    { path: `${base}/fraunces/files/fraunces-latin-500-italic.woff2`, weight: "500", style: "italic" },
    { path: `${base}/fraunces/files/fraunces-latin-600-italic.woff2`, weight: "600", style: "italic" },
  ],
  display: "swap",
});
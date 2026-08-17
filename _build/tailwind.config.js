// Mirrors the config previously passed inline to the Tailwind Play CDN
// in _layouts/xnu_base.html. Regenerate the compiled stylesheet with
// `make tailwind` (see Makefile) after changing classes in xnu pages.
module.exports = {
  darkMode: 'class',
  content: [
    '../_layouts/xnu_base.html',
    '../_layouts/xnu_product.html',
    '../_layouts/xnu_privacy.html',
    '../_layouts/sw_docs.html',
    '../_includes/xnu/**/*.html',
    '../_data/xnu.json',
    '../_data/scriptwidget.json',
    '../projects/**/*.html',
    '../plainmd/**/*.html',
    '../remoboard/**/*.html',
    '../countmydays/**/*.html',
    '../scriptwidget/**/*.html',
    '../notbadbookmark/**/*.html',
    '../bssidscan/**/*.html',
    '../jsondiff/**/*.html',
    '../babeltable/**/*.html',
    '../startmyapp/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cascadia Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', 'monospace'],
        mono: ['Cascadia Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};

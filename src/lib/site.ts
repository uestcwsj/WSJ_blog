export const siteConfig = {
  title: 'Mobinets Blog',
  description: 'Notes on engineering, networks, local experiments, and internet deployment.',
  navItems: [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
  ],
};

export function buildAbsoluteUrl(href: string, siteUrl: string): string {
  if (!href) {
    throw new Error('href is required');
  }

  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  return new URL(normalizedHref, siteUrl).toString();
}

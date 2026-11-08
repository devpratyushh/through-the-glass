/** Prefix internal links and assets when the site is hosted under a repository path. */
export function sitePath(path: string) {
  return `${process.env.NEXT_PUBLIC_PORTFOLIO_BASE_PATH ?? ''}${path}`;
}

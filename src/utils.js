export function parsePage(link) {
  try {
    const pageInfo = link.split(',') || [];
    const pageLinks = [];
    const pages = {};

    for (let i = 0, max = pageInfo.length; i < max; i++) {
      pageLinks.push(pageInfo[i].split('; '));
    }

    for (let i = 0, max = pageLinks.length; i < max; i++) {
      const key = pageLinks[i][1].replace(/rel=/ig, '').replace(/"/g, '');
      const page = pageLinks[i][0].trim().replace(/.*page=(\d+)>+/ig, '$1');

      pages[key] = page;
    }

    return pages;
  } catch (e) {
    return {};
  }
};

export function truncate(n, useWordBoundary) {
  if (!this) {
    return null;
  }

  const isTooLong = this.length > n;
  let s_ = isTooLong ? this.substr(0, n-1) : this;
  s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;

  return isTooLong ? s_ + '...' : s_;
};

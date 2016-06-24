export function parsePage(link) {
  try {
    var pageInfo = link.split(',');
    var pageLinks = [];

    for (var i = 0, max = pageInfo.length; i < max; i++) {
      pageLinks.push(pageInfo[i].split('; '));
    }

    var pages = {};
    for (var i = 0, max = pageLinks.length; i < max; i++) {
      var key = pageLinks[i][1].replace(/rel=/ig, '').replace(/"/g, '');
      var page = pageLinks[i][0].trim().replace(/.*page=(\d+)>+/ig, '$1');

      pages[key] = page;
    }

    return pages;
  } catch (e) {
    return {};
  }
};

export function truncate(n, useWordBoundary) {
  const isTooLong = this.length > n;
  let s_ = isTooLong ? this.substr(0,n-1) : this;
  s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;

  return isTooLong ? s_ + '...' : s_;
};

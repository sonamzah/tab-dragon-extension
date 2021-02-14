export const getDomain = function (url) {
  let domain = url.split('//');
  domain = domain[1].split('/');
  return domain[0];
};

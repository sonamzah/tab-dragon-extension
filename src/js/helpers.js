export const getDomain = function (url) {
  let domain = url.split('//');
  domain = domain[1].split('/');
  return domain[0];
};

// * (shortens a string to 'length' chars)
export const truncToNumChars = function (str, length) {
  try {
    if (isNaN(length)) throw new Error('Argument (length) must be number');

    return str.slice(0, length);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

//source: https://levelup.gitconnected.com/different-ways-to-check-if-an-object-is-empty-in-javascript-e1252d1c0b34
export const isEmpty = function (obj) {
  return Object.keys(obj).length === 0;
};

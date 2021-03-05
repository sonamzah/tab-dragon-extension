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
export const isString = function (val) {
  if (typeof val === 'string' || val instanceof String) return true;
  else return false;
};

// Pass in an object literal or variable storing object literal
// Returns bytes of JSON stringified obj
export const calcBytes = function (obj) {
  try {
    //credit to solution: https://stackoverflow.com/questions/23318037/size-of-json-object-in-kbs-mbs#:~:text=from(JSON.,you%20the%20number%20of%20bytes.
    // const size = encodeURI(JSON.stringify(obj)).split(/%..|./).length - 1; // A flexible solution -- see last solution of first answer @ credit link
    return new TextEncoder().encode(JSON.stringify(obj)).length; // works on browsers and Node
  } catch (err) {
    console.log(`🍎 Calc Bytes: ${err.message}`);
    throw err;
  }
};

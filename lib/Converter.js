const IS_INTEGER_REGEX = /^-?\d+$/;
const IS_NUMERIC_REGEX = /^-?[0-9]\d*(\.\d+)?$/;

export function convert(value) {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (IS_INTEGER_REGEX.test(value)) {
    return parseInt(value);
  } else if (IS_NUMERIC_REGEX.test(value)) {
    return parseFloat(value);
  }
  return value;
}

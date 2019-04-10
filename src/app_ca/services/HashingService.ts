import md5 from 'js-md5';

export const makeId = (input: string|number) => {
  return md5(String(input)).substr(0, 6);
};

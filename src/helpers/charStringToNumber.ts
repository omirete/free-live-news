const charStringToNumber = (str: string): number => {
  let n = 0;
  for (var i = 0; i < str.length; i++) {
    n += str.charCodeAt(i);
  }
  return n;
};

export default charStringToNumber;

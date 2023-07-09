// @ts-check

export default function (source) {
  const options = this.getOptions();
  const result = source.replace(/NAME/g, options.word);
  return result;
}

// @ts-check

/**
 * @param {string} source
 * @returns
 */
function loader(source) {
  if (this.getOptions().type === "text") {
    return `
      export default ${JSON.stringify(source)};
    `;
  } else {
    return `
      const style = document.createElement('style');
      style.innerHTML = ${JSON.stringify(source)};
      export default style;
    `;
  }
}

export default loader;

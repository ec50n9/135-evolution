// @ts-check

/**
 * @param {string} source
 * @returns
 */
function loader(source) {
  const {type} = this.getOptions()
  if (type === "text") {
    return `
      export default ${JSON.stringify(source)};
    `;
  }
  else if(type === 'gm') {
    return `GM_addStyle(${JSON.stringify(source)});`
  }
  else {
    return `
      const style = document.createElement('style');
      style.innerHTML = ${JSON.stringify(source)};
      export default style;
    `;
  }
}

export default loader;

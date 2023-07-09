/**
 * @param {string} htmlText
 */
function loader(htmlText) {
  if (this.getOptions().type === "text") {
    return `
      export default ${JSON.stringify(htmlText)};
    `;
  } else {
    return `
    const temp = document.createElement("template");
    temp.innerHTML = \`${htmlText}\`;
    const html = temp.content;
    export default html;
  `;
  }
}

export default loader;

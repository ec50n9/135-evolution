// 添加样式
// export const addStyle = function (styleText, document) {
//   (document ? document : $("head")).append($(`<style>${styleText}</style>`));
// };

/**
 * 添加样式
 * @param {string} cssText
 * @param {Element} target
 */
export function addStyle(cssText, target) {
  const style = document.createElement("style");
  style.textContent = cssText;
  (target ?? document.head).append(style);
}

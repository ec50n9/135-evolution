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

/**
 * 获取当前环境
 * @returns {'135' | '96' | '365' | 'MP' | 'unknown'}
 */
export function getEnv() {
  const host = window.location.host;
  if (host.search(/www.135editor.com/) >= 0) return "135";
  else if (host.search(/bj.96weixin.com/) >= 0) return "96";
  else if (host.search(/www.365editor.com/) >= 0) return "365";
  else if (host.search(/mp.weixin.qq.com/) >= 0) return "MP";
  else return "unknown";
};

// 添加样式
export const addStyle = function (styleText, document) {
  (document ? document : $("head")).append($(`<style>${styleText}</style>`));
};

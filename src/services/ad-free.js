const run135 = function () {
  // 隐藏广告
  const needHide = [
    // 去除小红点
    ".user-unread-msgnum",
    // 顶部公告栏
    "#top-style-tools",
    // 底部版权栏
    "#editor-footer",
    // 顶部导航栏后两个按钮
    ".category-nav.editor-nav>.nav-item:nth-last-child(-n+5)",
    // 移除全局菜单中非功能设置按钮
    "#fixed-side-bar li:not(#function-settings), #fixed-bar-pack-up",
    // 素材库提示
    ".intal",
  ];
  document.querySelectorAll(needHide.join(",")).forEach((el) => {
    el.remove();
  });

  // 解除模板会员限制
  setInterval(() => {
    const needHide = [
      // 会员弹窗
      "#add_xiaoshi",
    ];
    document.querySelectorAll(needHide.join(",")).forEach((el) => {
      el.style.display = "none";
    });

    let lis = document.querySelectorAll("#editor-template-scroll li");
    for (let i = 0, len = lis.length; i < len; i++) {
      lis[i].classList.remove("vip-style");
    }
    // vip删除线
    document.querySelectorAll(".vip-flag").forEach((el) => el.remove());
    try {
      // 文章管理器会员
      articleManager.setVIP(true);
    } catch (error) {}
  }, 1000);
  // 去除会员弹窗
  unsafeWindow.style_click = unsafeWindow.show_role_vip_dialog = function () {};
  style_click = show_role_vip_dialog = function () {};
  // 伪装登录
  // window.loged_user = 1;
};

/**
 * @param {JQuery<any>} ec_window
 */
const run96 = function () {
  // vip样式
  setInterval(() => {
    // $(".rich_media_content").attr("data-vip", 1);
    document.querySelectorAll(".rich_media_content").forEach((el) => {
      el.setAttribute("data-vip", 1);
    });
  }, 1000);
};

export default function (globalContext) {
  ({
    135: run135,
    96: run96,
  })[globalContext.data.env]?.();
}

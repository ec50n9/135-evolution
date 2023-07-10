// @ts-check

// @ts-ignore
import evolution_btn_html from "../html/mp/evolution-btn.html";
// @ts-ignore
import seprator_html from "../html/mp/seprator.html";
// @ts-ignore
import mp_css from "../css/mp.css";
import { addStyle } from "../utils/inject-util.js";
import evolution from "../components/evolution.js";

/**
 * @param {JQuery<any>} ec_window
 */
const run135 = function (ec_window) {
  // 解除模板会员限制
  setInterval(() => {
    let lis = $("#editor-template-scroll li");
    for (let i = 0, len = lis.length; i < len; i++) {
      lis[i].classList.remove("vip-style");
    }
    // vip删除线
    $(".vip-flag").remove(); // .css('text-decoration', 'line-through').removeClass('vip-flag');
    // 去除小红点
    $(".user-unread-msgnum").hide();
    try {
      // 文章管理器会员
      articleManager.setVIP(true);
    } catch (error) {}
  }, 1000);
  // 去除会员弹窗
  unsafeWindow.style_click = unsafeWindow.show_role_vip_dialog = function () {
    console.log("hey!");
  };
  style_click = show_role_vip_dialog = function () {};
  // 伪装登录
  // window.loged_user = 1;
  // 会员弹窗
  $("#add_xiaoshi").hide();
  // 顶部导航栏后两个按钮
  $(".category-nav.editor-nav>.nav-item:nth-last-child(-n+2)").hide();
  // 移除全局菜单中非功能设置按钮
  $("#fixed-side-bar li:not(#function-settings), #fixed-bar-pack-up").hide();
  // 进化按钮
  let evolution_btn = $(
    '<li style="margin-bottom: 20px;"><a href="javascript:;" id="ec-change" class="btn btn-default btn-xs" title="绑定监听器">编辑进化</a></li>'
  ).on("click", ()=>evolution(ec_window));
  $("#operate-tool").prepend(evolution_btn);
  // 色板按钮
  let open_color_plan = $(
    '<li><a href="javascript:;" class="btn btn-default btn-xs" title="打开色板">开关色板</a></li>'
  ).on("click", function () {
    $("#color-plan").fadeToggle(300);
  });
  $("#operate-tool").prepend(open_color_plan);
};

/**
 * @param {JQuery<any>} ec_window
 */
const run96 = function (ec_window) {
  // vip样式
  setInterval(() => {
    $(".rich_media_content").attr("data-vip", 1);
  }, 1000);
  // 进化按钮
  let evolution_btn = $(
    '<button type="button" id="ec-change" class="layui-btn layui-btn-primary">编辑进化</button>'
  ).on("click", ()=>evolution(ec_window));
  $(".button-tools").prepend(evolution_btn);
};

/**
 * @param {JQuery<any>} ec_window
 */
const run365 = function (ec_window) {
  let evolution_btn = $(
    '<li id="ec-change" data-act="import"><span>编辑进化</span></li>'
  ).on("click", ()=>evolution(ec_window));
  $(".m-tools").prepend(evolution_btn);
};

/**
 * 微信公众号编辑器
 * @param {JQuery<any>} ec_window
 */
const runMP = function (ec_window) {
  addStyle(mp_css);
  const separator = $(seprator_html);
  const evolution_btn = $(evolution_btn_html).on("click", ()=>evolution(ec_window, (isRunning)=>{
    if (isRunning) {
      evolution_btn.css({ "background-color": "#20a162" });
    } else {
      evolution_btn.css({ "background-color": "#e8b004" });
    }
  }));
  $("#js_toolbar_0").append(separator).append(evolution_btn);
};

/**
 * @param {JQuery<any>} ec_window
 */
export default function (ec_window) {
  const host = window.location.host;
  if (host.search(/www.135editor.com/) >= 0) run135(ec_window);
  else if (host.search(/bj.96weixin.com/) >= 0) run96(ec_window);
  else if (host.search(/www.365editor.com/) >= 0) run365(ec_window);
  else if (host.search(/mp.weixin.qq.com/) >= 0) runMP(ec_window);
}

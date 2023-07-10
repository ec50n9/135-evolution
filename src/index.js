// @ts-check
import global_style from "./index.css";
import ec_window_ele from "./ec_window.html";
import useColorPanel from "./components/use-color-panel.js";
import useDrag from "./components/use-drag.js";
import run from "./components/run.js";
import { addStyle } from "./utils/inject-util.js";
import evolution from "./components/evolution.js";

console.log("--- inject ---");

GM_addStyle(global_style);

let ec_window = $(ec_window_ele).hide();
// 窗口控件
const ec_header = ec_window.find("#ec_header"),
  ec_win_close = ec_window.find("#ec_win_close"),
  ec_win_mini = ec_window.find("#ec_win_mini"),
  // tab栏
  ec_tabs = ec_window.find("#ec_tabs"),
  ec_tab_element = ec_window.find("#ec_tab_element"),
  ec_tab_color = ec_window.find("#ec_tab_color"),
  ec_tab_template = ec_window.find("#ec_tab_template"),
  // 面板
  ec_panel_wrapper = ec_window.find("#ec_panel_wrapper"),
  ec_panel_element = ec_window.find("#ec_panel_element"),
  ec_panel_color = ec_window.find("#ec_panel_color").hide(),
  ec_panel_template = ec_window.find("#ec_panel_template").hide();

// 最小化
ec_win_mini.click(function () {
  ec_tabs.toggle();
  ec_panel_wrapper.toggle();
});

// 切换tab
ec_tab_element.click(function () {
  console.log("gogo:", ec_window.find(".tab--active"));
  ec_window.find(".tab--active").removeClass("tab--active");
  ec_tab_element.addClass("tab--active");
  ec_window.find(".ec_panel:not(#ec_panel_element)").hide();
  ec_panel_element.show();
});
ec_tab_color.click(function () {
  ec_window.find(".tab--active").removeClass("tab--active");
  ec_tab_color.addClass("tab--active");
  ec_window.find(".ec_panel:not(#ec_panel_color)").hide();
  ec_panel_color.show();
});
ec_tab_template.click(function () {
  ec_window.find(".tab--active").removeClass("tab--active");
  ec_tab_template.addClass("tab--active");
  ec_window.find(".ec_panel:not(#ec_panel_template)").hide();
  ec_panel_template.show();
});

useColorPanel(ec_window);

/**
 * 初始化
 */
const ecInit = () => {
  addStyle(`#ec-change{color:#fff; background-color:#e8b004;}`);
  run(()=>evolution(ec_window));
};

$(function () {
  "use strict";
  $("body").append(ec_window);
  
  // 拖动
  useDrag(ec_header, ec_window);

  // 执行初始化函数
  ecInit();
});

console.log("--- inject end ---");

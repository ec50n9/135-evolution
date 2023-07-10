// @ts-check

import { addStyle } from "../utils/inject-util.js";

/**
 * @param {JQuery<any>} ec_window
 */
function createClickFunc(ec_window) {
  // 元素面板
  const ec_path_list = ec_window.find("#ec_path_list"),
    ec_win_style = ec_window.find("#ec_win_style"),
    ec_win_input_style = ec_window.find("#ec_win_input_style"),
    ec_win_add_style = ec_window.find("#ec_win_add_style"),
    ec_win_attr = ec_window.find("#ec_win_attr"),
    ec_child_list = ec_window.find("#ec_child_list"),
    ec_win_html = ec_window.find("#ec_win_html"),
    ec_win_delete = ec_window.find("#ec_win_delete"),
    ec_win_parent = ec_window.find("#ec_win_parent"),
    ec_win_write = ec_window.find("#ec_win_write");

  return function (event) {
    const cur_element = $(event.target);
    const cur_editor = $("#ueditor_0");

    // 添加标记
    cur_editor.contents().find("body .ective").removeClass("ective");
    cur_element.addClass("ective");

    // 清空内容
    ec_path_list.html("");
    ec_win_style.html("");
    ec_win_attr.html("");
    ec_win_html.val("");
    ec_win_add_style.unbind();
    ec_child_list.html("");
    ec_win_write.unbind();
    ec_win_parent.unbind();
    ec_win_delete.unbind();

    // 添加内容
    cur_element.each(function () {
      // 路径
      cur_element
        .parents()
        .filter("body *")
        .each(function () {
          let row = $(
            `<li><a style="color:#ff793f;" href="javascript:;">${this.tagName}</a></li>`
          );
          ec_path_list.prepend(row);
          let element = $(this);
          row.find("a").bind("click", function () {
            element.click();
          });
        });
      ec_path_list.append(`<li>[ ${this.tagName} ]</li>`);
      // 遍历属性
      $.each(this.attributes, function () {
        if (this.specified) {
          if (this.name === "style") {
            // 单独处理样式
            let style_list = this.value.split(";");
            for (let j = 0; j < style_list.length; j++) {
              let style = style_list[j];
              if (style) {
                let style_item = style.split(":");
                let value = style.slice(style.indexOf(":") + 1).trim();
                let style_row = $(
                  `<tr ec-attr="${style_item[0]}"><th>${
                    style_item[0]
                  }</th><td><input type="${
                    value.match(/^#[a-f0-9]{3,6}$/i) ? "text" : "text"
                  }" value="${value}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`
                );
                ec_win_style.append(style_row);
              }
            }
          } else {
            // 处理其他属性
            let row = $(
              `<tr ec-attr="${this.name}"><th>${this.name}</th><td><input type="text" value="${this.value}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`
            );
            ec_win_attr.append(row);
          }
        }
      });
    });
    // 生成子元素树
    const genChildList = function (container, element, parent_li) {
      const list = $(
        '<ul style="list-style-type:circle; margin-left:2em;"></ul>'
      );
      element.children().each(function () {
        let row = $(
          `<li><a style="color:#ff793f;" href="javascript:;">${this.tagName}</a></li>`
        );
        let element = $(this);
        row.find("a").bind("click", function () {
          element.click();
          return false;
        });
        list.append(row);
        genChildList(list, element, row);
      });
      if (list.html()) {
        container.append(list);
        if (parent_li) {
          parent_li.css("list-style-type", "disc").on("click", function () {
            list.slideToggle(200);
          });
        }
      }
    };
    genChildList(ec_child_list, cur_element);
    // html内容
    ec_win_html.val(cur_element.html());
    // 更新样式函数
    function update_sytle(element) {
      // 保存样式
      let sytle_tr_list = ec_win_style.find("tr");
      let style_text = "";
      for (let i = 0; i < sytle_tr_list.length; i++) {
        let tr = $(sytle_tr_list[i]);
        if (tr.find("input").val()) {
          style_text =
            style_text +
            tr.attr("ec-attr") +
            ":" +
            tr.find("input").val() +
            ";";
        }
      }
      element.attr("style", style_text);
    }
    // 添加样式按钮
    ec_win_add_style.bind("click", function () {
      /** @type {string} */
      let style_text = (ec_win_input_style.val() || "").toString();
      if (style_text) {
        let temp = style_text.split(":");
        ec_win_style.append(
          `<tr ec-attr="${temp[0]}"><th>${
            temp[0]
          }</th><td><input type="text" value="${
            temp.length > 1 ? temp[1].replace(";", "") : ""
          }" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`
        );
        ec_win_input_style.val("");
      }
      update_sytle(cur_element);
    });
    // 保存按钮
    ec_win_write.bind("click", function () {
      // 保存样式
      update_sytle(cur_element);
      // 保存属性
      let tr_list = ec_win_attr.find("tr");
      for (let i = 0; i < tr_list.length; i++) {
        let tr = $(tr_list[i]);
        cur_element.attr(tr.attr("ec-attr"), tr.find("input").val());
      }
      // 保存内容
      cur_element.html((ec_win_html.val() || "").toString());
    });
    // 父辈按钮
    ec_win_parent.on("click", function () {
      cur_element.parent().click();
    });
    // 删除按钮
    ec_win_delete.on("click", function () {
      let parent = cur_element.parent();
      cur_element.remove();
      parent.click();
    });
    return false;
  };
}

/**
 * 展示进化窗口
 * @param {JQuery<any>} ec_window
 * @param {(isRunning: boolean)=>void} [callback]
 */
function evolution(ec_window, callback) {
  const rootElement = $("body");
  const cur_editor = $("#ueditor_0");
  // 注入样式
  addStyle(
    ".ective{outline: 1.5px dashed red !important; outline-offset: 2px; position: relative;}",
    cur_editor.contents().find("head")
  );

  // 为元素添加监听器
  if (rootElement.hasClass("running")) {
    ec_window.fadeOut(200);
    cur_editor.contents().find("body").unbind();
    rootElement.removeClass("running");
    // 解除标记
    cur_editor.contents().find("body .ective").removeClass("ective");

    if (callback) {
      callback(false);
    } else {
      const ec_change = rootElement.find("#ec-change");
      (ec_change.length ? ec_change : rootElement)
        .css({ "background-color": "#e8b004" })
        .text("编辑进化");
    }
  } else {
    ec_window.fadeIn(200);
    cur_editor.contents().find("body").on("click", createClickFunc(ec_window));
    rootElement.addClass("running");

    if (callback) {
      callback(true);
    } else {
      const ec_change = rootElement.find("#ec-change");
      (ec_change.length ? ec_change : rootElement)
        .css({ "background-color": "#20a162" })
        .text("解除进化");
    }
  }
}

export default evolution;

import global_style from "./index.css";
import ec_window_ele from "./ec_window.html";

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
  ec_panel_template = ec_window.find("#ec_panel_template").hide(),
  // 元素面板
  ec_path_list = ec_window.find("#ec_path_list"),
  ec_win_style = ec_window.find("#ec_win_style"),
  ec_win_input_style = ec_window.find("#ec_win_input_style"),
  ec_win_add_style = ec_window.find("#ec_win_add_style"),
  ec_win_attr = ec_window.find("#ec_win_attr"),
  ec_child_list = ec_window.find("#ec_child_list"),
  ec_win_html = ec_window.find("#ec_win_html"),
  ec_win_delete = ec_window.find("#ec_win_delete"),
  ec_win_parent = ec_window.find("#ec_win_parent"),
  ec_win_write = ec_window.find("#ec_win_write");

// 最小化
ec_win_mini.click(function () {
  ec_tabs.toggle();
  ec_panel_wrapper.toggle();
});

// 切换tab
ec_tab_element.click(function () {
  console.log('gogo:', ec_window.find(".tab--active"));
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

// 元素选中
const element_click_func = function (event) {
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
          style_text + tr.attr("ec-attr") + ":" + tr.find("input").val() + ";";
      }
    }
    element.attr("style", style_text);
  }
  // 添加样式按钮
  ec_win_add_style.bind("click", function () {
    let style_text = ec_win_input_style.val();
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
      initShowTranslate();
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
    cur_element.html(ec_win_html.val());
  });
  // 父辈按钮
  ec_win_parent.bind("click", function () {
    cur_element.parent().click();
  });
  // 删除按钮
  ec_win_delete.bind("click", function () {
    let parent = cur_element.parent();
    cur_element.remove();
    parent.click();
  });
  return false;
};

// 进化函数
const evolution = function () {
  const cur_editor = $("#ueditor_0");
  // 注入样式
  addStyle(
    ".ective{outline: 1.5px dashed red !important; outline-offset: 2px; position: relative;}",
    cur_editor.contents().find("head")
  );

  // 为元素添加监听器
  if ($(this).hasClass("running")) {
    ec_window.fadeOut(200);
    cur_editor.contents().find("body").unbind();
    $(this).removeClass("running");
    // 解除标记
    cur_editor.contents().find("body .ective").removeClass("ective");

    const ec_change = $(this).find("#ec-change");
    (ec_change.length ? ec_change : $(this))
      .css({ "background-color": "#e8b004" })
      .text("编辑进化");
  } else {
    ec_window.fadeIn(200);
    cur_editor.contents().find("body").bind("click", element_click_func);
    $(this).addClass("running");

    const ec_change = $(this).find("#ec-change");
    (ec_change.length ? ec_change : $(this))
      .css({ "background-color": "#20a162" })
      .text("解除进化");
  }
};

// 调色板
const color_color = ec_window.find('#color_color'),
    color_dragger = ec_window.find('#color_dragger'),
    color_h = ec_window.find('#color_h'),
    color_h_dragger = ec_window.find('#color_h_dragger'),
    color_alpha = ec_window.find('#color_alpha'),
    color_alpha_dragger = ec_window.find('#color_alpha_dragger'),
    color_preview = ec_window.find('#color_preview'),
    color_preview_text = ec_window.find('#color_preview_text'),
    color_copy = ec_window.find('#color_copy');

let h = 0, s = 0, v = 0, a = 1;

function HSVtoRGB(h, s, v, a) {
    let i, f, p1, p2, p3;
    let r = 0, g = 0, b = 0;
    if (s < 0) s = 0;
    if (s > 1) s = 1;
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    h %= 360;
    if (h < 0) h += 360;
    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p1 = v * (1 - s);
    p2 = v * (1 - s * f);
    p3 = v * (1 - s * (1 - f));
    switch (i) {
        case 0: r = v; g = p3; b = p1; break;
        case 1: r = p2; g = v; b = p1; break;
        case 2: r = p1; g = v; b = p3; break;
        case 3: r = p1; g = p2; b = v; break;
        case 4: r = p3; g = p1; b = v; break;
        case 5: r = v; g = p1; b = p2; break;
    }
    if (a && a < 1)
        return 'rgba(' + Math.round(r * 255) + ', ' + Math.round(g * 255) + ', ' + Math.round(b * 255) + ', ' + a + ')';
    else
        return 'rgb(' + Math.round(r * 255) + ', ' + Math.round(g * 255) + ', ' + Math.round(b * 255) + ')';
}

function HexToRgb(hex) {
    let hexNum = hex.substring(1);
    let a = 1;
    if (hexNum.length < 6) {
        hexNum = repeatLetter(hexNum, 2);
    } else if (hexNum.length == 8) {
        a = ('0x' + hexNum) & '0xff';
        a = Number((a / 255 * 1).toFixed(2));
        hexNum = hexNum.substring(0, 6);
    }
    hexNum = '0x' + hexNum;
    let r = hexNum >> 16;
    let g = hexNum >> 8 & '0xff';
    let b = hexNum & '0xff';
    return {
        red: r,
        green: g,
        blue: b,
        alpha: a
    };

    function repeatWord(word, num) {
        let result = '';
        for (let i = 0; i < num; i++) {
            result += word;
        }
        return result;
    }
    function repeatLetter(word, num) {
        let result = '';
        for (let letter of word) {
            result += repeatWord(letter, num);
        }
        return result;
    }
}

function RgbToHsv(R, G, B, A) {
    R /= 255
    G /= 255
    B /= 255
    const max = Math.max(R, G, B)
    const min = Math.min(R, G, B)
    const range = max - min
    let V = max
    let S = V === 0 ? 0 : range / V
    let H = 0
    if (R === V) H = (60 * (G - B)) / range
    if (G === V) H = 120 + (60 * (B - R)) / range
    if (B === V) H = 240 + (60 * (R - G)) / range

    if (range === 0) H = 0
    if (H < 0) H += 360
    H = (H / 2) / 180
    H = Number(H.toFixed(4));
    S = Number(S.toFixed(4));
    V = Number(V.toFixed(4));
    // S *= 255
    // V *= 255
    return [H, S, V, A]
}

function update_color_text() {
    const res = HSVtoRGB(h, s, v, a);
    color_preview.css('background-color', res);
    color_preview_text.val(res);
}

function update_color() {
    color_color.css('background-color', HSVtoRGB(h, 1, 1, 1));
    color_dragger.css({
        'left': s * color_color.width() + 'px',
        'top': color_color.height() - v * color_color.height()
    });
    color_h_dragger.css({ 'left': h * color_h.width() / 360 });
    color_alpha_dragger.css({ 'left': a * color_alpha.width() });
}

color_preview_text.change(function () {
    const val = color_preview_text.val().trim();
    let hsv;
    if (val.match(/^#[a-f0-9]{3,8}$/i)) {
        const { red, green, blue, alpha } = HexToRgb(val);
        hsv = RgbToHsv(red, green, blue, alpha);
        update_color_text();
    } else if (val.match(/^rgba\(.+?\)$/i)) {
        const match = val.replace(/\s+/g, '').match(/^rgba\(([0-9]+),([0-9]+),([0-9]+),([0-9.]+)\)$/i);
        hsv = RgbToHsv(match[1], match[2], match[3], match[4]);
    } else if (val.match(/^rgb\(.+?\)$/i)) {
        const match = val.replace(/\s+/g, '').match(/^rgb\(([0-9]+),([0-9]+),([0-9]+)\)$/i);
        hsv = RgbToHsv(match[1], match[2], match[3], 1);
    } else {
        return;
    }
    h = hsv[0] * 360;
    s = hsv[1];
    v = hsv[2];
    a = hsv[3];
    update_color();
    update_color_text();
});

color_copy.click(function (e) {
    console.log('hello');
    color_preview_text.select();
    document.execCommand('Copy')
});

function update_color_position(left, top) {
    if (left < 0)
        left = 0;
    if (left > color_color.width())
        left = color_color.width();
    if (top < 0)
        top = 0;
    if (top > color_color.height())
        top = color_color.height();
    color_dragger.css({
        'left': left + 'px',
        'top': top + 'px'
    });
    s = left / color_color.width();
    v = (color_color.height() - top) / color_color.height();
    update_color_text();
}

function update_h_position(left) {
    if (left < 0)
        left = 0;
    if (left > color_h.width())
        left = color_h.width();
    color_h_dragger.css({ 'left': left + 'px' });
    h = ~~(left / color_h.width() * 360);
    color_color.css('background-color', HSVtoRGB(h, 1, 1, 1));
    update_color_text();
}

function update_alpha_position(left) {
    if (left < 0)
        left = 0;
    if (left > color_alpha.width())
        left = color_alpha.width();
    color_alpha_dragger.css({ 'left': left + 'px' });
    a = Number((left / color_alpha.width()).toFixed(2));
    update_color_text();
}

function apply_dragger(element, setter) {
    element.mousedown(function (e) {
        let left = e.pageX - element.offset().left;
        let top = e.pageY - element.offset().top;
        setter(left, top);

        ec_window.mousemove(function (e) {
            left = e.pageX - element.offset().left;
            top = e.pageY - element.offset().top;
            setter(left, top);
        });

        ec_window.mouseup(function (e) {
            ec_window.off('mousemove');
            ec_window.off('mouseup');
        });
        ec_window.mouseleave(function (e) {
            ec_window.off('mousemove');
            ec_window.off('mouseup');
        });
        return false;
    });
}

apply_dragger(color_color, update_color_position);
apply_dragger(color_h, update_h_position);
apply_dragger(color_alpha, update_alpha_position);

// 计算互补色
const getComplementaryColor = function (color = '') {
    const colorPart = color.slice(1);
    const ind = parseInt(colorPart, 16);
    let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
    while (iter.length < colorPart.length) {
        iter = '0' + iter;
    };
    return '#' + iter;
};

// 添加样式
const addStyle = function (styleText, document) {
  (document ? document : $('head')).append($(`<style>${styleText}</style>`));
}

// 初始化
const ecInit = function () {
  addStyle(`#ec-change{color:#fff; background-color:#e8b004;}`);
}

// 执行函数
const run135 = function () {
  // 解除模板会员限制
  setInterval(() => {
      let lis = $('#editor-template-scroll li');
      for (let i = 0, len = lis.length; i < len; i++) {
          lis[i].classList.remove('vip-style');
      }
      // vip删除线
      $('.vip-flag').remove(); // .css('text-decoration', 'line-through').removeClass('vip-flag');
      // 去除小红点
      $('.user-unread-msgnum').hide();
      try {
          // 文章管理器会员
          articleManager.setVIP(true);
      } catch (error) { }
  }, 1000);
  // 去除会员弹窗
  unsafeWindow.style_click = unsafeWindow.show_role_vip_dialog = function () { console.log('hey!') };
  style_click = show_role_vip_dialog = function () { };
  // 伪装登录
  // window.loged_user = 1;
  // 会员弹窗
  $('#add_xiaoshi').hide();
  // 顶部导航栏后两个按钮
  $('.category-nav.editor-nav>.nav-item:nth-last-child(-n+2)').hide();
  // 移除全局菜单中非功能设置按钮
  $('#fixed-side-bar li:not(#function-settings), #fixed-bar-pack-up').hide();
  // 进化按钮
  let evolution_btn = $('<li style="margin-bottom: 20px;"><a href="javascript:;" id="ec-change" class="btn btn-default btn-xs" title="绑定监听器">编辑进化</a></li>').on('click', evolution);
  $('#operate-tool').prepend(evolution_btn);
  // 色板按钮
  let open_color_plan = $('<li><a href="javascript:;" class="btn btn-default btn-xs" title="打开色板">开关色板</a></li>')
      .on('click', function () {
          $('#color-plan').fadeToggle(300);
      });
  $('#operate-tool').prepend(open_color_plan);
};

const run96 = function () {
  // vip样式
  setInterval(() => {
      $('.rich_media_content').attr('data-vip', 1);
  }, 1000);
  // 进化按钮
  let evolution_btn = $('<button type="button" id="ec-change" class="layui-btn layui-btn-primary">编辑进化</button>').on('click', evolution);
  $('.button-tools').prepend(evolution_btn);
};

const run365 = function () {
  let evolution_btn = $('<li id="ec-change" data-act="import"><span>编辑进化</span></li>').on('click', evolution);
  $('.m-tools').prepend(evolution_btn);
};

$(function () {
  "use strict";
  $("body").append(ec_window);
  // 窗口拖拽
  ec_header.mousedown(function (e) {
    var positionDiv = ec_window.offset();
    var distenceX = e.pageX - positionDiv.left;
    var distenceY = e.pageY - positionDiv.top;

    $(document).mousemove(function (e) {
      var x = e.pageX - distenceX;
      var y = e.pageY - distenceY;
      if (x < 0) {
        x = 0;
      } else if (x > $(document).width() - ec_window.outerWidth(true)) {
        x = $(document).width() - ec_window.outerWidth(true);
      }
      if (y < 0) {
        y = 0;
      } else if (y > $(document).height() - ec_window.outerHeight(true)) {
        y = $(document).height() - ec_window.outerHeight(true);
      }
      ec_window.css({
        left: x + "px",
        top: y + "px",
      });
    });

    $(document).mouseup(function () {
      $(document).off("mousemove");
    });
    return false;
  });

  // 判断执行
  ecInit();
  const host = window.location.host;
  if (host.search(/www.135editor.com/) >= 0) run135();
  else if (host.search(/bj.96weixin.com/) >= 0) run96();
  else if (host.search(/www.365editor.com/) >= 0) run365();
});

console.log("--- inject end ---");

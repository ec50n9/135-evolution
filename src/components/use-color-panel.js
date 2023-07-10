//@ts-check

import { HSVtoRGB, HexToRgb, RgbToHsv } from "../utils/color-util.js";

/**
 * @param {JQuery<any>} ec_window
 */
export default function (ec_window) {
  // 调色板
  const color_color = ec_window.find("#color_color"),
    color_dragger = ec_window.find("#color_dragger"),
    color_h = ec_window.find("#color_h"),
    color_h_dragger = ec_window.find("#color_h_dragger"),
    color_alpha = ec_window.find("#color_alpha"),
    color_alpha_dragger = ec_window.find("#color_alpha_dragger"),
    color_preview = ec_window.find("#color_preview"),
    color_preview_text = ec_window.find("#color_preview_text"),
    color_copy = ec_window.find("#color_copy");

  let h = 0,
    s = 0,
    v = 0,
    a = 1;

  function update_color_text() {
    const res = HSVtoRGB(h, s, v, a);
    color_preview.css("background-color", res);
    color_preview_text.val(res);
  }

  function update_color() {
    color_color.css("background-color", HSVtoRGB(h, 1, 1, 1));
    color_dragger.css({
      left: s * color_color.width() + "px",
      top: color_color.height() - v * color_color.height(),
    });
    color_h_dragger.css({ left: (h * color_h.width()) / 360 });
    color_alpha_dragger.css({ left: a * color_alpha.width() });
  }

  color_preview_text.change(function () {
    const val = color_preview_text.val().trim();
    let hsv;
    if (val.match(/^#[a-f0-9]{3,8}$/i)) {
      const { red, green, blue, alpha } = HexToRgb(val);
      hsv = RgbToHsv(red, green, blue, alpha);
      update_color_text();
    } else if (val.match(/^rgba\(.+?\)$/i)) {
      const match = val
        .replace(/\s+/g, "")
        .match(/^rgba\(([0-9]+),([0-9]+),([0-9]+),([0-9.]+)\)$/i);
      hsv = RgbToHsv(match[1], match[2], match[3], match[4]);
    } else if (val.match(/^rgb\(.+?\)$/i)) {
      const match = val
        .replace(/\s+/g, "")
        .match(/^rgb\(([0-9]+),([0-9]+),([0-9]+)\)$/i);
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
    console.log("hello");
    color_preview_text.select();
    document.execCommand("Copy");
  });

  function update_color_position(left, top) {
    if (left < 0) left = 0;
    if (left > color_color.width()) left = color_color.width();
    if (top < 0) top = 0;
    if (top > color_color.height()) top = color_color.height();
    color_dragger.css({
      left: left + "px",
      top: top + "px",
    });
    s = left / color_color.width();
    v = (color_color.height() - top) / color_color.height();
    update_color_text();
  }

  function update_h_position(left) {
    if (left < 0) left = 0;
    if (left > color_h.width()) left = color_h.width();
    color_h_dragger.css({ left: left + "px" });
    h = ~~((left / color_h.width()) * 360);
    color_color.css("background-color", HSVtoRGB(h, 1, 1, 1));
    update_color_text();
  }

  function update_alpha_position(left) {
    if (left < 0) left = 0;
    if (left > color_alpha.width()) left = color_alpha.width();
    color_alpha_dragger.css({ left: left + "px" });
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
        ec_window.off("mousemove");
        ec_window.off("mouseup");
      });
      ec_window.mouseleave(function (e) {
        ec_window.off("mousemove");
        ec_window.off("mouseup");
      });
      return false;
    });
  }

  apply_dragger(color_color, update_color_position);
  apply_dragger(color_h, update_h_position);
  apply_dragger(color_alpha, update_alpha_position);

  // 计算互补色
  const getComplementaryColor = function (color = "") {
    const colorPart = color.slice(1);
    const ind = parseInt(colorPart, 16);
    let iter = ((1 << (4 * colorPart.length)) - 1 - ind).toString(16);
    while (iter.length < colorPart.length) {
      iter = "0" + iter;
    }
    return "#" + iter;
  };
}

// @ts-check

/**
 * @param {JQuery<any>} ec_header
 * @param {JQuery<any>} ec_window
 */
export default function (ec_header, ec_window) {
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
}

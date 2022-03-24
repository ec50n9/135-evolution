// ==UserScript==
// @name        135编辑器进化🧬
// @namespace   http://tampermonkey.net/
// @match       https://www.135editor.com/beautify_editor.html
// @icon        https://www.135editor.com/img/vip/vip.png
// @grant       none
// @version     1.2
// @author      ec50n9
// @description 去广告、解除vip限制、解除2个选项卡限制，配色方案中增加互补色选项，并增加自制css编辑器，可直接编辑元素css。
// ==/UserScript==

$(function () {
    // 解除模板会员限制
    setInterval(() => {
        let lis = $('#editor-template-scroll li');
        for (let i = 0, len = lis.length; i < len; i++) {
            lis[i].classList.remove('vip-style');
        }
        // vip删除线
        $('.vip-flag').css('text-decoration', 'line-through');
        // 去除小红点
        $('.user-unread-msgnum').hide();
        // 文章管理器会员
        articleManager.setVIP(true);
    }, 1000);
    // 去除会员弹窗
    window.style_click = window.show_role_vip_dialog = function () { };
    // 伪装登录
    // window.loged_user = 1;
    // 会员弹窗
    $('#add_xiaoshi').hide();
    // 顶部导航栏后两个按钮
    $('.category-nav.editor-nav>.nav-item:nth-last-child(-n+2)').hide();
    // 移除全局菜单中非功能设置按钮
    $('#fixed-side-bar li:not(#function-settings), #fixed-bar-pack-up').hide();

    // 颜色增强
    const getComplementaryColor = (color = '') => {
        const colorPart = color.slice(1);
        const ind = parseInt(colorPart, 16);
        let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
        while (iter.length < colorPart.length) {
            iter = '0' + iter;
        };
        return '#' + iter;
    };
    let origin_color_div = $('#color-choosen>div:first-child'); // 原始
    let complementary_color_div = origin_color_div.clone(); // 互补
    origin_color_div.before($('<p style="color:#fff;">原始色</p>'));
    origin_color_div.after(complementary_color_div);
    origin_color_div.after($('<p style="color:#fff;">互补色</p>'));
    $('#color-plan-list .color-swatch').on('click', function () {
        let cur_color = $(this).attr('style').match(/background-color:\s?([^;]+)/)[1];
        console.log(cur_color, getComplementaryColor(cur_color));
        origin_color_div.children('input').css('color', getComplementaryColor(cur_color))
        complementary_color_div.children('input').attr('value', getComplementaryColor(cur_color));
        complementary_color_div.children('input').css({ 'color': cur_color, 'background-color': getComplementaryColor(cur_color) });
    });

    // 编辑增强
    let ec_window = $(`
    <div style="display:none;
        flex-direction:column;
        position:fixed;
        top:10em; left:25%;
        max-width:30em;
        max-height:70%;
        padding:1em;
        box-sizing: border-box;
        background-color:#fff;
        box-shadow:rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius:1em;
        z-index:999;">
        <style>
            #ec-path-list{
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                text-transform: lowercase;
            }
            #ec-path-list li:nth-child(n+2)::before{
                content: '>';
                margin: 0 .5em;
            }
        </style>
        <h1 id="ec-win-title" style="height:2em; cursor:move;">元素名</h1>
        <ul id="ec-path-list">
        </ul>
        <div style="display:flex; flex-direction:column; overflow-y:scroll">
            <h2 style="margin-top:1em; font-weight:600">样式</h2>
            <table id="ec-win-style"></table>
            <div style="display:flex; align-items:center; margin-top:.5em">
                <input id="ec-win-input-style" type="text" value=""placeholder="例: color: red;" style="flex-grow:1; border:2px solid #eee;padding:0 8px; border-radius:2px;">
                <button id="ec-win-add-style" style="min-width:5em; margin-left:1em; padding:0 .8em; border-radius:.4em; border:2px solid #999;">添加样式</button>
            </div>
            <div style="margin-top:.8em; color:#999; font-size:.8em;">
                每次只能添加<strong>一条</strong>样式。<br>
                添加样式后需要点击下方<strong>写入</strong>才可生效。<br>
                清空编辑框后点击<strong>写入</strong>即可删除该行样式。
            </div>
            <h2 style="margin-top:1em; font-weight:600">属性</h2>
            <table id="ec-win-attr"></table>
            <h2 style="margin-top:1em; font-weight:600">内容</h2>
            <div style="width:100%">
                <textarea id="ec-win-html" rows="6" style="width:100%; border:2px solid #eee; padding:0 8px; border-radius:2px;">元素文本</textarea>
            </div>
        </div>
        <button id="ec-win-parent" style="align-self:flex-end; margin-top:1em; padding:0 .8em; border-radius:.4em; border:2px solid #999;">父容器</button>
        <button id="ec-win-write" style="align-self:flex-end; margin-top:1em; padding:.2em .8em; border-radius:.4em; border:2px solid #eee; color:#fff; background-color:#2775b6">更新写入</button>
    </div>`);
    $('body').append(ec_window);
    // 子控件
    let ec_win_title = $('#ec-win-title');
    let ec_path_list = $('#ec-path-list');
    let ec_win_style = $('#ec-win-style');
    let ec_win_input_style = $('#ec-win-input-style');
    let ec_win_add_style = $('#ec-win-add-style');
    let ec_win_attr = $('#ec-win-attr');
    let ec_win_html = $('#ec-win-html');
    let ec_win_parent = $('#ec-win-parent');
    let ec_win_write = $('#ec-win-write');
    // 窗口拖拽
    ec_win_title.mousedown(function (e) {
        var positionDiv = $(this).offset();
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
                'left': x + 'px',
                'top': y + 'px'
            });
        });

        $(document).mouseup(function () {
            $(document).off('mousemove');
        });
    });
    // 绑定事件
    let reflesh_btn = $('<li style="margin-bottom: 20px;"><a href="javascript:;" class="btn btn-default btn-xs" style="color:#fff; background-color:#e8b004;" title="绑定监听器">编辑进化</a></li>').on('click', function () {
        // 元素选中
        let element_click_func = function () {
            cur_element = $(this);

            // 清空内容
            ec_path_list.html('');
            ec_win_style.html('');
            ec_win_attr.html('');
            ec_win_html.val('');
            ec_win_add_style.unbind();
            ec_win_write.unbind();
            ec_win_parent.unbind();

            // 添加内容
            cur_element.each(function () {
                // 设置标题
                ec_win_title.text(`当前元素：${this.tagName}`);
                // 路径
                cur_element.parents().filter('body *').each(function () {
                    let row = $(`<li><a href="javascript:;">${this.tagName}</a></li>`);
                    ec_path_list.prepend(row);
                    let element = $(this);
                    row.find('a').bind('click', function () {
                        element.click();
                    });
                });
                ec_path_list.append(`<li>[ ${this.tagName} ]</li>`);
                // 遍历属性
                $.each(this.attributes, function () {
                    if (this.specified) {
                        if (this.name === 'style') {
                            // 单独处理样式
                            let style_list = this.value.split(';');
                            for (let j = 0; j < style_list.length; j++) {
                                let style = style_list[j];
                                if (style) {
                                    let style_item = style.split(':');
                                    let style_row = $(`<tr><th>${style_item[0]}</th><td><input type="text" value="${style_item[1]}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`);
                                    ec_win_style.append(style_row);
                                }
                            }
                        } else {
                            // 处理其他属性
                            let row = $(`<tr><th>${this.name}</th><td><input type="text" value="${this.value}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`);
                            ec_win_attr.append(row);
                        }
                    }
                });
            });
            // html内容
            ec_win_html.val(cur_element.html());
            // 更新样式函数
            function update_sytle(element) {
                // 保存样式
                let sytle_tr_list = ec_win_style.find('tr');
                let style_text = '';
                for (let i = 0; i < sytle_tr_list.length; i++) {
                    let tr = $(sytle_tr_list[i]);
                    if (tr.find('input').val()) {
                        style_text = style_text + tr.find('th').text() + ':' + tr.find('input').val() + ';';
                    }
                }
                element.attr('style', style_text);
            }
            // 添加样式按钮
            ec_win_add_style.bind('click', function () {
                let style_text = ec_win_input_style.val();
                if (style_text) {
                    let temp = style_text.split(':');
                    ec_win_style.append(`<tr><th>${temp[0]}</th><td><input type="text" value="${temp.length > 1 ? temp[1].replace(';', '') : ''}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`);
                    ec_win_input_style.val('');
                }
                update_sytle(cur_element);
            });
            // 保存按钮
            ec_win_write.bind('click', function () {
                update_sytle(cur_element);
                // 保存属性
                let tr_list = ec_win_attr.find('tr');
                for (let i = 0; i < tr_list.length; i++) {
                    let tr = $(tr_list[i]);
                    cur_element.attr(tr.find('th').text(), tr.find('input').val());
                }
                // 保存内容
                cur_element.html(ec_win_html.val());
            });
            // 父辈按钮
            ec_win_parent.bind('click', function () {
                cur_element.parent().click();
            });
            return false;
        }

        // 为元素添加监听器
        if ($(this).attr('class') === 'running') {
            ec_window.css('display', 'none');
            $('#ueditor_0').contents().find('body .binding').unbind().removeClass('binding');
            $(this).removeClass('running').find('a').css({'background-color': '#e8b004' }).text('编辑进化');
        } else {
            ec_window.css('display', 'flex');
            $('#ueditor_0').contents().find('body *:not(.binding)').bind('click', element_click_func).addClass('binding');
            $(this).addClass('running').find('a').css({'background-color': '#20a162' }).text('解除进化');
        }
    });
    // 进化按钮
    $('#operate-tool').prepend(reflesh_btn);
    // 色板按钮
    let open_color_plan = $('<li><a href="javascript:;" class="btn btn-default btn-xs" title="打开色板">开关色板</a></li>')
        .on('click', function () {
            $('#color-plan').fadeToggle(300);
        });
    $('#operate-tool').prepend(open_color_plan)
});

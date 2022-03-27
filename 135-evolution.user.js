// ==UserScript==
// @name        微信编辑器增强🧬
// @namespace   http://tampermonkey.net/
// @match       *://www.135editor.com/*
// @match       *://bj.96weixin.com/*
// @match       *://www.365editor.com/*
// @icon        https://www.135editor.com/img/vip/vip.png
// @grant       none
// @version     1.7
// @author      ec50n9
// @description 为135、96、365编辑器去除广告，免vip，增加css样式编辑面板等...
// @license     MIT
// ==/UserScript==

$(function () {
    'use strict';

    // 翻译字典
    const dict = {
        'background': '背景',
        'color': '颜色',
        'top': '上',
        'bottom': '下',
        'left': '左',
        'right': '右',
        'height': '高',
        'width': '宽',
        'line': '行',
        'align': '对齐',
        'size': '大小',
        'content': '内容',
        'text': '文本',
        'font': '字体',
        'items': '项目',
        'border': '边框',
        'padding': '内边距',
        'margin': '外边距',
        'color': '字体颜色',
        'letter-spacing': '字符间距',
        'class': '类名',
        'display': '显示',
        'justify-content': '内容调整方式',
        'vertical': '垂直',

    };
    const translate = function (name = '') {
        if (dict[name]) {
            return dict[name];
        } else {
            let fragments = name.split('-');
            let result = '';
            for (let i in fragments) {
                let fragment = fragments[i];
                let res = dict[fragment];
                result += res ? res : fragment;
            }
            return result;
        }
    }
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
    // css编辑面板
    let ec_window = $(`
<div style="display:flex;
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
        #ec-win-style th, #ec-win-attr th{
            width: 40%;
            border-width: 1px;
            font-weight:500;
        }
    </style>
    <p id="ec-default-tip">点击一个元素以查看其属性</p>
    <h1 id="ec-win-title" style="height:2em; cursor:move; user-select: none;">元素名</h1>
    <div id="ec-path-list" style="margin:0;"></div>
    <div style="display:flex; flex-direction:column; overflow-y:scroll">
        <h2 style="margin-top:1em; font-weight:600">当前元素样式</h2>
        <table id="ec-win-style"></table>
        <div style="display:flex; align-items:center; margin-top:.5em">
            <input id="ec-win-input-style" type="text" value=""placeholder="例: color: red;" style="flex-grow:1; border:2px solid #eee;padding:0 8px; border-radius:2px;">
            <button id="ec-win-add-style" style="min-width:5em; margin-left:1em; padding:0 .8em; border-radius:.4em; border:2px solid #999;">添加样式</button>
        </div>
        <div style="display:none; margin-top:.8em; color:#999; font-size:.8em;">
            每次只能添加<strong>一条</strong>样式。<br>
            添加样式后需要点击下方<strong>写入</strong>才可生效。<br>
            清空编辑框后点击<strong>写入</strong>即可删除该行样式。
        </div>
        <h2 style="margin-top:1em; font-weight:600">属性</h2>
        <table id="ec-win-attr"></table>
        <h2 style="margin-top:1em; font-weight:600">子元素</h2>
        <ul id="ec-child-list" style="margin:0;">
        </ul>
        <h2 style="margin-top:1em; font-weight:600">内容</h2>
        <div style="width:100%">
            <textarea id="ec-win-html" rows="6" style="width:100%; border:2px solid #eee; padding:0 8px; border-radius:2px;">元素文本</textarea>
        </div>
    </div>
    <button id="ec-win-delete" style="align-self:flex-end; margin-top:1em; padding:0 .8em; border-radius:.4em; border:2px solid #999;">删除元素</button>
    <button id="ec-win-parent" style="align-self:flex-end; margin-top:1em; padding:0 .8em; border-radius:.4em; border:2px solid #999;">父容器</button>
    <button id="ec-win-write" style="align-self:flex-end; margin-top:1em; padding:.2em .8em; border-radius:.4em; border:2px solid #eee; color:#fff; background-color:#2775b6">更新写入</button>
</div>`).hide();
    $('body').append(ec_window);
    // 窗口控件
    let ec_default_tip = $('#ec-default-tip');
    let ec_win_title = $('#ec-win-title');
    let ec_path_list = $('#ec-path-list');
    let ec_win_style = $('#ec-win-style');
    let ec_win_input_style = $('#ec-win-input-style');
    let ec_win_add_style = $('#ec-win-add-style');
    let ec_win_attr = $('#ec-win-attr');
    let ec_child_list = $('#ec-child-list');
    let ec_win_html = $('#ec-win-html');
    let ec_win_delete = $('#ec-win-delete');
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
    // 初始化
    const ecInit = function () {
        addStyle(`#ec-change{color:#fff; background-color:#e8b004;}`);
    }
    // 翻译
    const initShowTranslate = function(){
        $('#ec-win-style th, #ec-win-attr th').mouseenter(function () {
            $(this).text(translate($(this).text()));
        }).mouseleave(function () {
            $(this).text($(this).parent().attr('ec-attr'));
        });
    }
    // 进化函数
    const evolution = function () {
        let cur_editor = $('#ueditor_0');
        // 注入样式
        addStyle('.ec-active{outline: 1.5px dashed red !important; outline-offset: 2px; position: relative;}',
            cur_editor.contents().find('head'));

        // 元素选中
        let element_click_func = function () {
            const cur_element = $(this);

            // 隐藏提示
            ec_window.find('*:not(style,#ec-default-tip)').show();
            ec_default_tip.hide();

            // 添加标记
            cur_editor.contents().find('body .ec-active').removeClass('ec-active');
            cur_element.addClass('ec-active');

            // 清空内容
            ec_path_list.html('');
            ec_win_style.html('');
            ec_win_attr.html('');
            ec_win_html.val('');
            ec_win_add_style.unbind();
            ec_child_list.html('');
            ec_win_write.unbind();
            ec_win_parent.unbind();
            ec_win_delete.unbind();

            // 添加内容
            cur_element.each(function () {
                // 设置标题
                ec_win_title.text(`当前元素：${this.tagName}`);
                // 路径
                cur_element.parents().filter('body *').each(function () {
                    let row = $(`<li><a style="color:#ff793f;" href="javascript:;">${this.tagName}</a></li>`);
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
                                    let style_row = $(`<tr ec-attr="${style_item[0]}"><th>${style_item[0]}</th><td><input type="text" value="${style.slice(style.indexOf(':') + 1)}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`);
                                    ec_win_style.append(style_row);
                                }
                            }
                        } else {
                            // 处理其他属性
                            let row = $(`<tr ec-attr="${this.name}"><th>${this.name}</th><td><input type="text" value="${this.value}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`);
                            ec_win_attr.append(row);
                        }
                    }
                });
                initShowTranslate();
            });
            // 生成子元素树
            const genChildList = function (container, element, parent_li) {
                const list = $('<ul style="list-style-type:circle; margin-left:2em;"></ul>');
                element.children().each(function () {
                    let row = $(`<li><a style="color:#ff793f;" href="javascript:;">${this.tagName}</a></li>`);
                    let element = $(this);
                    row.find('a').bind('click', function () {
                        element.click();
                        return false;
                    });
                    list.append(row);
                    genChildList(list, element, row);
                });
                if (list.html()) {
                    container.append(list);
                    if (parent_li) {
                        parent_li.css('list-style-type', 'disc').on('click', function () {
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
                let sytle_tr_list = ec_win_style.find('tr');
                let style_text = '';
                for (let i = 0; i < sytle_tr_list.length; i++) {
                    let tr = $(sytle_tr_list[i]);
                    if (tr.find('input').val()) {
                        style_text = style_text + tr.attr('ec-attr') + ':' + tr.find('input').val() + ';';
                    }
                }
                element.attr('style', style_text);
            }
            // 添加样式按钮
            ec_win_add_style.bind('click', function () {
                let style_text = ec_win_input_style.val();
                if (style_text) {
                    let temp = style_text.split(':');
                    ec_win_style.append(`<tr ec-attr="${temp[0]}"><th>${temp[0]}</th><td><input type="text" value="${temp.length > 1 ? temp[1].replace(';', '') : ''}" style="border:2px solid #eee;padding:0 8px; border-radius:2px;"></td></tr>`);
                    ec_win_input_style.val('');
                    initShowTranslate();
                }
                update_sytle(cur_element);
            });
            // 保存按钮
            ec_win_write.bind('click', function () {
                // 保存样式
                update_sytle(cur_element);
                // 保存属性
                let tr_list = ec_win_attr.find('tr');
                for (let i = 0; i < tr_list.length; i++) {
                    let tr = $(tr_list[i]);
                    cur_element.attr(tr.attr('ec-attr'), tr.find('input').val());
                }
                // 保存内容
                cur_element.html(ec_win_html.val());
            });
            // 父辈按钮
            ec_win_parent.bind('click', function () {
                cur_element.parent().click();
            });
            // 删除按钮
            ec_win_delete.bind('click', function () {
                let parent = cur_element.parent();
                cur_element.remove();
                parent.click();
            });
            return false;
        }

        // 为元素添加监听器
        if ($(this).hasClass('running')) {
            ec_window.fadeOut(200);
            cur_editor.contents().find('body .binding').unbind().removeClass('binding');
            $(this).removeClass('running');
            // 解除标记
            cur_editor.contents().find('body .ec-active').removeClass('ec-active');

            const ec_change = $(this).find('#ec-change');
            (ec_change.length ? ec_change : $(this)).css({ 'background-color': '#e8b004' }).text('编辑进化');
        } else {
            ec_window.fadeIn(200);
            cur_editor.contents().find('body *:not(.binding,#ec-inject)').bind('click', element_click_func).addClass('binding');
            $(this).addClass('running');
            // 隐藏控件，显示提示
            ec_window.find('*:not(style,#ec-default-tip)').hide();
            ec_default_tip.show();

            const ec_change = $(this).find('#ec-change');
            (ec_change.length ? ec_change : $(this)).css({ 'background-color': '#20a162' }).text('解除进化');
        }
    };

    // 执行函数
    const run135 = function () {
        // 解除模板会员限制
        setInterval(() => {
            let lis = $('#editor-template-scroll li');
            for (let i = 0, len = lis.length; i < len; i++) {
                lis[i].classList.remove('vip-style');
            }
            // vip删除线
            $('.vip-flag').remove();//.css('text-decoration', 'line-through').removeClass('vip-flag');
            // 去除小红点
            $('.user-unread-msgnum').hide();
            try {
                // 文章管理器会员
                articleManager.setVIP(true);
            } catch (error) { }
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

    // 判断执行
    ecInit();
    const host = window.location.host;
    if (host.search(/www.135editor.com/) >= 0) run135();
    else if (host.search(/bj.96weixin.com/) >= 0) run96();
    else if (host.search(/www.365editor.com/) >= 0) run365();
});

//file: cards_hand_gxc.js

define(['core/utils'],
function (md_utils) {
    var m_exports = {};

    m_exports.cards_hand_gxc_ctor = function () {
        var that = {};
        var _anchor_selector, _root_selector, _stack_html = [], _container_div;
        var _gfx_base, _deck_info, _this_ctrl = { left: 0, top: 0, width: 0, height: 0 };
        var _cards_info = {};

        that.init = function (anchor_owner_div, container_div, gfx_base) {
            _anchor_selector = '#' + anchor_owner_div;
            _root_selector = '#' + container_div;
            _container_div = container_div;
            _gfx_base = gfx_base;
            _deck_info = gfx_base.get_deck_info();
        }


        that.assign_lbl_cards = function (cards, click_function) {
            var card_info_values = _.values(_cards_info);
            var i = 0, card_info, selector;
            _.each(cards, function (card_lbl) {
                card_info = card_info_values[i];
                selector = '#' + card_info.id;
                $(selector).attr('data-pattern', card_lbl);
                $(selector).click(click_function);
                $(selector).find('.davanti').append('<img src="' + _gfx_base.build_src_imagecard_curr_deck(card_lbl) + '"></img>');
                i += 1;
            });
        }

        that.flip_all_cards = function (ok_terminated) {
            var card_info_values = _.values(_cards_info);
            var i = 0, selector;
            var proc_count = md_utils.proc_counter_ctor(card_info_values.length, function () {
                setTimeout(function () {
                    ok_terminated();
                }, 200);
            });

            _.each(card_info_values, function (card_info) {
                selector = '#' + card_info.id;
                _gfx_base.flipCard(selector, i, proc_count);
                i += 1;
            });
        }

        that.create_cards = function (num_cards, info) {
            _cards_info = {};
            _stack_html = [];
            var single_item_info;
            for (var i = 0; i < num_cards; i++) {
                single_item_info = { id: _container_div + '_card_id_' + i,
                    state: 'invisible',
                    type_anchor_x: info.type_anchor_x, offset_x: info.offset_x,
                    type_anchor_y: info.type_anchor_y, offset_y: info.offset_y,
                    width: info.width, height: info.height,
                    offset_intracard_x: info.offset_intracard_x,
                    offset_intracard_y: info.offset_intracard_y
                };
                _cards_info[single_item_info.id] = single_item_info;
                if (info.is_simple_decked_card) {
                    _stack_html.push('  <img src="' + _gfx_base.build_src_image_symbol_curr_deck(0) + '" class="absolute_image" id="' + single_item_info.id + '" ></img>');
                } else {
                    _stack_html.push('<div id="' + single_item_info.id + '" class="card">');
                    _stack_html.push('  <div class="face dorso">');
                    _stack_html.push('     <img src="' + _gfx_base.build_src_image_symbol_curr_deck(0) + '" class="absolute_image"></img>');
                    _stack_html.push('  </div>');
                    _stack_html.push('  <div class="face davanti">');
                    _stack_html.push('  </div>');
                    _stack_html.push('</div>');
                }
            }
            _this_ctrl.width = info.offset_intracard_x * num_cards + info.width;
            _this_ctrl.height = info.offset_intracard_y * num_cards + info.height;

            resize();
            render();
        }

        that.card_invisible_rnd_decked = function () {
            var res = { x: 0, y: 0 };
            var card_info_values = _.values(_cards_info);
            var count_cop = 0, pos_cop_to_play = 0, card_found = false, curr_pos_cop = 0;
            _.each(card_info_values, function (info_card_gfx) {
                selector = '#' + info_card_gfx.id;
                if (!$(selector).hasClass('item-invisible')) {
                    count_cop += 1;
                }
            });
            if (count_cop > 0) {
                pos_cop_to_play = parseInt(Math.random() * count_cop, 10);
            }
            _.each(card_info_values, function (info_card_gfx) {
                selector = '#' + info_card_gfx.id;
                if (!$(selector).hasClass('item-invisible')) {
                    if (pos_cop_to_play == curr_pos_cop) {
                        $(selector).addClass('item-invisible');
                        card_found = true;
                        res.x = info_card_gfx.absolute_x;
                        res.y = info_card_gfx.absolute_y;
                    }
                }
                curr_pos_cop += 1;
            });
            if (!card_found) {
                throw (new Error('No card set to invisible'));
            }
            return res;
        }

        var resize = function () {
            var card_info_values = _.values(_cards_info);
            var anch_w = $(_anchor_selector).width();
            var anch_h = $(_anchor_selector).height();
            var anch_pos_x = 0;
            var anch_pos_y = 0;

            var i = 0, offset_info_x, offset_info_y;
            _this_ctrl.left = 99999;
            _this_ctrl.top = 0;
            _.each(card_info_values, function (ci_info) {
                offset_info_x = { type: ci_info.type_anchor_x,
                    offset: ci_info.offset_x + i * ci_info.offset_intracard_x
                };
                ci_info.absolute_x = _gfx_base.calc_off_pos(offset_info_x, anch_pos_x, anch_pos_y,
                     anch_w, anch_h, _this_ctrl.width, _this_ctrl.height);
                if (ci_info.absolute_x < _this_ctrl.left) {
                    _this_ctrl.left = ci_info.absolute_x;
                }

                offset_info_y = { type: ci_info.type_anchor_y,
                    offset: ci_info.offset_y + i * ci_info.offset_intracard_y
                };
                ci_info.absolute_y = _gfx_base.calc_off_pos(offset_info_y,
                     anch_pos_x, anch_pos_y,
                     anch_w, anch_h, _this_ctrl.width, _this_ctrl.height);

                if (ci_info.absolute_y > _this_ctrl.top) {
                    _this_ctrl.top = ci_info.absolute_y;
                }

                i += 1;
            });
        }

        var render = function () {
            $(_root_selector).empty();
            $(_root_selector).append(_stack_html.join('\n'));

            var card_info_values = _.values(_cards_info);
            var selector;

            _.each(card_info_values, function (info_card_gfx) {
                selector = '#' + info_card_gfx.id;
                $(selector).css({
                    "left": info_card_gfx.absolute_x,
                    "top": info_card_gfx.absolute_y,
                    "width": info_card_gfx.width,
                    "height": info_card_gfx.height,
                    "position": 'absolute'
                });
            });
        }

        that.resize = resize;
        that.render = render;

        return that;
    }

    return m_exports;
});
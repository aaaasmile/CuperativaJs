// file: deck_gfx_ctrl.js


define([], function () {
    var m_exports = {};


    m_exports.deckbriscola_gfx_ctrl_ctor = function (prote) {
        var _prot = prote || obj_with_superior_ctor();
        var that = m_exports.deck_gfx_ctrl_ctor(_prot);
        var _info_briscola = {};
        var _brisc_info = { is_visible: false, lbl: '', html: '' };

        that.assign_briscola = function (brisc_lbl) {
            _brisc_info.lbl = brisc_lbl;
            _brisc_info.is_visible = true;
            _brisc_info.html = '<span>Briscola ' + _prot.deck_info().get_info_card(brisc_lbl).nome + '</span>';
            var selector = '#cd_briscola';
            $(selector).find('.davanti').
                append('<img src="' + _prot.gfx_base().build_src_imagecard_curr_deck(brisc_lbl) + '" width="' + _prot.single_width() + '" height="' + _prot.single_height() + '" class="briscola_img"></img>');

        }

        _prot.create_deck_post = function (num_cards, info, stack_html_postdeck) {
            stack_html_postdeck.push('<div id="brisc_lbl_id" class="briscola_lbl"></div>');
            stack_html_postdeck.push('<div id="cd_briscola" class="briscola">');
            stack_html_postdeck.push('  <div class="face davanti">');
            stack_html_postdeck.push('  </div>');
            stack_html_postdeck.push('</div>');
        }

        _prot.resize_post = function (single_width, single_height) {
            _info_briscola.absolute_x = -40;
            _info_briscola.absolute_y = 0;
            _info_briscola.width = single_height;
            _info_briscola.height = single_width;
        }

        _prot.render_post = function () {
            $('#cd_briscola').css({
                "left": _info_briscola.absolute_x,
                "top": _info_briscola.absolute_y,
                "width": _info_briscola.width,
                "height": _info_briscola.height,
                "position": 'absolute'
            });

            if (_brisc_info.is_visible) {
                $('#cd_briscola').find('.davanti').
                    append('<img src="' + _prot.gfx_base().build_src_imagecard_curr_deck(_brisc_info.lbl) + '" width="' + _prot.single_width() + '" height="' + _prot.single_height() + '" class="briscola_img"></img>');
            }

            $('#cd_briscola').hover(function () {
                $('#brisc_lbl_id').append(_brisc_info.html);
            }, function () {
                $('#brisc_lbl_id').empty();
            });
        }

        _prot.pop_card_now_we_have = function (num_cards) {
            if (num_cards <= 0) {
                _brisc_info.is_visible = false;
                $('#brisc_lbl_id').remove();
                $('#cd_briscola').remove();
            }
        }

        _prot.is_pop_available = function (num_cards) {
            return _brisc_info.is_visible;
        }

        return that;
    }

    m_exports.deck_gfx_ctrl_ctor = function (prote) {
        var _prot = prote || obj_with_superior_ctor();
        var that = {};
        var _anchor_selector, _root_selector, _container_div;
        var _stack_html_predeck = [], _stack_html_deck = [], _stack_html_postdeck = [];
        var _gfx_base, _deck_info, _this_ctrl = { left: 0, top: 0, width: 0, height: 0 };
        var _info_root = {};

        var _num_cards = 0;
        var _single_width = 58; // = opt.width || 58;
        var _single_height = 100; // = opt.height || 100;

        that.init = function (anchor_owner_div, container_div, gfx_base) {
            _anchor_selector = '#' + anchor_owner_div;
            _root_selector = '#' + container_div;
            _container_div = container_div;
            _gfx_base = gfx_base;
            _deck_info = gfx_base.get_deck_info();
        }

        _prot.deck_info = function(){return _deck_info;}
        _prot.gfx_base = function(){return _gfx_base;}
        _prot.single_width = function(){return _single_width;}
        _prot.single_height = function(){return _single_height;}

        that.create_deck = function (num_cards, info) {
            _stack_html_predeck = [], _stack_html_deck = [], _stack_html_postdeck = [];
            _brisc_info = { is_visible: false, lbl: '', html: '' };
            _num_cards = num_cards;
            _info_root = info;

            _stack_html_predeck.push('<div id="deck_rep_num_id" class="deck_rep_num"></div>');

            var count = 0;
            for (var i = 0; i < num_cards; i++) {
                if ((i % info.jump_factor) == 0) {
                    _stack_html_deck.push('<img src="' + _gfx_base.build_src_image_symbol_curr_deck(0)
                        + '" class="deck_single_card" id="' + get_deck_card_id(count) + '"></img>');
                    count += 1;
                }
            }
            _prot.create_deck_post(num_cards, info, _stack_html_postdeck);

            resize();
            render();
        }

        _prot.create_deck_post = function (num_cards, info, _stack_html_postdeck) { };
        _prot.resize_post = function (w, h) { };
        _prot.render_post = function () { };
        _prot.is_pop_available = function (num_cards) { return true; };
        _prot.pop_card_now_we_have = function (num_cards) { };

        var get_deck_card_id = function (index) {
            return "id_deck_cddecked_" + index;
        }

        var resize = function () {
            var anch_w = $(_anchor_selector).width();
            var anch_h = $(_anchor_selector).height();
            var anch_pos_x = 0;
            var anch_pos_y = 0;

            _info_root.width = Math.floor(_num_cards / _info_root.jump_factor) + _single_width;
            _info_root.height = Math.floor(_num_cards / _info_root.jump_factor) + _single_height;

            _this_ctrl.width = _info_root.width;
            _this_ctrl.height = _info_root.height;


            var offset_info_x, offset_info_y;
            offset_info_x = { type: _info_root.type_anchor_x,
                offset: _info_root.offset_x
            };
            _info_root.absolute_x = _gfx_base.calc_off_pos(offset_info_x, anch_pos_x, anch_pos_y,
                     anch_w, anch_h, _this_ctrl.width, _this_ctrl.height);

            offset_info_y = { type: _info_root.type_anchor_y,
                offset: _info_root.offset_y
            };
            _info_root.absolute_y = _gfx_base.calc_off_pos(offset_info_y,
                     anch_pos_x, anch_pos_y,
                     anch_w, anch_h, _this_ctrl.width, _this_ctrl.height);


            _prot.resize_post(_single_width, _single_height);
        }

        var get_cards_ondeck_html = function () {
            return '<span id="lbl_deck_info_id">Carte ' + _num_cards + '</span>';
        }

        var render = function () {
            var last_width = 0, last_top = 0;
            $(_root_selector).empty();
            $(_root_selector).append(_stack_html_predeck.join('\n'));
            $(_root_selector).append(_stack_html_deck.join('\n'));
            $(_root_selector).append(_stack_html_postdeck.join('\n'));

            $(_root_selector).css({
                "left": _info_root.absolute_x,
                "top": _info_root.absolute_y,
                "width": _info_root.width,
                "height": _info_root.height,
                "position": 'absolute'
            });

            $(_root_selector).children(".deck_single_card").each(function (index) {
                last_top = index;
                last_width = index;
                $(this).css({
                    "left": last_width,
                    "top": last_top,
                    "width": _single_width,
                    "height": _single_height
                });
            });

            $('#deck_rep_num_id').css({
                "left": last_width,
                "top": last_top,
                "width": _single_width,
                "height": _single_height
            });

            $('#deck_rep_num_id').hover(function () {
                $('#deck_rep_num_id').append(get_cards_ondeck_html());
            }, function () {
                $('#deck_rep_num_id').empty();
            });

            _prot.render_post();
        }

        that.pop_cards = function (num_cards) {
            if (_num_cards == 0 && !_prot.is_pop_available(_num_cards)) { return; }

            var selector;
            for (var i = 0; i < num_cards; i++) {
                _num_cards -= 1;
                if ((_num_cards % _info_root.jump_factor) == 0) {
                    if (_stack_html_deck.length > 0) {
                        selector = '#' + get_deck_card_id(_stack_html_deck.length - 1);
                        $(selector).remove();
                        _stack_html_deck.pop();
                    }
                }

                if (_num_cards == 0) {
                    $('#deck_rep_num_id').remove();
                }
                if (_num_cards < 0) {
                    _num_cards = 0;
                }
                _prot.pop_card_now_we_have(_num_cards);
            }
        }

        that.render = render;

        return that;
    }

    return m_exports;
});
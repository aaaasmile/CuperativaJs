// file: tablecards_gxc

define(['core/utils'],
function (md_utils) {
    var m_exports = {};

    m_exports.table_playedcards_graph_ctor = function () {
        var that = {};
        var _log = log_ctor('table_playedcards_graph');
        var _table_cards_gfx = {};
        var _num_players, _anchor_selector, _root_selector;
        var _gfx_base, _deck_info;

        that.init = function (num_players, anchor_owner_div, container_div, gfx_base) {
            _num_players = num_players;
            _anchor_selector = '#' + anchor_owner_div;
            _root_selector = '#' + container_div;
            _gfx_base = gfx_base;
            _deck_info = gfx_base.get_deck_info();
        }

        that.add_dest_card_played = function (player_name, info) {
            _table_cards_gfx[player_name] = {
                offset_x: info.offset_x,
                offset_y: info.offset_y, height: info.height,
                width: info.width, type_anchor_x: info.type_anchor_x,
                type_anchor_y: info.type_anchor_y
            };
        }

        that.resize = function () {
            var card_gfxs = _.values(_table_cards_gfx);
            var anch_w, anch_h, anch_pos_x, anch_pos_y;
            anch_w = $(_anchor_selector).width();
            anch_h = $(_anchor_selector).height();
            anch_pos_x = $(_anchor_selector).position().left;
            anch_pos_y = $(_anchor_selector).position().top;

            _.each(card_gfxs, function (card_gfx) {
                card_gfx.absolute_x = _gfx_base.calc_off_pos({ type: card_gfx.type_anchor_x, offset: card_gfx.offset_x },
                     anch_pos_x, anch_pos_y,
                     anch_w, anch_h, card_gfx.width, card_gfx.height);
                card_gfx.absolute_y = _gfx_base.calc_off_pos({ type: card_gfx.type_anchor_y, offset: card_gfx.offset_y },
                     anch_pos_x, anch_pos_y,
                     anch_w, anch_h, card_gfx.width, card_gfx.height);
                _log.debug("*** Played card posX " + card_gfx.absolute_x + ' posY ' + card_gfx.absolute_y);
            });
        }

        that.all_card_played_tocardtaken = function (player_taker_name, ani_terminated) {
            var card_gfxs = _.values(_table_cards_gfx);
            var scene_info = _gfx_base.get_scene_info('scene');
            var min_x = scene_info.width, max_x = 0;
            var endpoint_x, endpoint_y, x0, y0, pos_x, pos_y, selector;

            _.each(card_gfxs, function (card_gfx) {
                _log.debug("*** card_gfx ->" + JSON.stringify(card_gfx));
                if (card_gfx.absolute_x < min_x) { min_x = card_gfx.absolute_x; }
                if (card_gfx.absolute_x > max_x) { max_x = card_gfx.absolute_x; }
            });
            _log.debug("*** scene ->" + JSON.stringify(scene_info));

            // need to move the cards played together and than directed to player taker
            var proc_count = md_utils.proc_counter_ctor(card_gfxs.length, function () {
                _log.debug("*** x_axis animations terminated");

                _log.debug('TODO finish animation card taken...');
            });

            // move cards together on x
            _.each(card_gfxs, function (card_gfx) {
                endpoint_x = scene_info.width / 2;
                pos_x = card_gfx.absolute_x;
                pos_y = card_gfx.absolute_y;
                endpoint_y = card_gfx.absolute_y;
                x0 = card_gfx.absolute_x;
                y0 = card_gfx.absolute_y;
                selector = '#' + card_gfx.id_card;
                _log.debug("*** Want to move card " + card_gfx.id_card + " from pos_x " + pos_x + " pos_y " + pos_y + " to  end_x " + endpoint_x + " end_y " + endpoint_y);

                ani_card_played_line(selector, 'x_axis', endpoint_x, endpoint_y, x0, y0, pos_x, pos_y, function () {
                    _log.debug('*** animation part terminated ');
                    proc_count.item_done_ok();
                });
            });
        }

        that.card_is_played_incirc = function (player_name, lbl_card, z_ord, init_x, init_y, ani_terminated) {
            var info_card_gfx = _table_cards_gfx[player_name];
            var selector;
            var id_card = 'id' + lbl_card + '_' + player_name;
            info_card_gfx.id_card = id_card;
            var card_gfx = get_cardgfx_html(player_name, lbl_card, id_card);
            $(_root_selector).append(card_gfx);
            selector = '#' + id_card;
            $(selector).css({
                "left": init_x,
                "top": init_y,
                "width": info_card_gfx.width,
                "height": info_card_gfx.height,
                "z-index": z_ord
            });
            var pos_x = init_x, pos_y = init_y, int_ani;
            var endpoint_y = info_card_gfx.absolute_y;
            var endpoint_x = info_card_gfx.absolute_x;
            var x0 = init_x, y0 = init_y;
            if (Math.abs(endpoint_x - x0) > Math.abs(endpoint_y - y0)) {
                ani_card_played_line(selector, 'x_axis', endpoint_x, endpoint_y, x0, y0, pos_x, pos_y, ani_terminated);
            } else {
                // change axe y with x
                ani_card_played_line(selector, 'y_axis', endpoint_y, endpoint_x, y0, x0, pos_y, pos_x, ani_terminated);
            }
        }

        var ani_card_played_line = function (selector, m_type, endpoint_y, endpoint_x, y0, x0, pos_y, pos_x, ani_terminated) {
            _log.debug('animation type (x_axis/y_axis) ' + m_type);
            var iq = 0, im = 1, int_ani, v_estimated;
            var delta_v = 3, v_max = 30, step_target = 16, timeout = 30;

            if (endpoint_y - y0 != 0) {
                im = ((endpoint_x - x0) * 1000) / (endpoint_y - y0);
                v_estimated = (endpoint_y - y0) / step_target;
                if (v_estimated >= v_max) { v_estimated = v_max; }
            }
            iq = x0 - ((im * y0) / 1000.0);
            _log.debug('*** im ' + im + ' v_estimated ' + v_estimated + ' iq ' + iq + ' x0 ' + pos_x + ' y0 ' + pos_y + ' xF ' + endpoint_x + ' yF ' + endpoint_y);
            int_ani = setInterval(function () {
                pos_y += v_estimated;
                pos_x = (im * pos_y) / 1000.0 + iq;
                if (m_type === 'x_axis') {
                    $(selector).css({
                        "left": pos_y,
                        "top": pos_x
                    });
                } else {
                    $(selector).css({
                        "left": pos_x,
                        "top": pos_y
                    });
                }
                if (v_estimated > 0) {
                    v_estimated += delta_v;
                    if (v_estimated >= v_max) { v_estimated = v_max; }
                } else {
                    v_estimated -= delta_v;
                    if (v_estimated <= -v_max) { v_estimated = -v_max; }
                }

                _log.debug('*** Ani  x: ' + pos_x + ' y ' + pos_y + ' v_estimated ' + v_estimated + ' id ' + selector );

                if ((endpoint_y >= pos_y && v_estimated <= 0) ||
                        (endpoint_y <= pos_y && v_estimated >= 0)) {
                    clearInterval(int_ani);
                    ani_terminated();
                }
            }, timeout);
        }

        var get_cardgfx_html = function (player_name, card_lbl, id_card) {
            return '<img src="' + _gfx_base.build_src_imagecard_curr_deck(card_lbl)
                    + '" class="single_card_played" id="' + id_card + '" data-name="' + player_name + '"></img>';
        }

        var render = function () {
            var data_name, info_card_gfx;
            $(_root_selector).empty();
            $(_root_selector).children(".single_card_played").each(function (index) {
                data_name = $(this).attr('data-name');
                info_card_gfx = _table_cards_gfx[data_name];
                $(this).css({
                    "left": info_card_gfx.absolute_x,
                    "top": info_card_gfx.absolute_y,
                    "width": info_card_gfx.width,
                    "height": info_card_gfx.height
                });
            });

        }

        that.render = render;

        return that;
    }

    return m_exports;
});
// file gfx_base.js

define(['g1/gfx/deck_gfx_ctrl', 'g1/gfx/tablecards_gxc', 'g1/gfx/cards_hand_gxc', 'g1/gfx/user_identity_gxc'],
function (md_deckgfx, md_tablecards_gxc, md_cards_hand_gxc, md_user_lbl_gxc) {
    var m_exports = {};
    var _set_scene_info = {};
    m_exports.deck_gfx_ctrl_ctor = md_deckgfx.deck_gfx_ctrl_ctor;
    m_exports.deckbriscola_gfx_ctrl_ctor = md_deckgfx.deckbriscola_gfx_ctrl_ctor;

    m_exports.table_playedcards_graph_ctor = md_tablecards_gxc.table_playedcards_graph_ctor;
    m_exports.cards_hand_gxc_ctor = md_cards_hand_gxc.cards_hand_gxc_ctor;
    m_exports.user_ident_gfx_ctor = md_user_lbl_gxc.user_ident_gfx_ctor;

    m_exports.gfx_base_ctor = function () {
        var _deck_info, _deck_curr_info_gfx;
        var that = {};

        that.set_deck_to_use = function (deck_info, deck_info_gfx) {
            _deck_info = deck_info;
            _deck_curr_info_gfx = deck_info_gfx;
        }

        that.get_deck_info = function () {
            return _deck_info;
        }

        that.set_scene_info = function (key, value) {
            _set_scene_info[key] = value;
        }

        that.get_scene_info = function (key) {
            return _set_scene_info[key];
        }

        that.get_curr_deck_gfxinfo = function () {
            return _deck_curr_info_gfx;
        }

        var _deck_image_info_det = {
            'piacentine': { name: 'piac', width: 84, height: 144, width_sym: 84, height_sym: 145 },
            'bergamo': { name: 'bergamo', width: 80, height: 144, width_sym: 80, height_sym: 145 },
            'milanesi': { name: 'milano', width: 80, height: 144, width_sym: 80, height_sym: 145 },
            'napoletane': { name: 'napoli', width: 92, height: 144, width_sym: 92, height_sym: 145 },
            'siciliane': { name: 'sicilia', width: 92, height: 144, width_sym: 92, height_sym: 145 },
            'trevigiane': { name: 'treviso', width: 80, height: 144, width_sym: 80, height_sym: 145 }
        };


        var build_src_image_card = function (card_info, deck_name) {
            // build something like 'url(App/images/carte/piac/01_spade.png)'
            var segni_name = ['basto', 'coppe', 'denar', 'spade'];
            var pos = card_info.pos;
            if (pos < 10) {
                pos = '0' + pos;
            }
            var segno = segni_name[card_info.seed_ix];
            var str = 'App/images/carte/' + deck_name + '/' + pos + '_' + segno + '.png';

            return str;
        }

        var build_src_image_symbol = function (ix_symb, deck_name) {
            // build something like url(../images/carte/piac/01_cope.png)
            var segni_name = ['cope', 'vuot', 'xxxx', 'zero'];
            var pos = '01';
            var segno = segni_name[ix_symb];
            if (!segno) { throw (new Error('Symbol is undefined')); }
            if (!deck_name) { throw (new Error('Deckname is undefined')); }

            var str = 'App/images/carte/' + deck_name + '/' + pos + '_' + segno + '.png';

            return str;
        }

        that.build_src_image_symbol_curr_deck = function (ix_symb) {
            return build_src_image_symbol(ix_symb, _deck_curr_info_gfx.name);
        }

        that.build_src_imagecard_curr_deck = function (card_lbl) {
            var card_info = _deck_info.get_card_info(card_lbl);
            return build_src_image_card(card_info, _deck_curr_info_gfx.name);
        }

        var build_url_image_symbol = function (ix_symb, deck_name) {
            // build something like url(../images/carte/piac/01_cope.png)
            var str = 'url(' + build_src_image_symbol(ix_symb, deck_name) + ')';
            return str;
        }

        var build_url_image_card = function (card_info, deck_name) {
            return 'url(' + build_src_image_card(card_info, deck_name) + ')';
        }

        that.get_info_imagedeck = function (key) {
            if (!_deck_image_info_det.hasOwnProperty(key)) {
                throw (new Error('deck key ' + key + ' not set'));
            }
            return _deck_image_info_det[key];
        }

        that.assign_card = function (selector, index, card_lbl, proc_count) {
            $(selector).find(".davanti")
                        .css('background-image', build_url_image_card(
                            _deck_info.get_card_info(card_lbl),
                            _deck_curr_info_gfx.name));

            $(selector).find(".dorso")
                        .css('background-image', build_url_image_symbol(
                            0, _deck_curr_info_gfx.name));

            $(selector).attr("data-pattern", card_lbl);
            showCard(selector, index, proc_count);
        }

        var showCard = function (selector, index, proc_count) {
            setTimeout(function () {
                $(selector).removeClass('item-invisible');
                if (proc_count) {
                    proc_count.item_done_ok();
                }
            }, index * 200);

        }

        var flipCard = function (selector, index, proc_count) {
            setTimeout(function () {
                $(selector).addClass('card-flipped');
                $(selector).find(".dorso").addClass('item-invisible');
                if (proc_count) {
                    proc_count.item_done_ok();
                }
            }, 200 + index * 300);
        }

        // info_pos:  {type: 'left_anchor', offset: 10}
        var calc_off_pos = function (info_pos, anch_pos_x, anch_pos_y, anch_w, anch_h, item_w, item_h) {
            var calc_pos = undefined;
            switch (info_pos.type) {
                case 'left_anchor':
                    calc_pos = anch_pos_x + info_pos.offset;
                    break;
                case 'right_anchor':
                    calc_pos = anch_pos_x + anch_w - item_w + info_pos.offset;
                    break;
                case 'bottom_anchor':
                    calc_pos = anch_pos_y + anch_h - item_h + info_pos.offset;
                    break;
                case 'top_anchor':
                    calc_pos = anch_pos_y + info_pos.offset;
                    break;
                case 'center_anchor_horiz':
                    calc_pos = anch_pos_x + Math.floor(anch_w / 2) - Math.floor(item_w / 2) + info_pos.offset;
                    break;
                case 'center_anchor_vert':
                    calc_pos = anch_pos_y + Math.floor(anch_h / 2) - Math.floor(item_h / 2) + info_pos.offset;
                    break;
                default:
                    throw (new Error('info_pos.type ' + info_pos.type + ' not recognized'));
            }

            return calc_pos;
        }

        that.build_url_image_card = build_url_image_card;
        that.build_url_image_symbol = build_url_image_symbol;
        that.build_src_image_symbol = build_src_image_symbol;
        that.showCard = showCard;
        that.flipCard = flipCard;
        that.calc_off_pos = calc_off_pos;

        return that;
    }

    return m_exports;
});
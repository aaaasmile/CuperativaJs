// file: algbri2_gui.js


define(['games/briscola/alg_briscola', 'core/utils', 'g1/gfx/gfx_base'],
function (mod_alg_bris, md_utils, md_gx_base) {
    var m_exports = {};

    m_exports.alg_gui_bri2_ctor = function (options, prote) {
        var _log = log_ctor('alg_gui_bri2');
        var _options = options || { art: 'gui' };
        _options.art = _options.art || 'gui';
        _options.cover_opp = _options.cover_opp || { width: 58, height: 100 };
        var _body_sel = "#" + _options.root_ctrl;
        var _tmpl_view = [
        '<div id="table_cont" class="g-table">',
        '  <div id="name_opp" class="g-name"></div>',
        '  <div id="name_me" class="g-name"></div>',
        '  <div id="me_cards"></div>',
        '  <div id="opp_cards"></div>',
        '  <div id="deck_cards"></div>',
        '  <div id="card_played"></div>',
        '</div>'];

        var _player_can_play = false;
        var _prot = prote || obj_with_superior_ctor();
        var _base_gfx = md_gx_base.gfx_base_ctor();

        _options.deck_info_gfx = _options.deck_info_gfx ||
                _base_gfx.get_info_imagedeck('piacentine');

        var that = mod_alg_bris.alg_briscola_ctor(_options, _prot);
        var _core = _options.core;
        var _deck_info = _prot.get_deck_info();
        var _deck_gfx_ctrl = md_gx_base.deckbriscola_gfx_ctrl_ctor();
        _base_gfx.set_deck_to_use(_deck_info, _options.deck_info_gfx);
        var _table_cards_played = md_gx_base.table_playedcards_graph_ctor();

        var _me_cards_ctrl = md_gx_base.cards_hand_gxc_ctor();
        var _opp_cards_ctrl = md_gx_base.cards_hand_gxc_ctor();

        var _me_lbl_ctrl = md_gx_base.user_ident_gfx_ctor();
        var _opp_lbl_ctrl = md_gx_base.user_ident_gfx_ctor();

        var init_base = that.superior('init');
        var set_owner_base = that.superior('set_owner');

        var on_core_new_match_base = _prot.superior('on_core_new_match');
        var on_core_ev_brisc_new_giocata_base = _prot.superior('on_core_ev_brisc_new_giocata');
        var on_core_ev_player_has_played_base = _prot.superior('on_core_ev_player_has_played');
        var on_core_ev_mano_end_base = _prot.superior('on_core_ev_mano_end');
        var on_core_ev_pesca_carta_base = _prot.superior('on_core_ev_pesca_carta');



        var prepare_scene = function () {
            $(_body_sel).empty();
            $(_body_sel).append(_tmpl_view.join('\n'));
            _log.debug("*** Scene width " + $(_body_sel).width() + ' height ' + $(_body_sel).height());
            _base_gfx.set_scene_info('scene', { width: $(_body_sel).width(), height: $(_body_sel).height()})
        }

        that.set_owner = function (player_owner) {
            set_owner_base(player_owner);
            _log.change_nametype('ALG_BRIS2_GUI_' + player_owner.name);
        }

        _prot.on_core_new_match = function (obj_args) {
            _log.debug('++++ ALG GUI New Match +++' + JSON.stringify(obj_args));
            var curr_id, i;
            var card_w = get_card_play_w();
            var card_h = get_card_play_h();
            var decksymbol_h = get_card_sym_h(), decksymbol_w = get_card_sym_w();

            prepare_scene();

            _table_cards_played.init(obj_args.players.length, 'table_cont', 'card_played', _base_gfx);
            _me_cards_ctrl.init('table_cont', 'me_cards', _base_gfx);
            _opp_cards_ctrl.init('table_cont', 'opp_cards', _base_gfx);
            _deck_gfx_ctrl.init('table_cont', 'deck_cards', _base_gfx);

            _deck_gfx_ctrl.create_deck(_prot.get_max_numcards_ondeck(), {
                offset_x: -20, offset_y: 0, height: _options.cover_opp.height, width: _options.cover_opp.width,
                type_anchor_x: 'right_anchor', type_anchor_y: 'center_anchor_vert',
                jump_factor: 2, step_x: 1, step_y: 1
            });

            _me_cards_ctrl.create_cards(_prot.get_num_cards_on_player_hand(), {
                offset_x: 20, offset_y: -20, height: decksymbol_h, width: decksymbol_w,
                type_anchor_x: 'center_anchor_horiz', type_anchor_y: 'bottom_anchor',
                offset_intracard_y: 0, offset_intracard_x: card_w + 5
            });

            _opp_cards_ctrl.create_cards(_prot.get_num_cards_on_player_hand(), {
                offset_x: 0, offset_y: 20, height: _options.cover_opp.height, width: _options.cover_opp.width,
                type_anchor_x: 'center_anchor_horiz', type_anchor_y: 'top_anchor',
                offset_intracard_y: 0, offset_intracard_x: 30,
                is_simple_decked_card: true
            });

            _.each(obj_args.players, function (player) {
                if (player.position === 0) {
                    _opp_lbl_ctrl.add_user_lbl('name_opp', player.name, {
                        "right": '25px',
                        "top": '30px'
                    });
                    _table_cards_played.add_dest_card_played(player.name, {
                        offset_x: -card_w, offset_y: -card_h, height: card_h, width: card_w,
                        type_anchor_x: 'center_anchor_horiz', type_anchor_y: 'center_anchor_vert'
                    });
                 
                }
                if (player.position === 1) {
                    _me_lbl_ctrl.add_user_lbl('name_me', player.name, {
                        "right": '25px',
                        "bottom": '30px'
                    });
                    _table_cards_played.add_dest_card_played(player.name, {
                        offset_x: 20, offset_y: -(card_h - card_h / 3), height: card_h, width: card_w,
                        type_anchor_x: 'center_anchor_horiz', type_anchor_y: 'center_anchor_vert'
                    });
                 
                }
            });

            _table_cards_played.resize();

            on_core_new_match_base(obj_args);
        }

        _prot.on_core_ev_brisc_new_giocata = function (obj_args) {
            _player_can_play = false;
            on_core_ev_brisc_new_giocata_base(obj_args);

            _log.debug('++++ ALG GUI New Giocata +++');

            _core.suspend_proc_gevents('Animate distribution');

            _me_cards_ctrl.assign_lbl_cards(obj_args.carte, clickOnCard);

            _table_cards_played.render();

            _deck_gfx_ctrl.assign_briscola(obj_args.brisc);

            _me_cards_ctrl.flip_all_cards(function () {
                _log.debug('All cards flipped');
                _core.continue_process_events();
            });

        }

        var get_card_sym_w = function () {
            return _base_gfx.get_curr_deck_gfxinfo().width_sym;
        }

        var get_card_sym_h = function () {
            return _base_gfx.get_curr_deck_gfxinfo().height_sym;
        }

        var get_card_play_w = function () {
            return _base_gfx.get_curr_deck_gfxinfo().width;
        }

        var get_card_play_h = function () {
            return _base_gfx.get_curr_deck_gfxinfo().height;
        }

        var clickOnCard = function () {
            var selector = this;
            var card_lbl = $(this).attr('data-pattern');
            _log.debug('Click on card' + card_lbl);
            if (card_lbl && _player_can_play) {
                if (_core.allowed_to_play_card(_prot.player_owner, card_lbl)) {
                    _player_can_play = false;
                    _core.alg_action({ action: 'play_card', player: _prot.player_owner, card_played: card_lbl });
                    start_guiplayer_card_played_animation(selector, card_lbl);
                } else {
                    _log.debug('Player not allowed to play card ' + card_lbl);
                    $(selector).addClass('g-invalid-card');
                    setTimeout(function () {
                        $(selector).removeClass('g-invalid-card');
                    }, 200);
                }
            } else {
                _log.debug('Ignore click');
            }
        }

        var start_guiplayer_card_played_animation = function (selector, lbl_card) {
            var position = $(selector).position();
            $(selector).addClass('item-invisible');
            _core.suspend_proc_gevents('Animate GUI play card');
            _table_cards_played.card_is_played_incirc(_prot.player_owner.name,
                lbl_card, _prot.card_played().length,
                     position.left, position.top, function () {
                         _log.debug("Card played GUI animation terminated");
                         _core.continue_process_events();
                     });
        }


        _prot.on_core_ev_have_to_play = function (obj_args) {
            var player = obj_args.player_on_turn;
            if (player.name === _prot.player_owner.name) {
                _log.debug('++++ ALG GUI have to play +++');
                _player_can_play = true;
                _opp_lbl_ctrl.user_is_waiting();
                _me_lbl_ctrl.user_is_on_turn();
            } else {
                _me_lbl_ctrl.user_is_waiting();
                _opp_lbl_ctrl.user_is_on_turn();
            }
        }

        _prot.on_core_ev_player_has_played = function (obj_args) {
            var player_name = obj_args.player_name;
            var lbl_card = obj_args.card_played;
            on_core_ev_player_has_played_base(obj_args);

            if (player_name === _prot.player_owner.name) {
                _log.debug("Player GUI has played correctly");

            } else {
                info_cd_invi = _opp_cards_ctrl.card_invisible_rnd_decked();
                _core.suspend_proc_gevents('Animate OPP play card');
                _table_cards_played.card_is_played_incirc(player_name, lbl_card, _prot.card_played().length,
                     info_cd_invi.x, info_cd_invi.y, function () {
                         _log.debug("Card played animation terminated");
                         _core.continue_process_events();
                     });
            }
        }

        _prot.on_core_ev_mano_end = function (obj_args) {
            on_core_ev_mano_end_base(obj_args);
            _core.suspend_proc_gevents('Animate mano end');
            _table_cards_played.all_card_played_tocardtaken(obj_args.player_best.name, function () {
                _log.debug("mano end animation terminated");
                _core.continue_process_events();
            });
        }

        _prot.on_core_ev_pesca_carta = function (obj_args) {
            on_core_ev_pesca_carta_base(obj_args);
            _deck_gfx_ctrl.pop_cards(2);
            // TODO set the opponent card and the gui card
            _log.debug('TODO set the opponent card and the gui card...');
        }

        var init = function () {
            _log.debug('init alg GUI briscola');

            init_base();
        }

        that.do_test = function () {
            _log.debug('Gui do some test');
            //_deck_gfx_ctrl.pop_cards(2);
            var deck_info = _base_gfx.get_deck_info();
            deck_info.transform_to_52();

        }

        that.init = init;

        return that;
    }

    return m_exports;
});
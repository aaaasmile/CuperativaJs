// file deck_info.js

define(function () {

    var m_exports = {};

    m_exports.deck_info_ctor = function () {
        var _log = log_ctor('deck_info');
        var deck_info_det = {
            _Ab: { ix: 0, nome: 'asso bastoni', symb: 'asso', segno: 'B', seed_ix: 0, pos: 1 },
            _2b: { ix: 1, nome: 'due bastoni', symb: 'due', segno: 'B', seed_ix: 0, pos: 2 },
            _3b: { ix: 2, nome: 'tre bastoni', symb: 'tre', segno: 'B', seed_ix: 0, pos: 3 },
            _4b: { ix: 3, nome: 'quattro bastoni', symb: 'qua', segno: 'B', seed_ix: 0, pos: 4 },
            _5b: { ix: 4, nome: 'cinque bastoni', symb: 'cin', segno: 'B', seed_ix: 0, pos: 5 },
            _6b: { ix: 5, nome: 'sei bastoni', symb: 'sei', segno: 'B', seed_ix: 0, pos: 6 },
            _7b: { ix: 6, nome: 'sette bastoni', symb: 'set', segno: 'B', seed_ix: 0, pos: 7 },
            _Fb: { ix: 7, nome: 'fante bastoni', symb: 'fan', segno: 'B', seed_ix: 0, pos: 8 },
            _Cb: { ix: 8, nome: 'cavallo bastoni', symb: 'cav', segno: 'B', seed_ix: 0, pos: 9 },
            _Rb: { ix: 9, nome: 're bastoni', symb: 're', segno: 'B', seed_ix: 0, pos: 10 },
            _Ac: { ix: 10, nome: 'asso coppe', symb: 'asso', segno: 'C', seed_ix: 1, pos: 1 },
            _2c: { ix: 11, nome: 'due coppe', symb: 'due', segno: 'C', seed_ix: 1, pos: 2 },
            _3c: { ix: 12, nome: 'tre coppe', symb: 'tre', segno: 'C', seed_ix: 1, pos: 3 },
            _4c: { ix: 13, nome: 'quattro coppe', symb: 'qua', segno: 'C', seed_ix: 1, pos: 4 },
            _5c: { ix: 14, nome: 'cinque coppe', symb: 'cin', segno: 'C', seed_ix: 1, pos: 5 },
            _6c: { ix: 15, nome: 'sei coppe', symb: 'sei', segno: 'C', seed_ix: 1, pos: 6 },
            _7c: { ix: 16, nome: 'sette coppe', symb: 'set', segno: 'C', seed_ix: 1, pos: 7 },
            _Fc: { ix: 17, nome: 'fante coppe', symb: 'fan', segno: 'C', seed_ix: 1, pos: 8 },
            _Cc: { ix: 18, nome: 'cavallo coppe', symb: 'cav', segno: 'C', seed_ix: 1, pos: 9 },
            _Rc: { ix: 19, nome: 're coppe', symb: 're', segno: 'C', seed_ix: 1, pos: 10 },
            _Ad: { ix: 20, nome: 'asso denari', symb: 'asso', segno: 'D', seed_ix: 2, pos: 1 },
            _2d: { ix: 21, nome: 'due denari', symb: 'due', segno: 'D', seed_ix: 2, pos: 2 },
            _3d: { ix: 22, nome: 'tre denari', symb: 'tre', segno: 'D', seed_ix: 2, pos: 3 },
            _4d: { ix: 23, nome: 'quattro denari', symb: 'qua', segno: 'D', seed_ix: 2, pos: 4 },
            _5d: { ix: 24, nome: 'cinque denari', symb: 'cin', segno: 'D', seed_ix: 2, pos: 5 },
            _6d: { ix: 25, nome: 'sei denari', symb: 'sei', segno: 'D', seed_ix: 2, pos: 6 },
            _7d: { ix: 26, nome: 'sette denari', symb: 'set', segno: 'D', seed_ix: 2, pos: 7 },
            _Fd: { ix: 27, nome: 'fante denari', symb: 'fan', segno: 'D', seed_ix: 2, pos: 8 },
            _Cd: { ix: 28, nome: 'cavallo denari', symb: 'cav', segno: 'D', seed_ix: 2, pos: 9 },
            _Rd: { ix: 29, nome: 're denari', symb: 're', segno: 'D', seed_ix: 2, pos: 10 },
            _As: { ix: 30, nome: 'asso spade', symb: 'asso', segno: 'S', seed_ix: 3, pos: 1 },
            _2s: { ix: 31, nome: 'due spade', symb: 'due', segno: 'S', seed_ix: 3, pos: 2 },
            _3s: { ix: 32, nome: 'tre spade', symb: 'tre', segno: 'S', seed_ix: 3, pos: 3 },
            _4s: { ix: 33, nome: 'quattro spade', symb: 'qua', segno: 'S', seed_ix: 3, pos: 4 },
            _5s: { ix: 34, nome: 'cinque spade', symb: 'cin', segno: 'S', seed_ix: 3, pos: 5 },
            _6s: { ix: 35, nome: 'sei spade', symb: 'sei', segno: 'S', seed_ix: 3, pos: 6 },
            _7s: { ix: 36, nome: 'sette spade', symb: 'set', segno: 'S', seed_ix: 3, pos: 7 },
            _Fs: { ix: 37, nome: 'fante spade', symb: 'fan', segno: 'S', seed_ix: 3, pos: 8 },
            _Cs: { ix: 38, nome: 'cavallo spade', symb: 'cav', segno: 'S', seed_ix: 3, pos: 9 },
            _Rs: { ix: 39, nome: 're spade', symb: 're', segno: 'S', seed_ix: 3, pos: 10 }
        }
        var that = {}

        that.get_rank = function (card_lbl) {
            return deck_info_det[card_lbl].rank;
        }

        that.get_points = function (card_lbl) {
            return deck_info_det[card_lbl].points;
        }

        that.get_info_card = function (card_lbl) {
            return deck_info_det[card_lbl];
        }

        that.get_card_info = function (card_lbl) {
            return deck_info_det[card_lbl];
        }

        var cards_on_game = [
            '_Ab', '_2b', '_3b', '_4b', '_5b', '_6b', '_7b', '_Fb', '_Cb', '_Rb',
            '_Ac', '_2c', '_3c', '_4c', '_5c', '_6c', '_7c', '_Fc', '_Cc', '_Rc',
            '_Ad', '_2d', '_3d', '_4d', '_5d', '_6d', '_7d', '_Fd', '_Cd', '_Rd',
            '_As', '_2s', '_3s', '_4s', '_5s', '_6s', '_7s', '_Fs', '_Cs', '_Rs'];

        that.transform_to_52 = function () {
         
            deck_info_det = {
                _Ab: { ix: 0, nome: 'asso bastoni', symb: 'asso', segno: 'B', seed_ix: 0, pos: 1 },
                _2b: { ix: 1, nome: 'due bastoni', symb: 'due', segno: 'B', seed_ix: 0, pos: 2 },
                _3b: { ix: 2, nome: 'tre bastoni', symb: 'tre', segno: 'B', seed_ix: 0, pos: 3 },
                _4b: { ix: 3, nome: 'quattro bastoni', symb: 'qua', segno: 'B', seed_ix: 0, pos: 4 },
                _5b: { ix: 4, nome: 'cinque bastoni', symb: 'cin', segno: 'B', seed_ix: 0, pos: 5 },
                _6b: { ix: 5, nome: 'sei bastoni', symb: 'sei', segno: 'B', seed_ix: 0, pos: 6 },
                _7b: { ix: 6, nome: 'sette bastoni', symb: 'set', segno: 'B', seed_ix: 0, pos: 7 },
                _8b: { ix: 7, nome: 'otto bastoni', symb: 'ott', segno: 'B', seed_ix: 0, pos: 8 },
                _9b: { ix: 8, nome: 'nove bastoni', symb: 'nov', segno: 'B', seed_ix: 0, pos: 9 },
                _db: { ix: 9, nome: 'dieci bastoni', symb: 'die', segno: 'B', seed_ix: 0, pos: 10 },
                _Fb: { ix: 10, nome: 'fante bastoni', symb: 'fan', segno: 'B', seed_ix: 0, pos: 11 },
                _Cb: { ix: 11, nome: 'cavallo bastoni', symb: 'cav', segno: 'B', seed_ix: 0, pos: 12 },
                _Rb: { ix: 12, nome: 're bastoni', symb: 're', segno: 'B', seed_ix: 0, pos: 13 },

                _Ac: { ix: 13, nome: 'asso coppe', symb: 'asso', segno: 'C', seed_ix: 1, pos: 1 },
                _2c: { ix: 14, nome: 'due coppe', symb: 'due', segno: 'C', seed_ix: 1, pos: 2 },
                _3c: { ix: 15, nome: 'tre coppe', symb: 'tre', segno: 'C', seed_ix: 1, pos: 3 },
                _4c: { ix: 16, nome: 'quattro coppe', symb: 'qua', segno: 'C', seed_ix: 1, pos: 4 },
                _5c: { ix: 17, nome: 'cinque coppe', symb: 'cin', segno: 'C', seed_ix: 1, pos: 5 },
                _6c: { ix: 18, nome: 'sei coppe', symb: 'sei', segno: 'C', seed_ix: 1, pos: 6 },
                _7c: { ix: 19, nome: 'sette coppe', symb: 'set', segno: 'C', seed_ix: 1, pos: 7 },
                _8c: { ix: 20, nome: 'otto coppe', symb: 'ott', segno: 'C', seed_ix: 1, pos: 8 },
                _9c: { ix: 21, nome: 'nove coppe', symb: 'nov', segno: 'C', seed_ix: 1, pos: 9 },
                _dc: { ix: 22, nome: 'dieci coppe', symb: 'die', segno: 'C', seed_ix: 1, pos: 10 },
                _Fc: { ix: 23, nome: 'fante coppe', symb: 'fan', segno: 'C', seed_ix: 1, pos: 11 },
                _Cc: { ix: 24, nome: 'cavallo coppe', symb: 'cav', segno: 'C', seed_ix: 1, pos: 12 },
                _Rc: { ix: 25, nome: 're coppe', symb: 're', segno: 'C', seed_ix: 1, pos: 13 },

                _Ad: { ix: 26, nome: 'asso denari', symb: 'asso', segno: 'D', seed_ix: 2, pos: 1 },
                _2d: { ix: 27, nome: 'due denari', symb: 'due', segno: 'D', seed_ix: 2, pos: 2 },
                _3d: { ix: 28, nome: 'tre denari', symb: 'tre', segno: 'D', seed_ix: 2, pos: 3 },
                _4d: { ix: 29, nome: 'quattro denari', symb: 'qua', segno: 'D', seed_ix: 2, pos: 4 },
                _5d: { ix: 30, nome: 'cinque denari', symb: 'cin', segno: 'D', seed_ix: 2, pos: 5 },
                _6d: { ix: 31, nome: 'sei denari', symb: 'sei', segno: 'D', seed_ix: 2, pos: 6 },
                _7d: { ix: 32, nome: 'sette denari', symb: 'set', segno: 'D', seed_ix: 2, pos: 7 },
                _8d: { ix: 33, nome: 'otto denari', symb: 'ott', segno: 'D', seed_ix: 2, pos: 8 },
                _9d: { ix: 34, nome: 'nove denari', symb: 'nov', segno: 'D', seed_ix: 2, pos: 9 },
                _dd: { ix: 35, nome: 'dieci denari', symb: 'die', segno: 'D', seed_ix: 2, pos: 10 },
                _Fd: { ix: 36, nome: 'fante denari', symb: 'fan', segno: 'D', seed_ix: 2, pos: 11 },
                _Cd: { ix: 37, nome: 'cavallo denari', symb: 'cav', segno: 'D', seed_ix: 2, pos: 12 },
                _Rd: { ix: 38, nome: 're denari', symb: 're', segno: 'D', seed_ix: 2, pos: 13 },

                _As: { ix: 39, nome: 'asso spade', symb: 'asso', segno: 'S', seed_ix: 3, pos: 1 },
                _2s: { ix: 40, nome: 'due spade', symb: 'due', segno: 'S', seed_ix: 3, pos: 2 },
                _3s: { ix: 41, nome: 'tre spade', symb: 'tre', segno: 'S', seed_ix: 3, pos: 3 },
                _4s: { ix: 42, nome: 'quattro spade', symb: 'qua', segno: 'S', seed_ix: 3, pos: 4 },
                _5s: { ix: 43, nome: 'cinque spade', symb: 'cin', segno: 'S', seed_ix: 3, pos: 5 },
                _6s: { ix: 44, nome: 'sei spade', symb: 'sei', segno: 'S', seed_ix: 3, pos: 6 },
                _7s: { ix: 45, nome: 'sette spade', symb: 'set', segno: 'S', seed_ix: 3, pos: 7 },
                _8s: { ix: 46, nome: 'otto spade', symb: 'ott', segno: 'S', seed_ix: 3, pos: 8 },
                _9s: { ix: 47, nome: 'nove spade', symb: 'nov', segno: 'S', seed_ix: 3, pos: 9 },
                _ds: { ix: 48, nome: 'dieci spade', symb: 'die', segno: 'S', seed_ix: 3, pos: 10 },
                _Fs: { ix: 49, nome: 'fante spade', symb: 'fan', segno: 'S', seed_ix: 3, pos: 11 },
                _Cs: { ix: 50, nome: 'cavallo spade', symb: 'cav', segno: 'S', seed_ix: 3, pos: 12 },
                _Rs: { ix: 51, nome: 're spade', symb: 're', segno: 'S', seed_ix: 3, pos: 13 }
            };

            cards_on_game = [
                '_Ab', '_2b', '_3b', '_4b', '_5b', '_6b', '_7b', '_Fb', '_Cb', '_Rb', '_8b', '_9b', '_db',
                '_Ac', '_2c', '_3c', '_4c', '_5c', '_6c', '_7c', '_Fc', '_Cc', '_Rc', '_8c', '_9c', '_dc',
                '_Ad', '_2d', '_3d', '_4d', '_5d', '_6d', '_7d', '_Fd', '_Cd', '_Rd', '_8d', '_9d', '_dd',
                '_As', '_2s', '_3s', '_4s', '_5s', '_6s', '_7s', '_Fs', '_Cs', '_Rs', '_8s', '_9s', '_ds'];
            
        }

        that.get_cards_on_game = function () {
            return cards_on_game;
        }

        that.set_rank_points = function (arr_rank, arr_points) {
            var i, symb_card;
            for (i = 0; i < cards_on_game.length; i++) {
                var k = cards_on_game[i];
                var card = deck_info_det[k];
                if (card === undefined) {
                    throw (new Error('Error on deck ' + k + ' not found'));
                }
                symb_card = card.symb;
                card.rank = arr_rank[symb_card];
                card.points = arr_points[symb_card];
            }
        }

        return that;
    }

    m_exports.deck_info_dabriscola = function () {
        var that = m_exports.deck_info_ctor();
        var val_arr_rank = { sei: 6, cav: 9, qua: 4, re: 10, set: 7, due: 2, cin: 5, asso: 12, fan: 8, tre: 11 };
        var val_arr_points = { sei: 0, cav: 3, qua: 0, re: 4, set: 0, due: 0, cin: 0, asso: 11, fan: 2, tre: 10 };

        that.set_rank_points(val_arr_rank, val_arr_points)

        return that;
    }

    m_exports.deck_info_tombolon_padovano = function () {
        var that = m_exports.deck_info_ctor();
        that.transform_to_52();

        return that;
    }


    return m_exports;
});
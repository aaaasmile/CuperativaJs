
define(['../common/core/deck_info',
      '../common/core/game_replayer',
      ]
, function (deckinfo, mod_game_replayer) {
    var _log = log_ctor('qunit_core');

    module("basic");

    // cambiare codice qua causa problemi di refresh in chrome. Con Firefox no.
    // Ho usato la strategia per usare qunit e requirejs assieme descritta qui:
    // http://forum.jquery.com/topic/are-qunit-and-requirejs-compatible
    // Se occorrono altri mduli, vanno messi anche in alltest.js
    // Se hai problemi con console.log, apri firebug

    test("mazzo da briscola", function () {
        var deckbriscola = deckinfo.deck_info_dabriscola();

        equals(deckbriscola.get_rank('_3c'), 11, "rank 3 coppe deve essere 11");
        equals(deckbriscola.get_rank('_Ab'), 12, "rank asso bastoni deve essere 12");
        equals(deckbriscola.get_points('_Rs'), 4, "punti re di spade deve essere 4");
    });

    test("mazzo da tombolon padovano", function () {
        var deck = deckinfo.deck_info_tombolon_padovano();

        equals(deck.get_info_card('_dc').nome, 'dieci coppe', "_dc si chiama dieci coppe");

    });

    test("rand mgr get_deck", function () {
        var rnd_mgr = mod_game_replayer.random_manager_ctor();
        var cards_on_game = [
        '_Ab', '_2b', '_3b', '_4b', '_5b', '_6b', '_7b', '_Fb', '_Cb', '_Rb',
        '_Ac', '_2c', '_3c', '_4c', '_5c', '_6c', '_7c', '_Fc', '_Cc', '_Rc',
        '_Ad', '_2d', '_3d', '_4d', '_5d', '_6d', '_7d', '_Fd', '_Cd', '_Rd',
        '_As', '_2s', '_3s', '_4s', '_5s', '_6s', '_7s', '_Fs', '_Cs', '_Rs'];

        var deck_shuffled = rnd_mgr.get_deck(cards_on_game);
        _log.debug('Deck shuffled:' + deck_shuffled);
        _log.debug('First player: ' + rnd_mgr.get_first_player(2));
    });
});
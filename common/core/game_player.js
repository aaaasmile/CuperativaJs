// file: game_player.js

define(["core/algorithm_base"],
function (md_algbase) {

    m_exports = {};

    m_exports.game_player_ctor = function (options) {
        var _name, _alg;
        var _opt = options || {};
        var that = {position: undefined};

        _name = _opt.name || 'ignoto';
        _alg = _opt.alg;


        that.Name = function () {
            return _name;
        }

        that.Alg = function () {
            return _alg;
        }

        that.seat_position = function (position) {
            that.position = position;
            _alg.seat_position(position);

            return that;
        }

        that.init = function () {
            if (_alg) {
                _alg.set_owner(that);
                _alg.init();
            } else { throw (new Error('Algorithm is not defined')); }

            return that;
        }

        // shortcuts
        that.name = _name;
        that.alg = _alg;
        that.algorithm = _alg;

        return that;
    }




    return m_exports;

});
// file: action_event.js

define(function () {


    var m_exports = {};

    m_exports.action_queued_ctor = function (queue_name, executer) {
        var registry = [], that = {};
        var _log = log_ctor('action_queued');

        that.submit = function (func, args) {
            if (func === undefined) { throw (new Error('Handler is null')); }
            registry.push({ func: func, parameters: [args] });
            //_log.debug("Item submitted, queue size: " + registry.length + ' on ' + queue_name);
        }

        that.process_first = function () {
            //_log.debug('item process START, queue size: ' + registry.length + ' on ' + queue_name)
            if (registry.length == 0) {
                return;
            }
            var funinfo = registry.shift();
            try {
                funinfo.func.apply(executer, funinfo.parameters);
            } catch (e) {
                _log.error('Error on executing action handler process_first \nparam ' + JSON.stringify(funinfo.parameters) + '\nError: ' + e + '\n Stack: '+ e.stack );
                throw (e);
            }
            //_log.debug('item process END, queue size: ' + registry.length + ' on ' + queue_name)
        }

        that.has_items = function () {
            return registry.length > 0 ? true : false;
        }

        that.size = function () {
            return registry.length;
        }

        that.log_state = function () {
            _log.debug('queue: ' + queue_name + ' with items ' + registry.length);
        }

        that.clear = function () {
            registry = [];
        }

        

        return that;
    }

    m_exports.eventuality = function (that) {
        var _log = log_ctor('eventuality');
        var registry = {};
        var _channel = {};

        var resolve_type = function (event) {
            return typeof event === 'string' ?
                event : event.type
        }

        that.fire = function (event) {
            var array,
                func,
                handler,
                i,
                type = resolve_type(event);
            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 1);

            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                for (i = 0; i < array.length; i += 1) {
                    handler = array[i];

                    func = handler.method;
                    if (typeof func === 'string') {
                        func = this[func];
                    }
                    func.apply(this, args);
                }
            }
            else {
                _log.warn("Fire event " + event + " without handlers");
            }
            return this;
        };

        that.fire_channel = function (name_ch, evname) {
            var ch, handler, func;
            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 2);
            if (_channel.hasOwnProperty(name_ch)) {
                ch = _channel[name_ch];
                if (ch.hasOwnProperty(evname)) {
                    handler = ch[evname];
                    func = handler.method;
                    func.apply(this, args);
                }
                else {
                    _log.warn('fire_channel on ' + name_ch + ', but handler for ' + evname + ' is missed');
                }

            }
            else {
                _log.warn("fire_channel " + name_ch + " without channel");
            }
            return this;
        }

        that.subscribe = function (type, method) {

            var handler = {
                method: method
            };
            if (registry.hasOwnProperty(type)) {
                registry[type].push(handler);
            } else {
                registry[type] = [handler];
            }
            return this;
        };

        that.unsubscribe = function (event, method) {
            var type = resolve_type(event);
            registry[type] = registry[type].filter(
                function (el) {
                    if (el.method !== method) {
                        return el;
                    }
                }
            );
        }

        that.channel_subscribe = function (ch_name, event_name, func) {
            var handler = {
                method: func
            };
            if (_channel.hasOwnProperty(ch_name)) {
                if (_channel[ch_name].hasOwnProperty(event_name)) {
                    throw (new Error('Duplicate handler ' + event_name + ' on exclusive channel ' + ch_name));
                }
                _channel[ch_name][event_name] = handler;
            } else {
                _channel[ch_name] = {};
                _channel[ch_name][event_name] = handler;
            }
            return this;
        }

        that.channel_unsubscribe = function (ch_name, event_name, func) {
            if (_channel.hasOwnProperty(ch_name)) {
                if (_channel[ch_name].hasOwnProperty(event_name)) {
                    delete _channel[ch_name][event_name];
                }
            }
        }


        return that;
    };


    return m_exports;
});
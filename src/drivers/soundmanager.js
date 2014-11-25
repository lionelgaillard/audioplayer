(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'soundmanager'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'), require('soundmanager'));
  } else {
    // Browser globals
    factory(jQuery, soundManager);
  }
}(function ($, sm, undefined) {

  var AudioPlayer = $.fn.audioplayer.Constructor;

  function Driver (player, options) {
    this.player  = player;
    this.options = $.extend({}, this.DEFAULTS, options);
  }

  $.extend(Driver.prototype, {

    DEFAUTS: {

      /**
       * Directory of SM2's SWF files
       *
       * @type {String}
       */
      url: undefined

    },

    init: function (callback) {
      sm.setup($.extend({
        onready: callback
      }, this.options));
    },

    create: function (id, url, onFinish) {
      return sm.createSound({
        id: id,
        url: url,
        onfinish: onFinish
      });
    },

    play: function (id) {
      sm.play(id);
    },

    pause: function (id) {
      sm.pause(id);
    },

    stop: function (id) {
      sm.stop(id);
    },

    setPosition: function (id) {
      sm.setPosition(id, 0);
    },

  });

  AudioPlayer.prototype.DRIVERS.soundmanager = function (player, options) {
    return new Driver(player, options);
  };

  AudioPlayer.prototype.DEFAULTS.driver = 'soundmanager';

  return Driver;
}));
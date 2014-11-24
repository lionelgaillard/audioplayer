(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'createjs'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'), require('createjs'));
  } else {
    // Browser globals
    factory(jQuery, createjs.Sound);
  }
}(function ($, createjs, undefined) {

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
      createjs.Sound.setup($.extend({
        onready: callback
      }, this.options));
    },

    create: function (id, url, onFinish) {
      var sound = createjs.Sound.registerSound({
        id: id,
        url: url,
        onfinish: onFinish
      });

      sound.id = sound.uniqueId;

      return sound;
    },

    play: function (id) {
      createjs.Sound.play(id);
    },

    pause: function (id) {
      this.player.getCurrent().pause();
    },

    stop: function (id) {
      createjs.Sound.stop(id);
    }

  });

  $.fn.audioplayer.Constructor.prototype.DRIVERS.soundjs = function (player, options) {

    if (options.url) {
      createjs.FlashPlugin.swfPath = options.url;
    }

    createjs.Sound.registerPlugins([
      createjs.WebAudioPlugin,
      createjs.HTMLAudioPlugin,
      createjs.FlashPlugin
    ]);

    return new Driver(player, options);
  };

}));
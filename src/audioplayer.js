(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', 'soundmanager'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'), require('soundmanager'));
  } else {
    // Browser globals
    factory(jQuery, soundManager);
  }
}(function ($, sm, undefined) {

  "use strict";

  var old = $.fn.audioplayer;

  /**
   * Constructor
   *
   * @param {Element} element
   * @param {Object} options
   */
  function AudioPlayer (element, options) {
    this.options     = $.extend({}, this.DEFAULTS, options);

    this.$element    = $(element).hide();
    this.initialized = false;
    this.playing     = false;
    this.sounds      = [];
    this.index       = -1;

    this.$playlist   = $('[data-playlist]', this.$element);
    this.$label      = $('[data-label]', this.$element);
    this.$play       = $('[data-play]', this.$element);
    this.$pause      = $('[data-pause]', this.$element);
    this.$stop       = $('[data-stop]', this.$element);
    this.$backward   = $('[data-backward]', this.$element);
    this.$forward    = $('[data-forward]', this.$element);
    this.$random     = $('[data-random]', this.$element);

    this.$element.on('click', '[data-play]', $.proxy(this.play, this));
    this.$element.on('click', '[data-pause]', $.proxy(this.pause, this));
    this.$element.on('click', '[data-stop]', $.proxy(this.stop, this));
    this.$element.on('click', '[data-backward]', $.proxy(this.backward, this));
    this.$element.on('click', '[data-forward]', $.proxy(this.forward, this));
    this.$element.on('click', '[data-random]', $.proxy(this.random, this));
    this.$element.on('click', '[data-to]', $.proxy(this.to, this));

    this.update();

    sm.setup({
      url: this.options.url,
      onready: $.proxy(this.init, this)
    });
  }

  $.extend(AudioPlayer.prototype, {

    DEFAULTS: {

      /**
       * Directory of SM2's SWF files
       *
       * @type {String}
       */
      url: '/vendor/schillmania/soundmanager2/swf',

      /**
       * Use Flash, then HTML5 Audio as callback, or inverse
       *
       * @type {Boolean}
       */
      preferFlash: true,

      /**
       * Start playing immediately
       *
       * @type {Boolean}
       */
      autoPlay: true,

      /**
       * Play songs randomly
       *
       * @type {Boolean}
       */
      random: false,

      /**
       * Duration from song start (in milliseconds) within `backward`
       * will go to previous song instead of restart the current song
       *
       * @type {Number}
       */
      backwardDelay: 2000
    },

    /**
     * Init
     *
     * @return {void}
     */
    init: function () {
      var self = this,
          onFinish = $.proxy(this.next, this);

      if (this.initialized) {
        return;
      }

      this.sounds = [];
      this.$playlist.find('a,button').each(function (i) {
        var $this = $(this),
            title = $this.attr('title') || $this.attr('data-title') || $this.text(),
            url   = $this.attr('href')  || $this.attr('data-url');

        if ($this.attr('data-to') === undefined) {
          $this.attr('data-to', i);
        }

        self.sounds.push(sm.createSound({
          id: title,
          url: url,
          onfinish: onFinish
        }));
      });

      this.initialized = true;

      this.update();

      this.$element.show();

      this.$element.trigger('initialized.audioplayer', this.getCurrent());

      if (typeof this.options.onready == 'function') {
        this.options.onready.call(this.$element);
      }

      if (this.options.autoPlay) {
        this.next();
      }
    },

    /**
     * Update UI
     *
     * @return {void}
     */
    update: function () {
      this.$element.toggleClass('playing', this.playing);
      this.$label.text(this.getCurrent() ? this.getCurrent().id : '');
      this.$play.prop('disabled', !(this.initialized && !this.playing));
      this.$pause.prop('disabled', !(this.initialized && this.playing));
      this.$stop.prop('disabled', !(this.initialized && this.playing));
      this.$backward.prop('disabled', !(this.initialized));
      this.$forward.prop('disabled', !(this.initialized));
      this.$random.prop('disabled', !(this.initialized));
    },

    /**
     * Get current soudn
     *
     * @return {Object}
     */
    getCurrent: function () {
      if (this.sounds.length) {
        return this.sounds[this.index == -1 ? 0 : this.index];
      }
      return undefined;
    },

    /**
     * Play
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    play: function (e) {
      e && e.preventDefault();

      if (this.getCurrent()) {
        sm.play(this.getCurrent().id);
        this.playing = true;
        this.update();
        this.$element.trigger('play.audioplayer', this.getCurrent());
      }
    },

    /**
     * Pause
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    pause: function (e) {
      e && e.preventDefault();

      if (this.getCurrent()) {
        sm.pause(this.getCurrent().id);
        this.playing = false;
        this.update();
        this.$element.trigger('pause.audioplayer', this.getCurrent());
      }
    },

    /**
     * Stop
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    stop: function (e) {
      e && e.preventDefault();

      if (this.getCurrent()) {
        sm.stop(this.getCurrent().id);
        this.playing = false;
        this.update();
        this.$element.trigger('stop.audioplayer', this.getCurrent());
      }
    },

    /**
     * Backward
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    backward: function (e) {
      e && e.preventDefault();

      if (this.getCurrent().position < this.options.backwardDelay) {
        this.stop();
        if (this.index - 1 >= 0) {
          this.index--;
        } else {
          this.index = this.sounds.length - 1;
        }
        this.$element.trigger('backward.audioplayer', this.getCurrent());
        this.play();
      } else {
        sm.setPosition(this.getCurrent().id, 0);
        this.$element.trigger('backward.audioplayer', this.getCurrent());
      }
    },

    /**
     * Forward
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    forward: function (e) {
      e && e.preventDefault();

      this.stop();
      if (this.index + 1 < this.sounds.length) {
        this.index++;
      } else {
        this.index = 0;
      }
      this.$element.trigger('forward.audioplayer', this.getCurrent());
      this.play();
    },

    /**
     * Random
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    random: function (e) {
      var length = this.sounds.length,
          candidates, i;

      e && e.preventDefault();

      if (length == 1) {
        this.stop();
        this.play();
      } else if (length == 2) {
        this.forward();
      } else {
        this.stop();
        candidates = [];
        for (i in this.sounds) {
          if (i != this.index) {
            candidates.push(i);
          }
        }
        this.index = candidates[Math.floor(Math.random() * candidates.length)];
        this.$element.trigger('random.audioplayer', this.getCurrent());
        this.play();
      }
    },

    /**
     * Next
     *
     * @param  {Event|undefined} e
     * @return {void}
     */
    next: function (e) {
      e && e.preventDefault();

      if (this.options.random) {
        this.random();
      } else {
        this.forward();
      }
      this.$element.trigger('next.audioplayer', this.getCurrent());
    },

    /**
     * To
     *
     * @param  {Number|Event|undefined} e
     * @return {void}
     */
    to: function (e) {
      var index = e.target ? parseInt($(e.target).attr('data-to')) : e;

      e.target && e.preventDefault();

      if (index < 0) {
        index = 0;
      } else if (index >= this.sounds.length) {
        index = this.sounds.length - 1;
      }

      if (index != this.index) {
        this.stop();
        this.index = index;
        this.$element.trigger('to.audioplayer', this.getCurrent());
        this.play();
      }
    }

  });


  /**
   * jQuery plugin
   *
   * @param  {Object|undefined} option
   * @return {jQuery}
   */
  $.fn.audioplayer = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('wxr.audioplayer'),
          options = typeof option == 'object' && option;

      if (!data) {
        $this.data('wxr.audioplayer', (data = new this.Constructor(this, options)));
      }

      if (typeof option == 'string') {
        data[option]();
      }
    });
  };

  /**
   * jQuery plugin's constructor for inheritance purpose
   *
   * @type {AudioPlayer}
   */
  $.fn.audioplayer.Constructor = AudioPlayer;

  /**
   * jQuery plugin's no conflit method
   *
   * @return {$.fn.audioplayer}
   */
  $.fn.audioplayer.noConflict = function () {
    $.fn.audioplayer = old;
    return this;
  };

}));
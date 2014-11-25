var $   = require('jquery');
var old = $.fn.audioplayer;

/**
 * Constructor
 *
 * @param {Element} element
 * @param {Object} options
 */
function AudioPlayer (element, options) {

  this.$element    = $(element).hide();
  this.options     = $.extend({}, this.DEFAULTS, options);
  this.initialized = false;
  this.playing     = false;
  this.tracks      = [];
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

  if (typeof this.DRIVERS[this.options.driver] !== 'function') {
    throw new Error('Driver required');
  }

  this.driver = this.DRIVERS[this.options.driver](this, this.options);
  this.driver.init($.proxy(this.init, this));
}

$.extend(AudioPlayer.prototype, {

  DEFAULTS: {

    /**
     * Driver
     *
     * @type {String} 'soundmanager'|'soundjs'
     */
    driver: '',

    /**
     * Directory of SM2's or SoundJS SWF files
     * Required for Flash fallback
     *
     * @type {String}
     */
    url: undefined,

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
   * Drivers
   *
   * @type {Object}
   */
  DRIVERS: {},

  /**
   * Init
   *
   * @return {void}
   */
  init: function () {
    var self       = this;

    if (this.initialized) {
      return;
    }

    this.tracks = [];
    this.$playlist.find('a,button').each(function (i) {
      var $this = $(this),
          title = $this.attr('title') || $this.attr('data-title') || $this.text(),
          url   = $this.attr('href')  || $this.attr('data-url');

      if ($this.attr('data-to') === undefined) {
        $this.attr('data-to', i);
      }

      self.driver.create(title, url);
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

  add: function (track) {
    this.tracks.push(track);
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
   * @return {Object|null}
   */
  getCurrent: function () {
    if (this.tracks.length) {
      return this.tracks[this.index === -1 ? 0 : this.index];
    }
    return null;
  },

  /**
   * Find sound instance by id
   *
   * @param  {String} id
   * @return {Object|null}
   */
  find: function (id) {
    var i = this.tracks.length;

    if (this.getCurrent() && this.getCurrent().id === id) {
      return this.getCurrent();
    }

    while (i--) {
      if (this.tracks[i].id === id) {
        return this.tracks[i];
      }
    }

    return null;
  },

  /**
   * Play
   *
   * @param  {Event|undefined} e
   * @return {void}
   */
  play: function (e) {
    e && e.preventDefault();

    if (!this.initialized) {
      return;
    }

    if (this.getCurrent()) {
      this.driver.play();
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

    if (!this.initialized) {
      return;
    }

    if (this.getCurrent()) {
      this.driver.pause();
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

    if (!this.initialized) {
      return;
    }

    if (this.getCurrent()) {
      this.driver.stop();
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

    if (!this.initialized) {
      return;
    }

    if (this.getCurrent().position < this.options.backwardDelay) {
      this.stop();
      if (this.index - 1 >= 0) {
        this.index--;
      } else {
        this.index = this.tracks.length - 1;
      }
      this.$element.trigger('backward.audioplayer', this.getCurrent());
      this.play();
    } else {
      this.driver.setPosition(0);
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

    if (!this.initialized) {
      return;
    }

    this.stop();
    if (this.index + 1 < this.tracks.length) {
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
    var length = this.tracks.length,
        candidates, i;

    if (!this.initialized) {
      return;
    }

    e && e.preventDefault();

    if (length == 1) {
      this.stop();
      this.play();
    } else if (length == 2) {
      this.forward();
    } else {
      this.stop();
      candidates = [];
      for (i in this.tracks) {
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

    if (!this.initialized) {
      return;
    }

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

    if (!this.initialized) {
      return;
    }

    if (index < 0) {
      index = 0;
    } else if (index >= this.tracks.length) {
      index = this.tracks.length - 1;
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
        options = typeof option === 'object' && option;

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

module.exports = AudioPlayer;

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("createjs"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "createjs"], factory);
	else if(typeof exports === 'object')
		exports["audioplayer-soundjs"] = factory(require("jquery"), require("createjs"));
	else
		root["audioplayer-soundjs"] = factory(root["jquery"], root["createjs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var AudioPlayer = __webpack_require__(1);
	var Driver      = __webpack_require__(2);

	module.exports = AudioPlayer;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $   = __webpack_require__(3);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var AudioPlayer = __webpack_require__(1);
	var Sound       = __webpack_require__(4).Sound;
	var $           = __webpack_require__(3);

	function SoundJSDriver (player, options) {
	  this.player  = player;
	  this.options = $.extend({}, this.DEFAULTS, options);

	  Sound.addEventListener('fileload', $.proxy(this._onFileload, this));
	}

	$.extend(SoundJSDriver.prototype, {

	  DEFAUTS: {

	    /**
	     * Directory of SoundJS SWF files
	     *
	     * @type {String}
	     */
	    url: undefined
	  },

	  init: function (callback) {
	    callback && callback();
	  },

	  create: function (id, url) {
	    Sound.registerSound(url, id);
	  },

	  play: function () {
	    var track = this.player.getCurrent();

	    if (track) {
	      track.play();
	    }
	  },

	  pause: function () {
	    var track = this.player.getCurrent();

	    if (track) {
	      track.pause();
	    }
	  },

	  stop: function () {
	    var track = this.player.getCurrent();

	    if (track) {
	      track.stop();
	    }
	  },

	  setPosition: function (position) {
	    var track = this.player.getCurrent();

	    if (track) {
	      track.setPosition(position);
	    }
	  },

	  _onFileload: function (e) {
	    var track = Sound.createInstance(e.id);

	    track.addEventListener('complete', $.proxy(this.player.next, this.player));

	    this.player.add(track);

	    if (this.player.options.autoPlay && !this.player.playing) {
	      this.player.play();
	    }
	  }

	});

	AudioPlayer.prototype.DEFAULTS.driver = 'soundjs';

	AudioPlayer.prototype.DRIVERS.soundjs = function (player, options) {
	  options = $.extend({}, options, SoundJSDriver.prototype.DEFAULTS),
	  plugins = [
	    createjs.WebAudioPlugin,
	    createjs.HTMLAudioPlugin
	  ];

	  if (options.url) {
	    createjs.FlashPlugin.swfPath = options.url;
	  }

	  if (options.preferFlash) {
	    plugins.unshift(createjs.FlashPlugin);
	  } else {
	    plugins.push(createjs.FlashPlugin);
	  }

	  Sound.registerPlugins(plugins);

	  return new SoundJSDriver(player, options);
	};

	module.exports = AudioPlayer.prototype.DRIVERS.soundjs;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});

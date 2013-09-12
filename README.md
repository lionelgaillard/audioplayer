AudioPlayer
===========

jQuery plugin on top of "SoundManager 2" to implement a custom audio player.

[SoundManager 2](http://www.schillmania.com/projects/soundmanager2/)


Default options
---------------

See [SoundManager 2 Documentation](http://www.schillmania.com/projects/soundmanager2/doc/#sm-config)

```javascript
AudioPlayer.DEFAULTS = {
  // Directory of SM2's SWF files
  url: '/swf/',
  // Use Flash, then HTML5 Audio as callback, or inverse
  preferFlash: true,
  // Start playing immediately
  autoPlay: true,
  // Play songs randomly
  random: false,
  // Duration from song start (in milliseconds) within `backward`
  // will go to previous song instead of restart the current song
  backwardDelay: 2000,
  // Songs directory
  // { "Song's title": "Song's URL" }
  sounds: {}
};
```


Events
------

### initialized.audioplayer

### play.audioplayer

### pause.audioplayer

### stop.audioplayer

### backward.audioplayer

### forward.audioplayer

### random.audioplayer

### next.audioplayer

`next` can be `forward` or `random` according to `random` option.


Quick start
-----------

### HTML

```html
<div id="player" class="audioplayer">
  <label data-label="#player"></label>
  <button type="button" class="btn" data-play="#player"><i class="icon-play"></i></button>
  <button type="button" class="btn" data-pause="#player"><i class="icon-pause"></i></button>
</div>
```

### Javascript

```javascript
jQuery(function($) {
  $('#player').audioplayer({
    url: '/vendor/schillmania/soundmanager2/swf/',
    autoPlay: true,
    sounds: {
      'Awesome Song':    '/music/awesome_song.mp3',
      'Incredible Song': '/music/incredible_song.mp3'
    }
  });
});
```
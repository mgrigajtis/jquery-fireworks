(function ($, Fireworks) {
  if (!Fireworks || !Fireworks.createFireworks) {
    $.fn.fireworks = function () {
      return this;
    };
    return;
  }

  $.fn.fireworks = function (options) {
    return this.each(function () {
      var instance = Fireworks.createFireworks(this, options);
      $(this).data('fireworks', instance);
    });
  };

  $.fn.fireworksDestroy = function () {
    return this.each(function () {
      var instance = $(this).data('fireworks');
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
      $(this).removeData('fireworks');
    });
  };
}(jQuery, window.Fireworks));

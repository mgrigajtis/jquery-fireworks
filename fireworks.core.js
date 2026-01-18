(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Fireworks = factory();
  }
}(this, function () {
  function toNumber(value) {
    var num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  function Fireworks(element, options) {
    if (!element) {
      throw new Error('Fireworks requires a DOM element.');
    }

    this.element = element;
    this.options = options || {};
    this.options.opacity = typeof this.options.opacity === 'number' ? this.options.opacity : 1;

    this.fixedWidth = typeof this.options.width !== 'undefined';
    this.fixedHeight = typeof this.options.height !== 'undefined';

    this.particles = [];
    this.rockets = [];
    this.maxParticles = 400;

    this.screenWidth = this.getWidth();
    this.screenHeight = this.getHeight();

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fireworksField';
    this.canvas.width = this.screenWidth;
    this.canvas.height = this.screenHeight;
    this.canvas.style.width = this.screenWidth + 'px';
    this.canvas.style.height = this.screenHeight + 'px';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.opacity = this.options.opacity;
    this.canvas.style.zIndex = '0';

    this.context = this.canvas.getContext('2d');

    this.launchTimer = null;
    this.loopTimer = null;
    this.running = false;

    this.ensurePositioning();
    this.start();
  }

  Fireworks.prototype.ensurePositioning = function () {
    var style = window.getComputedStyle(this.element);
    if (style.position === 'static') {
      this.element.style.position = 'relative';
    }
  };

  Fireworks.prototype.getWidth = function () {
    var width = this.fixedWidth ? toNumber(this.options.width) : toNumber(this.element.clientWidth);
    if (!width || width < 1) {
      width = toNumber(this.element.offsetWidth) || 1;
    }
    return width;
  };

  Fireworks.prototype.getHeight = function () {
    var height = this.fixedHeight ? toNumber(this.options.height) : toNumber(this.element.clientHeight);
    if (!height || height < 1) {
      height = toNumber(this.element.offsetHeight) || 1;
    }
    return height;
  };

  Fireworks.prototype.start = function () {
    var self = this;
    if (self.running) {
      return;
    }

    self.running = true;

    if (!self.canvas.parentNode) {
      self.element.appendChild(self.canvas);
    }

    function Particle(pos) {
      this.pos = {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0
      };
      this.vel = {
        x: 0,
        y: 0
      };
      this.shrink = 0.97;
      this.size = 2;
      this.resistance = 1;
      this.gravity = 0;
      this.flick = false;
      this.alpha = 1;
      this.fade = 0;
      this.color = 0;
    }

    Particle.prototype.update = function () {
      this.vel.x *= this.resistance;
      this.vel.y *= this.resistance;
      this.vel.y += this.gravity;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.size *= this.shrink;
      this.alpha -= this.fade;
    };

    Particle.prototype.render = function (c) {
      if (!this.exists()) {
        return;
      }

      c.save();
      c.globalCompositeOperation = 'lighter';

      var x = this.pos.x,
          y = this.pos.y,
          r = this.size / 2;

      var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
      gradient.addColorStop(0.1, 'rgba(255,255,255,' + this.alpha + ')');
      gradient.addColorStop(0.8, 'hsla(' + this.color + ', 100%, 50%, ' + this.alpha + ')');
      gradient.addColorStop(1, 'hsla(' + this.color + ', 100%, 50%, 0.1)');

      c.fillStyle = gradient;

      c.beginPath();
      c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
      c.closePath();
      c.fill();

      c.restore();
    };

    Particle.prototype.exists = function () {
      return this.alpha >= 0.1 && this.size >= 1;
    };

    function Rocket(x) {
      Particle.apply(this, [{
        x: x,
        y: self.screenHeight
      }]);

      this.explosionColor = 0;
    }

    Rocket.prototype = new Particle();
    Rocket.prototype.constructor = Rocket;

    Rocket.prototype.explode = function () {
      var count = Math.random() * 10 + 80;

      for (var i = 0; i < count; i++) {
        var particle = new Particle(this.pos);
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

        particle.vel.x = Math.cos(angle) * speed;
        particle.vel.y = Math.sin(angle) * speed;
        particle.size = 10;
        particle.gravity = 0.2;
        particle.resistance = 0.92;
        particle.shrink = Math.random() * 0.05 + 0.93;
        particle.flick = true;
        particle.color = this.explosionColor;

        self.particles.push(particle);
      }
    };

    Rocket.prototype.render = function (c) {
      if (!this.exists()) {
        return;
      }

      c.save();
      c.globalCompositeOperation = 'lighter';

      var x = this.pos.x,
          y = this.pos.y,
          r = this.size / 2;

      var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
      gradient.addColorStop(0.1, 'rgba(255, 255, 255 ,' + this.alpha + ')');
      gradient.addColorStop(1, 'rgba(0, 0, 0, ' + this.alpha + ')');

      c.fillStyle = gradient;

      c.beginPath();
      c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
      c.closePath();
      c.fill();

      c.restore();
    };

    function updateSize() {
      var newWidth = self.getWidth();
      var newHeight = self.getHeight();

      if (self.screenWidth !== newWidth) {
        self.canvas.width = self.screenWidth = newWidth;
        self.canvas.style.width = newWidth + 'px';
      }
      if (self.screenHeight !== newHeight) {
        self.canvas.height = self.screenHeight = newHeight;
        self.canvas.style.height = newHeight + 'px';
      }
    }

    function loop() {
      updateSize();

      self.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      self.context.fillRect(0, 0, self.screenWidth, self.screenHeight);

      var existingRockets = [];

      for (var i = 0; i < self.rockets.length; i++) {
        self.rockets[i].update();
        self.rockets[i].render(self.context);

        var distance = Math.sqrt(Math.pow(self.screenWidth - self.rockets[i].pos.x, 2) + Math.pow(self.screenHeight - self.rockets[i].pos.y, 2));
        var randomChance = self.rockets[i].pos.y < (self.screenHeight * 2 / 3) ? (Math.random() * 100 <= 1) : false;

        if (self.rockets[i].pos.y < self.screenHeight / 5 || self.rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
          self.rockets[i].explode();
        } else {
          existingRockets.push(self.rockets[i]);
        }
      }

      self.rockets = existingRockets;

      var existingParticles = [];

      for (i = 0; i < self.particles.length; i++) {
        self.particles[i].update();

        if (self.particles[i].exists()) {
          self.particles[i].render(self.context);
          existingParticles.push(self.particles[i]);
        }
      }

      self.particles = existingParticles;

      while (self.particles.length > self.maxParticles) {
        self.particles.shift();
      }
    }

    function launchFrom(x) {
      if (self.rockets.length < 10) {
        var rocket = new Rocket(x);
        rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
        rocket.vel.y = Math.random() * -3 - 4;
        rocket.vel.x = Math.random() * 6 - 3;
        rocket.size = 8;
        rocket.shrink = 0.999;
        rocket.gravity = 0.01;
        self.rockets.push(rocket);
      }
    }

    function launch() {
      launchFrom(self.screenWidth / 2);
    }

    self.launchTimer = setInterval(launch, 800);
    self.loopTimer = setInterval(loop, 1000 / 50);
  };

  Fireworks.prototype.stop = function () {
    if (this.launchTimer) {
      clearInterval(this.launchTimer);
      this.launchTimer = null;
    }
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.running = false;
  };

  Fireworks.prototype.destroy = function () {
    this.stop();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  };

  function createFireworks(element, options) {
    return new Fireworks(element, options);
  }

  return {
    Fireworks: Fireworks,
    createFireworks: createFireworks
  };
}));

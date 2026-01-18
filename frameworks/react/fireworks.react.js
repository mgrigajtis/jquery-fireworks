(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], function (React) {
      return factory(React, root.Fireworks);
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('react'), require('../../fireworks.core.js'));
  } else {
    root.FireworksReact = factory(root.React, root.Fireworks);
  }
}(this, function (React, Fireworks) {
  if (!React) {
    throw new Error('React is required for FireworksReact.');
  }

  function FireworksCanvas(props) {
    var ref = React.useRef(null);
    var options = (props && props.options) || props || {};

    React.useEffect(function () {
      if (!ref.current || !Fireworks || !Fireworks.createFireworks) {
        return;
      }
      var instance = Fireworks.createFireworks(ref.current, options);
      return function () {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      };
    }, [options.opacity, options.width, options.height]);

    return React.createElement('div', {
      ref: ref,
      className: props && props.className,
      style: props && props.style
    });
  }

  return {
    FireworksCanvas: FireworksCanvas
  };
}));

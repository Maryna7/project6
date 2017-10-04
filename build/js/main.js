// page init
jQuery(function(){
  initMobileNav();
});

// mobile menu init
function initMobileNav() {
  jQuery('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener'
  });
}

/*
 * Simple Mobile Navigation
 */
;(function($) {
  function MobileNav(options) {
    this.options = $.extend({
      container: null,
      hideOnClickOutside: false,
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener',
      menuDrop: '.nav-drop',
      toggleEvent: 'click',
      outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
    }, options);
    this.initStructure();
    this.attachEvents();
  }
  MobileNav.prototype = {
    initStructure: function() {
      this.page = $('html');
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function() {
      var self = this;

      if(activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }

      this.outsideClickHandler = function(e) {
        if(self.isOpened()) {
          var target = $(e.target);
          if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
            self.hide();
          }
        }
      };

      this.openerClickHandler = function(e) {
        e.preventDefault();
        self.toggle();
      };

      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function() {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function() {
      this.container.addClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function() {
      this.container.removeClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function() {
      if(this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function() {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    }
  };

  var activateResizeHandler = function() {
    var win = $(window),
      doc = $('html'),
      resizeClass = 'resize-active',
      flag, timer;
    var removeClassHandler = function() {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function() {
      if(!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on('resize orientationchange', resizeHandler);
  };

  $.fn.mobileNav = function(options) {
    return this.each(function() {
      var params = $.extend({}, options, {container: this}),
        instance = new MobileNav(params);
      $.data(this, 'MobileNav', instance);
    });
  };
}(jQuery));

// Grayscale Images fix for IE10-IE11
var GrayScaleFix = (function() {
  var needToFix = /(MSIE 10)|(Trident.*rv:11\.0)|( Edge\/[\d\.]+$)/.test(navigator.userAgent);

  function replaceImage(image) {
    var tmpImage = new Image();
    tmpImage.onload = function() {
      var imgWrapper = document.createElement('span'),
        svgTemplate = 
        '<svg xmlns="http://www.w3.org/2000/svg" id="svgroot" viewBox="0 0 '+tmpImage.width+' '+tmpImage.height+'" width="100%" height="100%">' +
          '<defs>' +
          '<filter id="gray">' +
            '<feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" />' +
          '</filter>' +
          '</defs>' +
          '<image filter="url(&quot;#gray&quot;)" x="0" y="0" width="'+tmpImage.width+'" height="'+tmpImage.height+'" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+tmpImage.src+'" />' +
        '</svg>';
      
      imgWrapper.innerHTML = svgTemplate;
      imgWrapper.className = 'grayscale-fix';
      image.parentNode.insertBefore(imgWrapper, image);

      image.style.cssText += 'visibility:hidden;display:block';
      imgWrapper.querySelector('svg').style.position = 'absolute';
      imgWrapper.style.cssText = 'display:inline-block;position:relative;';
      imgWrapper.appendChild(image);
    };
    tmpImage.src = image.src;
  }

  function replaceAll() {
    var images = document.querySelectorAll('img.grayscale');
    for(var i = 0; i < images.length; i++) {
      replaceImage(images[i]);
    }
  }

  if(needToFix) {
    document.addEventListener('DOMContentLoaded', replaceAll);
  }

  return {
    replace: replaceImage,
    refresh: replaceAll
  };
}());
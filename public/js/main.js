$(function() {
  var navItems = []
  , $html = $('html, body')
  , $window = $(window)
  , $navItems = $('.navbar-nav li')
  , $footerNavItems = $('.footer-nav li')
  , $brand = $('.navbar-brand')
  , $toTop = $('.back-to-top')
  , $carouselMenuLeft = $('.menu-left')
  , $carouselMenuRight = $('.menu-right')
  , $carouselInner = $('#stories-carousel-inner')
  , $carouselItem = $carouselInner.find('.item')
  , useToTop = true;

  $carouselMenuLeft.on('click', carouselMove.bind(null, '<'));
  $carouselMenuRight.on('click', carouselMove.bind(null, '>'));

  function carouselMove(direction) {
    var left = parseInt($carouselInner.css('left'))
      , itemWidth = $carouselItem.outerWidth(true)
      , isRight = direction === '>'
      , offset = isRight ? left - itemWidth : left + itemWidth
      , maxOffset = - ($carouselItem.length * itemWidth) / 2;

    if (! isRight && offset > 0 || isRight && offset < maxOffset) return;
    $carouselInner.animate({left: offset}, 200);
  }

  $navItems.each(function() {
    var itm = $(this).find('a').attr('href');
    if(itm.startsWith('/#')) {
      var href = itm.substring(1);
      navItems.push(href);
    }
  });

  handleToTopVisibility();
  handleToTop();

  $window.on('scroll', function() {
    handleToTop();
    var windowTop = window.pageYOffset;
    navItems.map(function(selector, i) {
      var $item = $(selector);
      var itemTop = offsetTop($item);
      if (windowTop >= itemTop) selectItem($($navItems[i]));
    });
  });

  $window.on('resize', function() {
    handleToTopVisibility();
  });

  $navItems.on('click', onNavClick);
  $footerNavItems.on('click', onNavClick);
  $brand.on('click', onNavClick);
  $toTop.on('click', onNavClick);

  function onNavClick(e) {
    var $this = $(this);
    var id = $this.prop('tagName') === 'A' ? $this.attr('href') : $this.find('a').attr('href');
    var offset = offsetTop($(id));
    $html.animate({scrollTop: offset}, 500);
  }

  function offsetTop ($item) {
    if(!$item.offset()) return;
    return $item.offset().top - 85;
  }

  function selectItem ($item) {
    $navItems.each(function() {
      $(this).removeClass('active');
    });
    $item.addClass('active');
  }

  function showToTop() {
    $toTop.fadeIn('fast');
  }

  function hideToTop() {
    $toTop.fadeOut('fast');
  }

  function handleToTop() {
    if (! useToTop) return;
    if (window.pageYOffset > 800) showToTop();
    else hideToTop();
  }

  function handleToTopVisibility() {
    if ($window.width() < 1200) useToTop = false;
    else useToTop = true;
  }

  $('.copyright .year').html((new Date).getFullYear());
});

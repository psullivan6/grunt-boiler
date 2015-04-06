(function(){
  
  var $currentActive;
  
  $('.swatch').click(function(){
    
    var $this = $(this);
    var colorValues = {
      'hex' : $this.data('color-hex')
    };
    
    console.log(colorValues);
    
    if (!$this.is($currentActive)) {
      $('.swatch').removeClass('active');
    }
    
    if ($this.hasClass('active')) {
      $this.removeClass('active');
    } else {
      $this.addClass('active');
    }
    
    $currentActive = $this;
  });
})();

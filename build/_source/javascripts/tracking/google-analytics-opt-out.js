(function(window){
  var _window = window;
  
  // The following code from: https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#optout
  var googleAnalyticsProperty = 'UA-24494089-2';
  
  // Disable tracking if the opt-out cookie exists.
  var disableString = 'ga-disable-' + googleAnalyticsProperty;
  if (document.cookie.indexOf(disableString + '=true') > -1) { _window[disableString] = true; }
  
  // Opt-out function
  _window.gaOptout = function() {
    document.cookie = disableString + '=true; expires=Sun, 04 Feb 2103 02:40:00 GMT; path=/';
    _window[disableString] = true;
  };
  
})(window);

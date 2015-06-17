$(document).ready(function(){ // this is the main application
  "use strict";
  console.log("Starting...");

  var handler = function(v) {
    return function(event) {
      event.preventDefault();
      setView(v);
    };
  };

  for (var i=0; i<views.length; i++) {
    var view = views[i];
    console.log("View: ", view.me);
    addView(view.me);
    $('#view-'+view.me ).button().click( handler(view.me) );
    $('.'+view.me).toggle();
  }

  view = document.location.search;
  if ( view ) {
    view = view.split('?view=')[1];
    console.log("Set initial view to ", view);
  } else {
    view = "bcm1f";
  }

  setView(view);
});

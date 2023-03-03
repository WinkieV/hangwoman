"use strict"

// initialize SVG elements and restore visibility

window.addEventListener('load', function () {
  initialize();

  // show initialized SVG
  document.getElementById('all').style.visibility = 'visible';
});
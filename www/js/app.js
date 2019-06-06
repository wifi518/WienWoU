// show error on mobile
window.onerror = function( err ) {
  console.log( err );
  return true;
}
console.log = function(s) {
    $( '#debug').html(s).css({padding:10});
}

document.addEventListener( 'deviceready', function() {
  $( document ).ready( function() {
    console.log( 'DOM ready, alles ready...' );
    $('#debug').on('click', function() { $(this).empty().css({padding:0}); });
    var karte = L.map( 'map' );
    L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    } ).addTo( karte );
    karte.setView( [ 48.21, 16.38 ], 12 );
  
  });
});

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

    $.ajax({
      url:'http://localhost:8125/getstations',
      method:'post',
      data:{},
      success:function(data) {
        console.info( data );
        for ( k in data.lines ) {
          var latlngs = [];
          for ( i in data.lines[k].stations ) {
            latlngs.push([
              data.lines[k].stations[i].lat,
              data.lines[k].stations[i].lng
            ]);
          }
          var polyline = L.polyline(latlngs, {weight:5, color: data.lines[k].color }).addTo(karte);
        }

      }
    })


  });
});

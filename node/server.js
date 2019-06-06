var express = require( 'express' ); // Server
var bp = require( 'body-parser' ); // Request-Daten
var fs = require( 'fs' ); // Dateien
var request = require( 'request' ); // Server-Request
var csv = require( 'csv' ); // CSV-Dateien einlesen

var app = express();
var server = app.listen(8125, function() {
  console.log( 'Server läuft Port 8125' );
});

var urlLinienCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv';
var urlSteigeCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-steige.csv';
var urlHaltestellenCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv';

var linien, steige, haltestellen;

var loadCSV = function( url ) {
  return new Promise( function( res, rej) {
      console.log( 'start load: '+url+'\n' );
      request.get( url, function( err, response, body ) {
        if ( !err && response.statusCode == 200 ) {
          res( body );
        } else {
          rej( 'load '+url ); // für catch
        }
      })
  });
}

var parseCSV = function( data, url ) {
  return new Promise( function( res, rej) {
      console.log( 'start parse csv\n' );
      csv.parse( data, {delimiter:';'}, function(err, data) {
        if ( !err ) {
          res( data );
        } else {
          rej( 'csv parse' );
        }
      });
  });
}

var saveJSON = function() {

  return new Promise( function( res,rej) {

  var data = {lines:[]};
  var c = {
    U1:'#e20613',
    U2:'#a762a3',
    U3:'#ee7d00',
    U4:'#009540',
    U6:'#9d6930'
  };

  var linienId =[];

  //console.log( linien );
  for (i in linien ) {
    if ( linien[i][4] == 'ptMetro' ) {
      linienId[ linien[i][0]*1 ] = data.lines.length;
      data.lines.push({
        name:linien[i][1],
        color:c[linien[i][1]],
        stations:[]
      });
    }
  }
  //console.log( linienId );
  //console.log( steige );
  for ( i in steige ) {
    var j = linienId[ steige[i][1] ];
    //console.log( 's'+steige[1] );
    if ( typeof j == 'number' ) {
        if ( data.lines[j].stations.indexOf( steige[i][2]) == -1 ) {
          data.lines[j].stations.push(steige[i][2]);
        }
    }
  }



  var hs = [];
  for ( i in haltestellen ) {

    if ( isFinite(haltestellen[i][0]*1) ) {
      hs[ haltestellen[i][0]*1 ] = [
         haltestellen[i][3],  haltestellen[i][6], haltestellen[i][7]
      ];
    }
  }



  for (i in data.lines ) {
    for (j in data.lines[i].stations ) {
      var k = data.lines[i].stations[j];
      data.lines[i].stations[j] = {
        name: hs[k][0],
        lat:hs[k][1],
        lng:hs[k][2]
      }
    }
  }

  fs.writeFile( 'linien.json', JSON.stringify(data), function(err) {
    if ( !err ) {
      res();
    } else {
      rej();
    }
  } );

  });

}

app.get( '/createjson', function(req,res) {

  // 1. Lade CSV Datei (Linien)
  loadCSV( urlLinienCSV )
    .then( parseCSV ) // 2. Parse CSV
    .then( function( data ) {
        linien = data;
        return loadCSV( urlSteigeCSV ); // 3. Lade CSV Datei (Steige)
    })
    .then( parseCSV )   // 4. Parse CSV
    .then( function( data ) {
        steige = data;
        return loadCSV( urlHaltestellenCSV ); // 5. Lade CSV Datei (HS)
    })
    .then( parseCSV ) // 6. Parse CSV
    .then( function(data) {
        haltestellen = data;
        // 7. Speichere JSON
        return saveJSON();

    })
    .then( function() {
        console.log( 'alles fertig.' );
    })
    .catch( function( err ) {
      console.log( 'CSV Einlesefehler: ' + err+ '\n' );
    });

  res.end( 'linien.json created' );
});

app.post( '/getstations', function(req,res) {
    res.sendFile( __dirname+'/linien.json' );
});

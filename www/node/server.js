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

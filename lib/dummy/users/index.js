'use strict';

var users = require('../../users');

var NUMBER_OF_SUMMY_USERS = 50;

var FIRST_NAMES = ['EWAN', 'JANE', 'CHARLTON', 'MARGARET', 'CHARLES', 'CHARLOTE', 'ALDO', 'ANDY', 'EMMA'];
var LAST_NAMES = ['SLATER', 'HESTON', 'PETERSON', 'O\'HARA', 'O\'DONNELL', 'GARCIA', 'KENNEDY', 'BACON', 'RAINE', 'WATSON'];

module.exports = function () {
  for (var i = 0; i < NUMBER_OF_SUMMY_USERS; i++) {
    var id = 1000 + i;
    var data = {
      id: id,
      firstname: FIRST_NAMES[Math.floor((Math.random() * FIRST_NAMES.length))],
      lastname: LAST_NAMES[Math.floor((Math.random() * LAST_NAMES.length))]
    };
    users.writeUser(id, data, function (err, data) {
      if(err) {
        console.error('ERROR', err);
      }
    });
  }
}

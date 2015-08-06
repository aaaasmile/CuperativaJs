
var fs = require('fs');

var name = '01_basto.png';
var dest;
var segno = 'spade';
for (var i = 1; i < 11; i++) {
    var prefix = i < 10 ? '0' : '';
    dest = prefix + i + '_' + segno + '.png';
    fs.createReadStream(name).pipe(fs.createWriteStream(dest));
    console.log('Write ', dest);
}
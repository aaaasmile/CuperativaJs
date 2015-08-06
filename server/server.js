var Firebase = require('./firebase-node');

var cupDbRef = new Firebase('https://invido.firebaseio.com/cuperativa');

cupDbRef.on('value', function (data) {
    console.log('data in db ', data.val());
});

cupDbRef.on('child_changed', function (data) {
    console.log('changed to ', data.val());
});

//console.log('use db, set something');
//var currentDate = new Date();
//msg = 'Ora sono le ' + currentDate.getTime();
//cupDbRef.set({ info: msg }, function (success) {
//    console.log('update db info result:', success);
//});


console.log('CTRl-C per finire');
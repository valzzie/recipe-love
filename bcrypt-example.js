const bcrypt = require('bcrypt');
const salt1= bcrypt.genSaltSync(10);
//string to encrpt
const encryptedPass1= bcrypt.hashSync('swordfish', salt1);
console.log('swordfish -> ' + encryptedPass1);


//Once I type in node bcrypt-example.js it encrypts the password
// valzies-MacBook-Air:express-users valzie$ node bcrypt-example.js
// swordfish -> $2a$10$JTcxf4w2.F3JIK7zuC17ceYK1QuO.NqERcwEJnGVFUWm9LKrGpHrS

const salt2= bcrypt.genSaltSync(10);
//string to encrpt
const encryptedPass2= bcrypt.hashSync('blah', salt2);
console.log('blah -> ' + encryptedPass2);

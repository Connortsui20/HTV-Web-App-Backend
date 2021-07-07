//import cryptoRandomString from 'crypto-random-string';
// const cryptoRandomString = require('crypto-random-string');

function makeVoucherCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


module.exports = {

    lifecycles: {
        
        // Called before an entry is created
        beforeCreate(data) {
            if (!data.voucherCode) {
                // data.voucherCode = cryptoRandomString({length: 10, type: 'alphanumeric'});
                data.voucherCode = makeVoucherCode(30);
            }
        
        },

      },



};

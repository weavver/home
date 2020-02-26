openssl req -new > cert.csr
openssl rsa -in privkey.pem -out key.pem
openssl x509 -in cert.csr -out cert.pem -req -signkey key.pem -days 1001
cat key.pem>>cert.pem



# var openssl = require('openssl-wrapper');
# var password = 'github';

# return openssl.exec('genrsa', {des3: true, passout: 'pass:' + password, '2048': false}, function(err, buffer) {
#     console.log(buffer.toString());
# });
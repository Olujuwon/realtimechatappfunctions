let AES = require('crypto-js/aes');
let enc = require('crypto-js/enc-utf8');

const _handleEncryptData = ({data, secret}) => {
    return AES.encrypt(JSON.stringify(data), secret).toString();
}

const _handleDecryptData = ({cipherText, secret}) => {
    const bytes = AES.decrypt(cipherText, secret);
    return JSON.parse(bytes.toString(enc));
}

exports.encryptData = _handleEncryptData;
exports.decryptData = _handleDecryptData;
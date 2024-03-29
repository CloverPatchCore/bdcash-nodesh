var CoinKey = require('coinkey')
const CryptoJS = require('crypto-js')
const secp256k1 = require('secp256k1')

const bdcashInfo = {
    private: 0x97,
    public: 0x12,
    scripthash: 0x53
};

module.exports = {
    signWithKey: async function(key, message){
        return new Promise(response => {
            //CREATING CK OBJECT
            var ck = CoinKey.fromWif(key, bdcashInfo);
            //CREATE HASH FROM MESSAGE
            let hash = CryptoJS.SHA256(message);
            let msg = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex');
            //GETTING PUBKEY FROM PRIVATEKEY
            let privKey = ck.privateKey
            //SIGNING MESSAGE
            const sigObj = secp256k1.ecdsaSign(msg, privKey)
            const pubKey = secp256k1.publicKeyCreate(privKey)

            response({
                signature: Buffer.from(sigObj.signature).toString('hex'),
                pubkey: Buffer.from(pubKey).toString('hex'),
                address: ck.publicAddress
            })
        })
    },
    returnPubKey: async function(key){
        return new Promise(response => {
            //CREATING CK OBJECT
            var ck = CoinKey.fromWif(key, bdcashInfo);
            //GETTING PUBKEY FROM PRIVATEKEY
            let privKey = ck.privateKey
            const pubKey = secp256k1.publicKeyCreate(privKey)
            response(Buffer.from(pubKey).toString('hex'))
        })
    },
    returnAddress: async function(key){
        return new Promise(response => {
            //CREATING CK OBJECT
            var ck = CoinKey.fromWif(key, bdcashInfo);
            //GETTING ADDRESS
            response(ck.publicAddress)
        })
    },
    verifySign: async function(keyhex, sighex, message){
        return new Promise(response => {
            //CREATE HASH FROM MESSAGE
            let hash = CryptoJS.SHA256(message);
            let msg = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex')
            //VERIFY MESSAGE
            let signature = Buffer.from(sighex,'hex')
            let pubKey = Buffer.from(keyhex,'hex')
            verified = secp256k1.ecdsaVerify(signature, msg, pubKey)
            response(verified)
        })
    }
};
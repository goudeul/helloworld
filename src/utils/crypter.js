const Crypto = require('crypto-js')

module.exports = {

  encrypt(data, key) {
    return Crypto.AES.encrypt(data, key || process.env.crypter_key).toString();
  },

  decrypt(data, key) {
    return Crypto.AES.decrypt(data, key || process.env.crypter_key).toString(Crypto.enc.Utf8);
  },

  encrypt_user(user) {
    if (!user) return user
    if (user.name) user.name = this.encrypt(user.name)
    if (user.phone) user.phone = this.encrypt(user.phone)
    if (user.identityNumber) user.identityNumber = this.encrypt(user.identityNumber)
    return user
  },

  decrypt_user(user) {
    if (!user) return user
    if (user.name) user.name = this.decrypt(user.name)
    if (user.phone) user.phone = this.decrypt(user.phone)
    if (user.identityNumber) user.identityNumber = this.decrypt(user.identityNumber)
    return user
  }
}

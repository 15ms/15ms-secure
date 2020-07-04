const crypto = require('crypto');

function getTimestamp(maxage) {
  const value = Date.now();
  const stamp = Math.floor(value / maxage);
  return stamp;
}

function friendForURL(base64) {
  return base64
    .replace(/\+/g, '-')
    .replace(/=/g, '~')
    .replace(/\//g, '.');
}

class Secure {
  constructor(options = {}) {
    if (!options.secret) {
      throw new Error('secret required');
    }
    this.maxage = options.maxage || 30 * 1000;
    this.secret = options.secret;
  }

  verifyHMAC(data, hash) {
    if (!hash) return false;
    const hashNow = this.createHMAC(data);
    if (hash === hashNow) return true;
    const hashOld = this.createHMAC(data, -1);
    const hashNew = this.createHMAC(data, 1);
    return hash === hashOld || hash === hashNew;
  }

  createHMAC(data, move) {
    const body = JSON.stringify({
      data,
      time: getTimestamp(this.maxage) + (move || 0)
    });
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(body);
    const hash = friendForURL(hmac.digest('base64'));
    return hash;
  }
}

module.exports = Secure;

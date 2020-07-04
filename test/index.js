const assert = require('assert');
const Secure = require('../lib');

function createTimer(action, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (action) resolve(action());
    }, timeout);
  });
}

describe('15ms-secure', function () {
  this.timeout(5000);

  it('options.secret is null', () => {
    assert.throws(() => new Secure({}));
  });

  it('verify without sign', () => {
    const secure = new Secure({
      secret: 'a simple key',
      maxage: 1000
    });
    assert.equal(secure.verifyHMAC({}), false);
  });

  it('hash is url friendly', () => {
    const secure = new Secure({
      secret: 'a simple key',
      maxage: 1000
    });
    const data = 'test';
    const charset = /^[0-9a-zA-Z.\-~]+$/;
    assert.ok(charset.test(secure.createHMAC(data, 1)));
    assert.ok(charset.test(secure.createHMAC(data, 2)));
    assert.ok(charset.test(secure.createHMAC(data, 3)));
    assert.ok(charset.test(secure.createHMAC(data, 4)));
  });

  it('hash is time related, 1 min validity', () => {
    const secure = new Secure({
      secret: 'a simple key',
      maxage: 1000
    });
    const data = 'test';
    const hash0 = secure.createHMAC(data);
    const timer1 = createTimer(() => assert.ok(secure.verifyHMAC(data, hash0)), 0.5 * 1000);
    const timer2 = createTimer(() => assert.ok(!secure.verifyHMAC(data, hash0)), 3.5 * 1000);
    return Promise.all([timer1, timer2]);
  });
});

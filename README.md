# 15ms-secure

[![Build Status](https://travis-ci.com/15ms/15ms-secure.svg?branch=master)](https://travis-ci.com/15ms/15ms-secure)
[![Coverage Status](https://coveralls.io/repos/github/15ms/15ms-secure/badge.svg?branch=master)](https://coveralls.io/github/15ms/15ms-secure?branch=master)

The secure utility for 15ms server and client.

## Usage

```sh
npm install --save @15ms/secure
```

```javascript
const Secure = require('@15ms/secure');
const secure = new Secure({
  secret: 'your-15ms-server-secret',
  maxage: 30 * 1000
});

// create hash at client
const data = { 'your': 'data' };
const hash = secure.createHMAC(data);

// verify hash at server
const { data, hash } = request;
if (secure.verifyHMAC(data, hash)) {
  // do something
}
```

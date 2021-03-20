const assert = require('assert');
const path = require('path');

const Istring = require('../lib');

describe('istring test', function () {
  const API_KEY = '89561e53-daea-487a-abdf-c32c10298c11';
  const PLATFORM_PUBLIC_KEY =
    '-----BEGIN PUBLIC KEY-----\n11IBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiC2KuGa32HtXT5jTygqb/gyP+h2jN7XvbxoTt2IHZvNlv/Kycv2HFYnsgdLOu4tXjUcnFxqXEogMO6CLsWqlrIdRpaQYkr6mt1J8dcwK4sNX6WblFZGg+CDc+AOlkOccRZoCbJ+KzgNIMuDRiMFFqlG/bBolofHtjEwOSCZqjLOWKNK0Evd9QPFn2ub0ptUuZQyB/sNH4DGYgYdT/g2tbp5ZfPnFuD2BV2xJ7PathosJT2qQFbOkYbibnMaNoXYJvXjDPATsShOiG9uZtQa8UXDCtZM08+g4G1iJGTt4TzW7jv59a/kiCmogNKBZ/HzWfeWxJLlhry9FQi9EJZ+jZwIDAQAB\n-----END PUBLIC KEY-----\n';
  const CHAR_ENCODE_UTF_8 = 'utf8';

  const privatePath = path.join(__dirname, '../pem/istring_private.pem');
  const istring = new Istring({
    apiKey: API_KEY,
    platformPublicKey: PLATFORM_PUBLIC_KEY,
    charEncode: CHAR_ENCODE_UTF_8,
    privatePath,
  });

  it('create address test', async function () {
    const res = await istring.createAddress('ETH', 1);
    const { code, data } = res;
    assert.strictEqual(code, '20000', '状态码错误');
    assert.ok(data.length > 0, '返回数据错误');
  });
});

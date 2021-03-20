const assert = require('assert');

const util = require('../lib/util');

const PLATFORM_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiC2KuGa32HtXT5jTygqb/gyP+h2jN7XvbxoTt2IHZvNlv/Kycv2HFYnsgdLOu4tXjUcnFxqXEogMO6CLsWqlrIdRpaQYkr6mt1J8dcwK4sNX6WblFZGg+CDc+AOlkOccRZoCbJ+KzgNIMuDRiMFFqlG/bBolofHtjEwOSCZqjLOWKNK0Evd9QPFn2ub0ptUuZQyB/sNH4DGYgYdT/g2tbp5ZfPnFuD2BV2xJ7PathosJT2qQFbOkYbibnMaNoXYJvXjDPATsShOiG9uZtQa8UXDCtZM08+g4G1iJGTt4TzW7jv59a/kiCmogNKBZ/HzWfeWxJLlhry9FQi9EJZ+jZwIDAQAB\n-----END PUBLIC KEY-----\n';

describe('util test', function () {
  let randomStr = '';
  let key = '';
  it('aesEncryptByECBPKCS7Padding test', function () {
    const str = util.aesEncryptByECBPKCS7Padding(
      'this is a test message',
      'lYxQccpATUZBVaovll+BDw=='
    );

    assert.strictEqual(str, '16eByrRndPVCo6/OEYXDD8UhC2E4mf2/gg/9rLgeXnc=', 'aes加密结果错误');
  });

  it('getRandomBytes test', function () {
    randomStr = util.getRandomBytes(8);
    assert.strictEqual(randomStr.length, 8, '随机字符串长度错误');
  });

  it('generateAESKey test', function () {
    key = util.generateAESKey(randomStr);
    assert.strictEqual(key.length, 24, '随机字符串长度错误');
  });

  it('rsaEncrypt test', function () {
    const data = util.rsaEncrypt('tbDAddCtfDReZ7HdD2crQw==', PLATFORM_PUBLIC_KEY);
    assert.strictEqual(data.length, 344, '长度错误');
  });
});

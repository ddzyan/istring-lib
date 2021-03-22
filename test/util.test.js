const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('../lib/util');

const PLATFORM_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiC2KuGa32HtXT5jTygqb/gyP+h2jN7XvbxoTt2IHZvNlv/Kycv2HFYnsgdLOu4tXjUcnFxqXEogMO6CLsWqlrIdRpaQYkr6mt1J8dcwK4sNX6WblFZGg+CDc+AOlkOccRZoCbJ+KzgNIMuDRiMFFqlG/bBolofHtjEwOSCZqjLOWKNK0Evd9QPFn2ub0ptUuZQyB/sNH4DGYgYdT/g2tbp5ZfPnFuD2BV2xJ7PathosJT2qQFbOkYbibnMaNoXYJvXjDPATsShOiG9uZtQa8UXDCtZM08+g4G1iJGTt4TzW7jv59a/kiCmogNKBZ/HzWfeWxJLlhry9FQi9EJZ+jZwIDAQAB\n-----END PUBLIC KEY-----\n';

describe('util test', function () {
  let randomStr = '';
  let key = '';
  let aesSaltDecrypt;
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

  it('rsaDecrypt test', function () {
    const privatePath = path.join(__dirname, '../pem/istring_private.pem');
    const userPrivateKey = fs.readFileSync(privatePath);
    const data = util.rsaDecrypt(
      'CYAtrtK77z7qucHOVmsUWTA6fGvW1Cl0oDC7cKcGGOcRvssFOVnZ1qQeMyDxDLHZx0ZTvfxAVT07hgnWIHlE4QmC+MC9sCBFgCs1yhC/jfrNvgq2R5/KK9ZMVhBWAo6k4afY2vXTEYfQSYJcjVgjF7GvwY4KgaFMKtJU22R3QuUbANd8zTL6MVbnDYxnc1WkDjwTKELa0gp97fyEcGFaGAJUuNySW6JJYfbl2NsLtlkWiSm+OeGhlKDB55LGNJjXM0aoqrFkmWsJimZqKvQvMDkpaDkJSoVj+q61ZPJNcDYRTwJXZDz+2n8gQXG0ZS0VXC1/JmAUVvs3dmILdCu1Eg====',
      userPrivateKey
    );
    assert.strictEqual(data.length, 24, '长度错误');
  });

  it('rsaDecrypt test', function () {
    const privatePath = path.join(__dirname, '../pem/istring_private.pem');
    const userPrivateKey = fs.readFileSync(privatePath);
    const data = util.rsaDecrypt(
      'CYAtrtK77z7qucHOVmsUWTA6fGvW1Cl0oDC7cKcGGOcRvssFOVnZ1qQeMyDxDLHZx0ZTvfxAVT07hgnWIHlE4QmC+MC9sCBFgCs1yhC/jfrNvgq2R5/KK9ZMVhBWAo6k4afY2vXTEYfQSYJcjVgjF7GvwY4KgaFMKtJU22R3QuUbANd8zTL6MVbnDYxnc1WkDjwTKELa0gp97fyEcGFaGAJUuNySW6JJYfbl2NsLtlkWiSm+OeGhlKDB55LGNJjXM0aoqrFkmWsJimZqKvQvMDkpaDkJSoVj+q61ZPJNcDYRTwJXZDz+2n8gQXG0ZS0VXC1/JmAUVvs3dmILdCu1Eg====',
      userPrivateKey
    );
    aesSaltDecrypt = data;
    assert.strictEqual(data.length, 24, '长度错误');
  });

  it('aesDecryptByECBPKCS7Padding test', function () {
    const data = util.aesDecryptByECBPKCS7Padding(
      'ZMGB6qwZpW6VpLYQpzylj4Y7bW086k7e5wIFlha3al904YMe+N2i12bSgVwb2ZQE55yOvvcDHUmouiXB4R2YBga+PfXmkHpCoMjnS5hwhecfMpQRQRabocGoGVBXlPWa5j2BnJve7aa5VqbG8oL8E2uC0PHqNqWt6wEfWYvgSIFxlBlaYLjm9k2PwSw0RyRkdMt+rmC5f9x64tv1y9fheKkeZquPxjiMx8TZnN/Jdv7BwKOR+QNUKMhrI5zdFPZ3ahE/6at2ACaZkhFW/+tzqyAunoqgl6kzxvzMYq6C8hqao3YlnqHvwulpsn2yh76DOFuqAt4TWigyDOt8/j9FAa2tG7sfe7EeNIvKQ7JfM5zIWrLDuD5AYImM638fnvG8pgTAHynF2xmzM+EHqKfls+S83EVMWB8Z3r3cNBLe5iOt1ikfMQnIGTIXaB39QyeoCZVljVJPFxHyAkE+dBzftpD1C6EIsB1ZKX5kjtNhUOWo7fPbZMK9Q0CxEoUDkdmuWyVTVS5rTQ+v4rj3axf5hscRhqV6u7c4ndWMt/ELFsgwaoEZXm6FOZUqQdn6YMSy9ReHGzmce+wWuMv99keQ0QQVDtCTwRJ7cJ+MlxLUw7dQu70GeU0JXfRIYLrWzaUXVVD+Xr+8UqWLhz+lNTXVAQ==',
      aesSaltDecrypt
    );
    const requestObj = JSON.parse(data);
    assert.ok(requestObj.uniqTradeNo, 'uniqTradeNo 不存在');
    assert.ok(requestObj.outIndex, 'outIndex 不存在');
    assert.ok(requestObj.tradeNo, 'tradeNo 不存在');
    assert.ok(requestObj.tradeFee, 'tradeFee 不存在');
    assert.ok(requestObj.toAddress, 'toAddress 不存在');
    assert.ok(requestObj.tradeAmount, 'tradeAmount 不存在');
    assert.ok(requestObj.fromAddress, 'fromAddress 不存在');
    assert.ok(requestObj.toAddress, 'toAddress 不存在');
  });
});

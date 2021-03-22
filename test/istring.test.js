const assert = require('assert');
const path = require('path');

const Istring = require('../lib');

const requestParam = {
  salt:
    'CYAtrtK77z7qucHOVmsUWTA6fGvW1Cl0oDC7cKcGGOcRvssFOVnZ1qQeMyDxDLHZx0ZTvfxAVT07hgnWIHlE4QmC+MC9sCBFgCs1yhC/jfrNvgq2R5/KK9ZMVhBWAo6k4afY2vXTEYfQSYJcjVgjF7GvwY4KgaFMKtJU22R3QuUbANd8zTL6MVbnDYxnc1WkDjwTKELa0gp97fyEcGFaGAJUuNySW6JJYfbl2NsLtlkWiSm+OeGhlKDB55LGNJjXM0aoqrFkmWsJimZqKvQvMDkpaDkJSoVj+q61ZPJNcDYRTwJXZDz+2n8gQXG0ZS0VXC1/JmAUVvs3dmILdCu1Eg==',
  bizContent:
    'ZMGB6qwZpW6VpLYQpzylj4Y7bW086k7e5wIFlha3al904YMe+N2i12bSgVwb2ZQE55yOvvcDHUmouiXB4R2YBga+PfXmkHpCoMjnS5hwhecfMpQRQRabocGoGVBXlPWa5j2BnJve7aa5VqbG8oL8E2uC0PHqNqWt6wEfWYvgSIFxlBlaYLjm9k2PwSw0RyRkdMt+rmC5f9x64tv1y9fheKkeZquPxjiMx8TZnN/Jdv7BwKOR+QNUKMhrI5zdFPZ3ahE/6at2ACaZkhFW/+tzqyAunoqgl6kzxvzMYq6C8hqao3YlnqHvwulpsn2yh76DOFuqAt4TWigyDOt8/j9FAa2tG7sfe7EeNIvKQ7JfM5zIWrLDuD5AYImM638fnvG8pgTAHynF2xmzM+EHqKfls+S83EVMWB8Z3r3cNBLe5iOt1ikfMQnIGTIXaB39QyeoCZVljVJPFxHyAkE+dBzftpD1C6EIsB1ZKX5kjtNhUOWo7fPbZMK9Q0CxEoUDkdmuWyVTVS5rTQ+v4rj3axf5hscRhqV6u7c4ndWMt/ELFsgwaoEZXm6FOZUqQdn6YMSy9ReHGzmce+wWuMv99keQ0QQVDtCTwRJ7cJ+MlxLUw7dQu70GeU0JXfRIYLrWzaUXVVD+Xr+8UqWLhz+lNTXVAQ==',
  sign:
    'P6GRMIyGWj/UxYwDMzbSWhSVI6xCv5V0yYV59Qvux6WXmzlKfmRGA65yDc3w0EfGEtRwdN6Q0r4G2A1/xhjgfXBfadI/7amTqBrGbSZ5jmHEKMSEpUB/TZyLb8xndD2DxvfKUMS4ylnMzMULIBZNeFnd5bEdwFQfF+pxy0F1E0At5D9RCdJlbA/oQl1vB2Je941sAsiQ7OSL2iSvSve4kxo1rLDULKy/3d4tzjHIkMnKxlaahkPKGNi7nk6+D2I7oyngaVa33Y13vUdiXLb91+H67AtFgcyjHUatJw76jrLovGBPytHlaym3uxRRLT0Q7cVyP5CuiPf11p4FYXUJcA==',
};

describe('istring test', function () {
  const API_KEY = '89561e53-daea-487a-abdf-c32c10298c12';
  const PLATFORM_PUBLIC_KEY =
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiC2KuGa32HtXT5jTygqb/gyP+h2jN7XvbxoTt2IHZvNlv/Kycv2HFYnsgdLOu4tXjUcnFxqXEogMO6CLsWqlrIdRpaQYkr6mt1J8dcwK4sNX6WblFZGg+CDc+AOlkOccRZoCbJ+KzgNIMuDRiMFFqlG/bBolofHtjEwOSCZqjLOWKNK0Evd9QPFn2ub0ptUuZQyB/sNH4DGYgYdT/g2tbp5ZfPnFuD2BV2xJ7PathosJT2qQFbOkYbibnMaNoXYJvXjDPATsShOiG9uZtQa8UXDCtZM08+g4G1iJGTt4TzW7jv59a/kiCmogNKBZ/HzWfeWxJLlhry9FQi9EJZ+jZwIDAQAB\n-----END PUBLIC KEY-----\n';
  const CHAR_ENCODE_UTF_8 = 'utf8';

  const privatePath = path.join(__dirname, '../pem/istring_private.pem');
  const istring = new Istring({
    apiKey: API_KEY,
    platformPublicKey: PLATFORM_PUBLIC_KEY,
    charEncode: CHAR_ENCODE_UTF_8,
    privatePath,
  });

  it('create address test', async function () {
    const res = await istring.createAddress('TRX', 1);
    const { code, data, errMsg } = res;
    assert.strictEqual(code, '20000', errMsg);
    assert.ok(data.length > 0, '返回数据错误');
  });

  it('getRequestParam test', async function () {
    const res = await istring.getRequestParam(requestParam);
    console.log(res);
    assert.ok(res, '解密失败');
  });
});

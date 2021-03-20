## 简介

Istring Nodejs Lib

详情请访问官方网站https://www.istring.com

使用方案请参参考 test 文件案例

### 资料

- [转账接口支持的 coinName](https://istring.com/api-doc/api/transfer.token.html)
- [创建和查询地址 coinName 对照表](https://istring.com/api-doc/api/query.token.html)

### 使用

API_KEY （长度为 18）和 PLATFORM_PUBLIC_KEY 由平台提供

istring_private.pem 为本地私钥地址

```shell
npm i --save istring-lib
```

```js
const Istring = require('istring-lib');

const API_KEY = 'XXXXXXXXXXXXXXXXXX';
const PLATFORM_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nXXXXXXXXXXXX\n-----END PUBLIC KEY-----\n';
const CHAR_ENCODE_UTF_8 = 'utf8';

const privatePath = path.join(__dirname, '../pem/istring_private.pem');

const main = async function () {
  const istring = new Istring({
    apiKey: API_KEY,
    platformPublicKey: PLATFORM_PUBLIC_KEY,
    charEncode: CHAR_ENCODE_UTF_8,
    privatePath,
  });
  // 创建地址
  const res = await istring.createAddress('ETH', 1);
};

main();
```

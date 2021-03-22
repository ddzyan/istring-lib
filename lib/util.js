const crypto = require('crypto');
const getRandomBytes = require('./getRandomBytes');
const NodeRSA = require('node-rsa');

const algorithm = 'aes-192-ecb'; //算法
const clearEncoding = 'utf8'; //字符串编码
const cipherEncoding = 'base64';

const aesEncryptByECBPKCS7Padding = function (content, aesKey, iv = '') {
  const cipherChunks = [];
  const cipher = crypto.createCipheriv(algorithm, aesKey, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(content, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join('');
};

/**
 * @description 随机生成key 再转换为 16进制字符串类型
 * @param {string} 加密的原文
 * @returns {string} base64 编码字符串
 */
const generateAESKey = function (str) {
  const keyBinary = Buffer.from(str, 'binary');
  const keyHax = keyBinary.toString('hex');
  return Buffer.from(keyHax).toString('base64');
};

/**
 *
 * @param {string} publicKey 公钥
 * @returns {string}
 */
const mungeIstringKey = function (publicKey) {
  /*  let offset = 0;
  while (publicKey.length - offset > 64) {
    msg += publicKey.slice(offset, offset + 64) + '\n';
    offset += 64;
  } */
  let msg = '-----BEGIN PUBLIC KEY-----\n';
  msg += publicKey + '\n';
  msg += '-----END PUBLIC KEY-----\n';
  return msg;
};

const rsaEncrypt = function (content, publicKey, charset) {
  const publicKeyObj = crypto.createPublicKey(publicKey);
  const buf = Buffer.from(content, 'utf8');
  const encryptOptions = {
    key: publicKeyObj,
    padding: crypto.constants.RSA_PKCS1_PADDING,
    encoding: 'utf8',
  };

  const base64Str = crypto.publicEncrypt(encryptOptions, buf).toString('base64');
  return base64Str;

  /* const buf = Buffer.from(content, 'utf8');
  const inputLen = buf.byteLength;

  //开始长度
  let offSet = 0;
  //结束长度
  let endOffSet = MAX_ENCRYPT_BLOCK;

  while (inputLen - offSet > 0) {
    if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
      const bufTmp = buf.slice(offSet, endOffSet);
      console.log('切割后 if', bufTmp.toString('utf-8'));
      bufs.push(crypto.publicEncrypt(encryptOptions, bufTmp));
    } else {
      const bufTmp = buf.slice(offSet, inputLen);
      console.log('切割后 else', bufTmp.toString('utf-8'));
      bufs.push(crypto.publicEncrypt(encryptOptions, bufTmp));
    }
    offSet += MAX_ENCRYPT_BLOCK;
    endOffSet += MAX_ENCRYPT_BLOCK;
  }
  const result = Buffer.concat(bufs);

  const base64Str = result.toString('base64'); */
};

const sortSignContent = function (sortedParams) {
  let content = '';
  let keys = Object.keys(sortedParams);
  keys.sort();
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (i === 0) {
      content += key + '=' + sortedParams[key];
    } else {
      content += '&' + key + '=' + sortedParams[key];
    }
  }

  return content.toString();
};

const sha256Base64 = function (data) {
  const hash = crypto.createHash('sha256');
  const str = hash.update(data).digest('base64');
  return str;
};

const rsaSign = function (content, privateKey, charset) {
  const a_private_key = new NodeRSA(privateKey);
  const sign = a_private_key.sign(content, 'base64', charset);
  return sign;
};

const rsaDecrypt = function (salt, privateKey) {
  const privateKeyObj = crypto.createPrivateKey(privateKey);
  const options = {
    key: privateKeyObj,
    padding: crypto.constants.RSA_PKCS1_PADDING,
    encoding: 'utf8',
  };

  const decodeData = crypto.privateDecrypt(options, Buffer.from(salt.toString('base64'), 'base64'));

  return decodeData.toString('utf8');
};

const aesDecryptByECBPKCS7Padding = function (bizContent, aesSaltDecrypt, iv = '') {
  const cipherChunks = [];
  const decipher = crypto.createDecipheriv(algorithm, aesSaltDecrypt, iv);
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(bizContent, cipherEncoding, clearEncoding));
  cipherChunks.push(decipher.final(clearEncoding));
  return cipherChunks.join('');
};

module.exports = {
  aesEncryptByECBPKCS7Padding,
  generateAESKey,
  mungeIstringKey,
  getRandomBytes,
  rsaEncrypt,
  sortSignContent,
  sha256Base64,
  rsaSign,
  rsaDecrypt,
  aesDecryptByECBPKCS7Padding,
};

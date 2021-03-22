const assert = require('assert');
const fs = require('fs');
const axios = require('axios');

const util = require('./util');
const { URL_ENUM } = require('./enum');

const DEFAULT_URL = 'https://gateway.istring.com/istring-openapi/p/api/gateway.do';
class Istring {
  /**
   *
   * @param {string} apiKey 密码
   * @param {string} platformPublicKey 平台公钥
   * @param {string} charEncode 编码格式
   * @param {string} privatePath 本地私钥地址
   */
  constructor({ apiKey, platformPublicKey, charEncode, privatePath, url = DEFAULT_URL }) {
    assert(apiKey, 'apiKey is required');
    assert(platformPublicKey, 'platformPublicKey is required');
    assert(charEncode, 'charEncode is required');
    assert(privatePath, 'privatePath is required');
    this.apiKey = apiKey;
    this.platformPublicKey = platformPublicKey;
    this.charEncode = charEncode;
    this.url = url;

    const res = fs.existsSync(privatePath);
    if (!res) {
      throw new Error('private path does not exist');
    }

    this.privatePath = privatePath;
  }

  /**
   *
   * @param {string} coinName 币种
   * @param {number} count 数量
   * @returns {Promise<Object>}
   */
  async createAddress(coinName, count) {
    assert(coinName, 'coinName is required');
    assert(count, 'count is required');
    const timestamp = this._getTimestamp();
    const commonParam = {
      apiKey: this.apiKey,
      method: URL_ENUM.CREATE_ADDRESS,
      version: '1.0',
      timestamp,
    };

    const requestParam = {
      coinName,
      count,
    };

    const encryptionRequestParam = this._encryption(commonParam, requestParam);
    const data = await this._sendRequest(encryptionRequestParam, 'post');
    return data;
  }

  getRequestParam(params) {
    const { salt, bizContent } = params;
    const userPrivateKey = fs.readFileSync(this.privatePath);

    const aesSaltDecrypt = util.rsaDecrypt(salt, userPrivateKey);

    const requestData = util.aesDecryptByECBPKCS7Padding(bizContent, aesSaltDecrypt);
    const requestObj = JSON.parse(requestData);
    return requestObj;
  }

  /**
   * @description 转账/收款回调确认
   * @param {string} tradeNo 弦冰清算唯一标识
   * @param {string} uniqTradeNo transfer api调用时传入的业务唯一标识
   * @returns {Promise<Object>}
   */
  async transferConfirm(tradeNo, uniqTradeNo) {
    assert(tradeNo, 'tradeNo is required');
    assert(uniqTradeNo, 'uniqTradeNo is required');
    const timestamp = this._getTimestamp();
    const commonParam = {
      apiKey: this.apiKey,
      method: URL_ENUM.TRANSFER_CONFIRM,
      version: '1.0',
      timestamp,
    };

    const requestParam = {
      tradeNo,
      uniqTradeNo,
    };

    const encryptionRequestParam = this._encryption(commonParam, requestParam);
    const data = await this._sendRequest(encryptionRequestParam, 'post');
    return data;
  }

  /**
   *
   * @returns {string} 时间戳
   */
  _getTimestamp() {
    return new Date().valueOf();
  }

  /**
   * @description 加密请求
   * @param {object} commonParam 公用部分
   * @param {object} requestParam 请求参数
   * @returns {object}
   */
  _encryption(commonParam, requestParam) {
    const { platformPublicKey, charEncode, privatePath } = this;
    const jsonParam = JSON.stringify(requestParam);
    const randomStr = util.getRandomBytes(8);
    const aesSalt = util.generateAESKey(randomStr);
    const aesEncryptResult = util.aesEncryptByECBPKCS7Padding(jsonParam, aesSalt);
    Object.assign(commonParam, {
      bizContent: aesEncryptResult,
    });

    const rsaEncryptResult = util.rsaEncrypt(aesSalt, platformPublicKey, charEncode);
    Object.assign(commonParam, {
      salt: rsaEncryptResult,
    });
    const signContent = util.sortSignContent(commonParam);
    const sha256SignContent = util.sha256Base64(signContent);
    const userPrivateKey = fs.readFileSync(privatePath);
    const rsaSign = util.rsaSign(sha256SignContent, userPrivateKey, charEncode);

    Object.assign(commonParam, {
      sign: rsaSign,
    });

    return commonParam;
  }

  /**
   * @description 发送请求
   * @param {Object} requestParam 请求参数
   * @param {string} method 请求方法
   * @returns {Promise<Object>}
   */
  async _sendRequest(requestParam, method) {
    const { status, data } = await axios({
      method,
      url: this.url,
      data: requestParam,
      headers: { 'Content-Type': 'application/json' },
    });

    if (status !== 200) {
      throw new Error('状态码错误');
    }

    return data;
  }
}

module.exports = Istring;

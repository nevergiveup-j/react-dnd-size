import parseDate from './parseDate';
import * as utils from './utils';

const cacheStore = {};

/**
 * @class Store
 * 存储层，将单页数据保存于localStorage中
 * @param {String} name   名字
 * @param {String} expire 设置失效时间
 * @param {String} prefix 前缀名字
 * @param {String} typeStore 类型 local|session
 */
class Store {
  constructor(name, expire = '7d', prefix, typeStore = 'local') {
    this.prefix = prefix || 'NG_';
    this.name = `${this.prefix}_${name}`;
    this.expire = parseDate(expire);

    const isSupported = !!window[`${typeStore}Storage`];

    this.store = isSupported ? window[`${typeStore}Storage`] : cacheStore;

    // 清除失效时间
    this.clearExpireTime();
  }
  /**
   * 获取数据
   * @params {Object}  参数数据
   * @return {Boolean} 返回数据
   */
  has(params = {}) {
    let data = this.store[this.name];

    // 解析data
    if (data && data.length) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = {};
      }
    }

    if (data && data.expire) {
      if (utils.timeNow() < data.expire && utils.isEqual(params, data.params)) {
        return true;
      }
    }

    return false;
  }
  /**
   * 获取数据
   * @return {Object}  返回数据
   * {
   *    expire: 14000002000, //过期毫秒数
   *    value:  [data]       //本地存储的数据
   * }
   */
  get() {
    let data = this.store[this.name] || '{}';
    data = JSON.parse(data);

    if (!data.expire || utils.timeNow() >= data.expire) {
      return {};
    }

    return data.value;
  }
  /**
   * 设置存储
   * @param {Object|Array|String|Number} value 值
   * @param {Object} params 参数
   */
  set(value, params = {}) {
    if (this.expire === 0) return false;
    const data = {
      expire: (utils.timeNow() + this.expire),
      value,
      params,
    };

    this.store[this.name] = JSON.stringify(data);

    return true;
  }
  // 删除数据
  delete() {
    delete this.store[this.name];
  }
  // 清除失效时间
  clearExpireTime() {
    Object.keys(this.store).map((key) => {
      try {
        const data = JSON.parse(this.store[key]);

        if (data.expire && utils.timeNow() >= data.expire) {
          delete this.store[key];
        }
      } catch (e) {
        console.log(e);
      }
      return key;
    });
  }
  // 清除当前store数据
  clear() {
    const re = new RegExp(`${this.prefix}`);

    Object.keys(this.store).map((key) => {
      if (re.test(key)) {
        delete this.store[key];
      }
      return key;
    });
  }
  // 清除全部store
  clearAll() {
    Object.keys(this.store).map((key) => {
      delete this.store[key];
      return key;
    });
  }
}

export default Store;
/**
 * 自定义代理对象
 * @param {Object} obj 需要代理的对象
 * @param {String} target 被代理到的目标对象
 */
export function defineProxy(obj, target, key) {
  Object.defineProperty(obj, key, {
    get() {
      return obj[target][key];
    },

    set(val) {
      obj[target][key] = val;
    },
  });
}

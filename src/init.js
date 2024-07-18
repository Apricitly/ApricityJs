import { URL } from "url";
import { handleGetUrl, handlePostUrl } from "./parse/handle.js";
import { generateOptions } from "./parse/generation.js";
import { sendGetHttp, sendPostHttp } from "./http/index.js";
import { defineProxy } from "./proxy/index.js";

/**
 *初始化Apricity
 * @param {Function} Apricity
 */
export function initMixin(Apricity) {
  if (!Apricity) return;

  /**
   * 通用函数
   */
  function _genericFun(method, url, data, config, params, Apricity) {
    if (method === "get") {
      const fixedUrl = handleGetUrl(url, data.params, Apricity);
      const handledUrl = new URL(fixedUrl);
      return generateOptions(handledUrl, method, data.config, Apricity);
    } else if (method === "post") {
      const fixedUrl = handlePostUrl(url, Apricity);
      const handleUrl = new URL(fixedUrl);
      return generateOptions(handleUrl, method, { config, params }, Apricity);
    }
  }

  Apricity.prototype.get = function (url, data, beforeRequest, afterRequest) {
    const options = _genericFun("get", url, data, null, null, this);

    return new Promise((resolve, reject) => {
      sendGetHttp(options, resolve, reject, beforeRequest, afterRequest, this);
    });
  };

  Apricity.prototype.post = function (
    url,
    config,
    params,
    beforeRequest,
    afterRequest
  ) {
    const options = _genericFun("post", url, null, config, params, this);
    return new Promise((resolve, reject) => {
      sendPostHttp(
        options,
        resolve,
        reject,
        beforeRequest,
        afterRequest,
        params,
        this
      );
    });
  };

  Apricity.prototype._init = function (config) {
    Object.defineProperty(this, "config", {
      value: config,
      writable: true,
      enumerable: false,
      configurable: true,
    });

    const proxyConfig = this.config;
    for (const key in proxyConfig) defineProxy(this, "config", key);
  };
}

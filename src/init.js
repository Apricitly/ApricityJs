import { URL } from "url";
import { handleGetUrl, handlePostUrl } from "./parse/handle.js";
import { generateOptions } from "./parse/generation.js";
import { sendGetHttp, sendPostHttp } from "./http/index.js";
import { defineProxy } from "./proxy/index.js";

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

function beforeRequestConfig(config, fun) {
  if (fun && typeof fun === "function") {
    if (config) {
      fun(config);
    } else {
      fun();
    }
  }
}

/**
 *初始化Apricity
 * @param {Function} Apricity
 */
export function initMixin(Apricity) {
  if (!Apricity) return;

  /**
   * 通用函数
   */

  Apricity.prototype.get = function (url, data, beforeRequest, afterRequest) {
    beforeRequestConfig(this.config, beforeRequest);

    const options = _genericFun("get", url, data, null, null, this);
    return new Promise((resolve, reject) => {
      sendGetHttp(options, resolve, reject, afterRequest, this);
    });
  };

  Apricity.prototype.post = function (
    url,
    config,
    params,
    beforeRequest,
    afterRequest
  ) {
    beforeRequestConfig(this.config, beforeRequest);
    const options = _genericFun("post", url, null, config, params, this);

    console.log(options);
    return new Promise((resolve, reject) => {
      sendPostHttp(options, resolve, reject, afterRequest, params, this);
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

import { URL } from "url";
import { handleGetUrl, handlePostUrl } from "./parse/handle.js";
import { generateOptions } from "./parse/generation.js";
import { sendGetHttp, sendPostHttp } from "./http/index.js";
import { defineProxy } from "./proxy/index.js";

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

function beforeRequestConfig(fun, config, params) {
  if (!fun && typeof fun !== "function") {
    return;
  }

  if (config) {
    fun(config, params);
  } else {
    fun(params);
  }
}

/**
 *初始化Apricity
 * @param {Function} Apricity
 */
export function initMixin(Apricity) {
  if (!Apricity) return;

  Apricity.prototype.get = function (url, data, beforeRequest, afterRequest) {
    beforeRequestConfig(beforeRequest, this.config, data);

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
    beforeRequestConfig(beforeRequest, this.config, { config, params });

    const options = _genericFun("post", url, null, config, params, this);
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

  Apricity.prototype.custom = function () {
    const _this = this;
    function getKV(config) {
      let data;
      let beforeRequest;
      let afterRequest;
      let configs;
      let params;

      for (const key in config) {
        switch (key) {
          case "data":
            data = config.data;
            break;
          case "beforeRequest":
            beforeRequest = config.beforeRequest;
            break;
          case "afterRequest":
            afterRequest = config.afterRequest;
            break;
          case "configs":
            configs = config.configs;
            break;
          case "params":
            params = config.params;
            break;
          default:
            break;
        }
      }

      return { data, beforeRequest, afterRequest, configs, params };
    }

    return function (config) {
      const { method, url } = config;
      if (!method || !url) throw new Error(`method or url is allowed`);

      if (method === "get") {
        const { data, beforeRequest, afterRequest, configs } = getKV(config);
        return _this.get(
          url,
          { params: data, config: configs },
          beforeRequest,
          afterRequest
        );
      }

      if (method === "post") {
        const { beforeRequest, afterRequest, configs, params } = getKV(config);

        return this.post(url, configs, params, beforeRequest, afterRequest);
      }
    };
  };
}

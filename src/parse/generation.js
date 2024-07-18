import { Buffer } from "buffer";

/**
 *生成请求参数
 * @param {object} handledUrl
 * @param {string} method
 * @returns
 */
export function generateOptions(handledUrl, method, data, Apricity) {
  if (method === "get") {
    const { headers = null } = Apricity.config || {};
    if (headers === null && !data) {
      return {
        hostname: handledUrl.hostname,
        port: handledUrl.port,
        path: handledUrl.pathname + handledUrl.search,
        method: method,
      };
    }
    let optionsHeaders;

    if (data && data.headers) {
      optionsHeaders =
        headers != null ? { ...headers, ...data.headers } : data.headers;
    } else {
      optionsHeaders = headers != null ? { ...headers } : {};
    }

    return {
      hostname: handledUrl.hostname,
      port: handledUrl.port,
      path: handledUrl.pathname + handledUrl.search,
      method: method,
      headers: optionsHeaders,
    };
  } else if (method === "post") {
    let header = {};

    for (const key in data) {
      if (key === "config") {
        const { headers = null } = Apricity.config || {};
        if (headers === null && !data[key]) {
          return {
            hostname: handledUrl.hostname,
            port: handledUrl.port,
            path: handledUrl.pathname,
            method: method,
          };
        }

        if (data[key] && data[key]["headers"]) {
          header =
            headers != null
              ? { ...headers, ...data[key]["headers"] }
              : data[key]["headers"];
        } else {
          header = headers != null ? { ...headers } : {};
        }
      } else if (key === "params") {
        Object.defineProperties(header, {
          "Content-Length": {
            value: Buffer.byteLength(JSON.stringify(data[key])),
            writable: true,
            configurable: true,
          },
        });
      }
    }

    return {
      hostname: handledUrl.hostname,
      port: handledUrl.port,
      path: handledUrl.pathname,
      method: method,
      headers: header,
    };
  }
}

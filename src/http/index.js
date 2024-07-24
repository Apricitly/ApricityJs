import http from "http";
import { parseData } from "../parse/parseData.js";

export function sendGetHttp(options, resolve, reject, afterRequest, Apricity) {
  const _fun = Apricity;

  const req = http.request(options, (res) => {
    let resquest;

    res.on("data", (chunk) => {
      resquest = chunk;
    });

    res.on("end", () => {
      try {
        resolve(parseData(resquest));
      } catch (error) {
        reject(error);
      }
    });
  });

  if (_fun.config && _fun.config.timeout) {
    let timeoutId = setTimeout(() => {
      req.abort();
      clearTimeout(timeoutId);
      reject(new Error("Request timeout"));
    }, Apricity.config.timeout);
  }
  req.on("error", (error) => reject(error));
  req.end();

  if (afterRequest && typeof afterRequest === "function") afterRequest();
}

export function sendPostHttp(
  options,
  resolve,
  reject,
  afterRequest,
  params,
  Apricity
) {
  const _fun = Apricity;

  const req = http.request(options, (res) => {
    let resquest;

    res.on("data", (chunk) => {
      resquest = chunk;
    });

    res.on("end", () => {
      try {
        resolve(parseData(resquest));
      } catch (error) {
        reject(error);
      }
    });
  });

  req.write(JSON.stringify(params));

  if (_fun.config && _fun.config.timeout) {
    let timeoutId = setTimeout(() => {
      req.abort();
      clearTimeout(timeoutId);
      reject(new Error("Request timeout"));
    }, _fun.config.timeout);
  }

  req.on("error", (error) => reject(error));
  req.end();

  if (afterRequest && typeof afterRequest === "function") afterRequest();
}

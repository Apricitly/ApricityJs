import http from "http";
import { parseData } from "../parse/parseData.js";

const result = {
  code: 0,
  data: null,
  methods: "",
  message: "",
  url: "",
  isTimeOut: null,
  isCancel: null,
  isRedirect: null,
};

function sendSuccessResult(request, options, res) {
  result.code = 200;
  result.data = parseData(request);
  result.methods = options.method;
  result.message = res.statusMessage;
  result.url = options.url;
  result.isTimeOut = false;
  result.isCancel = false;
  result.isRedirect = res.statusCode >= 300 && res.statusCode < 400;

  return result;
}

function sendErrorResult(error, options) {
  result.code = 500;
  result.data = null;
  result.methods = options.method;
  result.message = error.message;
  result.url = options.url;
  result.isTimeOut = error.code === "ETIMEDOUT";
  result.isCancel = error.code === "ECONNABORTED";
  result.isRedirect = false;

  return result;
}

export function sendGetHttp(options, resolve, reject, afterRequest, Apricity) {
  const _fun = Apricity;

  const req = http.request(options, (res) => {
    let request;

    res.on("data", (chunk) => {
      request = chunk;
    });

    res.on("end", () => {
      try {
        const resultSuccess = sendSuccessResult(request, options, res);
        resolve(resultSuccess);
      } catch (error) {
        const resultError = sendErrorResult(error, options);

        reject(resultError);
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
  req.on("error", (error) => {
    const resultError = sendErrorResult(error, options);
    reject(resultError);
  });

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
    let request;

    res.on("data", (chunk) => {
      request = chunk;
    });

    res.on("end", () => {
      try {
        const resultSuccess = sendSuccessResult(request, options, res);
        resolve(resultSuccess);
      } catch (error) {
        const resultError = sendErrorResult(error, options);

        reject(resultError);
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

  req.on("error", (error) => {
    const resultError = sendErrorResult(error, options);

    reject(resultError);
  });

  req.end();

  if (afterRequest && typeof afterRequest === "function") afterRequest();
}

import http from "http";
import { parseData } from "../parse/parseData.js";

export function sendGetHttp(
  options,
  resolve,
  reject,
  beforeRequest,
  afterRequest,
  Apricity
) {
  if (Apricity.config && Apricity.config.headerBeforeRequest)
    Apricity.config.headerBeforeRequest();
  if (beforeRequest && typeof beforeRequest === "function") beforeRequest();

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

  if (Apricity.config && Apricity.config.timeout) {
    let timeoutId = setTimeout(() => {
      req.abort();
      clearTimeout(timeoutId);
      reject(new Error("Request timeout"));
    }, Apricity.config.timeout);
  }
  req.on("error", (error) => reject(error));
  req.end();

  if (Apricity.config && Apricity.config.headerAfterRequest)
    Apricity.config.headerAfterRequest();
  if (afterRequest && typeof afterRequest === "function") afterRequest();
}

export function sendPostHttp(
  options,
  resolve,
  reject,
  beforeRequest,
  afterRequest,
  params,
  Apricity
) {
  if (Apricity.config && Apricity.config.headerBeforeRequest)
    Apricity.config.headerBeforeRequest();
  if (beforeRequest && typeof beforeRequest === "function") beforeRequest();

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

  if (Apricity.config && Apricity.config.timeout) {
    let timeoutId = setTimeout(() => {
      req.abort();
      clearTimeout(timeoutId);
      reject(new Error("Request timeout"));
    }, Apricity.config.timeout);
  }

  req.on("error", (error) => reject(error));
  req.end();

  if (Apricity.config && Apricity.config.headerAfterRequest)
    Apricity.config.headerAfterRequest();
  if (afterRequest && typeof afterRequest === "function") afterRequest();
}

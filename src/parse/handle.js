/**
 * 生成get请求url
 * @param {string} url
 * @param {string} methods
 * @param {object} data
 * @returns
 */
export function handleGetUrl(url, data, Apricity) {
  //生成url前的判断
  if (typeof url != "string") throw new Error("Url has musted be String");
  const { baseUrl = null } = Apricity.config || {};
  let __stagingUrl;

  baseUrl != null ? (__stagingUrl = baseUrl + url) : (__stagingUrl = url);

  if (typeof data !== "object") return __stagingUrl;

  const keyArr = Object.keys(data);
  if (keyArr.length === 1) {
    __stagingUrl = __stagingUrl + "?" + keyArr[0] + "=" + data[keyArr[0]];
  } else {
    for (let index in keyArr) {
      if (index === "0")
        __stagingUrl =
          __stagingUrl + "?" + keyArr[index] + "=" + data[keyArr[index]];
      else
        __stagingUrl =
          __stagingUrl + "&" + keyArr[index] + "=" + data[keyArr[index]];
    }
  }

  return __stagingUrl;
}

/**
 * 生成post请求url
 * @param {string} url
 * @returns
 */
export function handlePostUrl(url, Apricity) {
  if (typeof url != "string") throw new Error("Url has musted be String");

  const { baseUrl = null } = Apricity.config || {};
  let __stagingUrl;

  __stagingUrl = baseUrl != null ? baseUrl + url : url;

  return __stagingUrl;
}

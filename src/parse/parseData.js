const decode = new TextDecoder();

/**
 * 处理二进制数据
 * @param {ArrayBuffer} chunk
 */
export function parseData(chunk) {
  const stringData = decode.decode(chunk);
  if (stringData.startsWith("{") || stringData.startsWith("["))
    return JSON.parse(stringData);
  else return stringData;
}

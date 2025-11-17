const baseUrl =
  'https://webgw.antgroup-inc.cn/180020010101329077/infographicservice/api/v1';
export async function getAsset(type: string, id: string) {
  const input = `${baseUrl}/assets?type=${type}&id=${id}`;

  const response = await fetch(input);
  const data = await response.arrayBuffer();
  const result = decodeAssetByByteOffset(data);
  return result;
}

function decodeAssetByByteOffset(data: ArrayBuffer): string {
  if (!data || data.byteLength <= 1) {
    throw new Error('Invalid input: ArrayBuffer too small or empty');
  }
  const dataArray = new Uint8Array(data);
  const offsetLength = 1;
  const offsetValue = dataArray[0];
  const decryptedArray = new Uint8Array(dataArray.byteLength - offsetLength);
  for (let i = 0; i < decryptedArray.byteLength; i++) {
    decryptedArray[i] = (dataArray[i + offsetLength] - offsetValue + 256) % 256;
  }
  return new TextDecoder().decode(decryptedArray);
}

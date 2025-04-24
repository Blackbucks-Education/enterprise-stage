import { deflate, unzip } from 'node:zlib';
import { promisify } from 'util';

const promisifiedDeflate = promisify(deflate);
const promisifiedUnzip = promisify(unzip);

const compressData = async (data) => {
  try {
    const buffer = Buffer.from(JSON.stringify(data));
    const uint8Array = new Uint8Array(buffer); // Convert Buffer to Uint8Array
    const compressedBuffer = await promisifiedDeflate(uint8Array);
    return compressedBuffer.toString('base64');
  } catch (error) {
    throw new Error(`Compression error: ${error.message}`);
  }
};

const decompressData = async (compressedData) => {
  try {
    const buffer = Buffer.from(compressedData, 'base64');
    const uint8Array = new Uint8Array(buffer);
    const decompressedBuffer = await promisifiedUnzip(uint8Array);
    const decompressedString = decompressedBuffer.toString();
    return JSON.parse(decompressedString);
  } catch (error) {
    throw new Error(`Decompression error: ${error.message}`);
  }
};

export { compressData, decompressData };

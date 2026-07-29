import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export interface EncryptedData {
  iv: string;
  tag: string;
  content: string;
}

/**
 * Encrypts a string using AES-256-GCM.
 * @param text The plaintext string to encrypt.
 * @param secretKey The 32-byte hex or base64 key string.
 */
export function encrypt(text: string, secretKey: string): EncryptedData {
  // Ensure the key is exactly 32 bytes (256 bits)
  const keyBuffer = Buffer.from(secretKey, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('Encryption key must be 32 bytes.');
  }

  const iv = randomBytes(12); // GCM standard IV size is 12 bytes
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    content: encrypted,
  };
}

/**
 * Decrypts data that was encrypted using AES-256-GCM.
 * @param encryptedData The object containing iv, tag, and content.
 * @param secretKey The 32-byte hex or base64 key string.
 */
export function decrypt(encryptedData: EncryptedData, secretKey: string): string {
  const keyBuffer = Buffer.from(secretKey, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('Encryption key must be 32 bytes.');
  }

  const ivBuffer = Buffer.from(encryptedData.iv, 'hex');
  const tagBuffer = Buffer.from(encryptedData.tag, 'hex');

  const decipher = createDecipheriv(ALGORITHM, keyBuffer, ivBuffer);
  decipher.setAuthTag(tagBuffer);

  let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generates a random 32-byte key as a hex string.
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Serialize to string format iv:tag:content
 */
export function serializeEncryptedData(data: EncryptedData): string {
  return `${data.iv}:${data.tag}:${data.content}`;
}

/**
 * Deserialize from string format iv:tag:content
 */
export function deserializeEncryptedData(str: string): EncryptedData {
  const [iv, tag, content] = str.split(':');
  if (!iv || !tag || !content) {
    throw new Error('Invalid encrypted data format');
  }
  return { iv, tag, content };
}

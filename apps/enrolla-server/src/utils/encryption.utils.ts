import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { env } from 'process';

const ENCRYPTION_ALGORITHM = 'aes-256-ctr';
const ENCRYPTION_KEY = env.SECRET_ENCRYPTION_KEY;
const CONSTANT_IV_LENGTH = 16;
const CONSTANT_IV = Buffer.alloc(CONSTANT_IV_LENGTH, 0);

export async function encrypt(value: string, ivLength?: number) {
  const iv = ivLength ? randomBytes(ivLength) : CONSTANT_IV;
  const cipher = createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export async function decrypt(value: string, iv?: string) {
  const _iv = iv ? Buffer.from(iv, 'hex') : CONSTANT_IV;
  const encryptedText = Buffer.from(value, 'hex');
  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    _iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

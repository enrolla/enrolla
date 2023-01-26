import { box, randomBytes } from 'tweetnacl';
import {
  decodeBase64,
  encodeUTF8,
  decodeUTF8,
  encodeBase64,
} from 'tweetnacl-util';

/* Decrypt a message with a base64 encoded secretKey (privateKey) */
interface IEncryptedMsg {
  value: string;
  ephemPubKey: string;
  nonce: string;
}

/**
 *
 * @param privateKey secret private key in base64 format
 * @param encryptedData contains value, nonce, and ephemeral public key
 * @returns decrypted message string
 */
export const decrypt = (privateKey: string, encryptedData: IEncryptedMsg) => {
  const receiverSecretKeyUint8Array = decodeBase64(privateKey);
  const nonce = decodeBase64(encryptedData.nonce);
  const ciphertext = decodeBase64(encryptedData.value);
  const ephemPubKey = decodeBase64(encryptedData.ephemPubKey);
  const decryptedMessage = box.open(
    ciphertext,
    nonce,
    ephemPubKey,
    receiverSecretKeyUint8Array
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return encodeUTF8(decryptedMessage!);
};

/**
 *
 * @param privateKey Private key from which a new public key is generated for encryption
 * @param message String message to encrypt
 * Uses version "x25519-xsalsa20-poly1305"
 *
 * @returns encrypted message
 */
export const encrypt = (message: string, privateKey: string): IEncryptedMsg => {
  const ephemeralKeyPair = box.keyPair();
  const pubKeyUInt8Array = box.keyPair.fromSecretKey(
    decodeBase64(privateKey)
  ).publicKey;
  const msgParamsUInt8Array = decodeUTF8(message);
  const nonce = randomBytes(box.nonceLength);
  const encryptedMessage = box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey
  );
  return {
    value: encodeBase64(encryptedMessage),
    ephemPubKey: encodeBase64(ephemeralKeyPair.publicKey),
    nonce: encodeBase64(nonce),
  };
};

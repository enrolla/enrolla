import { EncryptionKey } from '@enrolla/graphql-codegen';
import { useCustom } from '@pankod/refine-core';
import nacl from 'tweetnacl'; // cryptographic functions
import util from 'tweetnacl-util'; // encoding & decoding

export const createKeyPair = () => {
  const keypair = nacl.box.keyPair();
  const publicKey = util.encodeBase64(keypair.publicKey);
  const privateKey = util.encodeBase64(keypair.secretKey);

  return { publicKey, privateKey };
};

interface IEncryptedMsg {
  value: string;
  ephemPubKey: string;
  nonce: string;
}

/**
 *
 * @param receiverPublicKey Receiver public key in base64 format
 * @param message string message to encrypt
 * Uses version "x25519-xsalsa20-poly1305"
 *
 * @returns encrypted message
 */
export const encrypt = (
  message: string,
  receiverPublicKey?: string
): IEncryptedMsg => {
  if (!receiverPublicKey) {
    console.error('No public key supplied. Cannot encrypt message.');
    return {} as IEncryptedMsg;
  }
  const ephemeralKeyPair = nacl.box.keyPair();
  const pubKeyUInt8Array = util.decodeBase64(receiverPublicKey);
  const msgParamsUInt8Array = util.decodeUTF8(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encryptedMessage = nacl.box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey
  );
  return {
    value: util.encodeBase64(encryptedMessage),
    ephemPubKey: util.encodeBase64(ephemeralKeyPair.publicKey),
    nonce: util.encodeBase64(nonce),
  };
};

export const usePublicKey = () =>
  useCustom<EncryptionKey>({
    url: '', // required param, but not used. See backendGraphQLProvider.ts custom method
    method: 'get',
    metaData: {
      operation: 'encryptionKey',
      fields: ['publicKey'],
    },
  });

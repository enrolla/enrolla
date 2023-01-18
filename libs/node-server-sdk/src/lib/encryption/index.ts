import { box }  from "tweetnacl";
import { decodeBase64, encodeUTF8 } from "tweetnacl-util";

/* Decrypt a message with a base64 encoded secretKey (privateKey) */
interface IEncryptedMsg {  
    value: string  
    ephemPubKey: string  
    nonce: string
  }

/**
 * 
 * @param privateKey secret private key in base64 format
 * @param encryptedData contains value, nonce, and ephemeral public key
 * @returns decoded string
 */
export const decrypt = (privateKey: string, encryptedData: IEncryptedMsg) => {  
    const receiverSecretKeyUint8Array = decodeBase64(privateKey)      
    const nonce = decodeBase64(encryptedData.nonce)      
    const ciphertext = decodeBase64(encryptedData.value)      
    const ephemPubKey = decodeBase64(encryptedData.ephemPubKey)      
    const decryptedMessage = box.open(
        ciphertext, 
        nonce,          
        ephemPubKey, 
        receiverSecretKeyUint8Array
    )

    return encodeUTF8(decryptedMessage!)        
  }
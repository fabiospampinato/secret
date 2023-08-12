
/* IMPORT */

import Encryptor from 'tiny-encryptor';
import {ENCRYPTION_PBKDF2_ROUNDS} from './constants';

/* MAIN */

const Secret = {

  /* API */

  encrypt: ( data: Uint8Array, secret: string ): Promise<Uint8Array> => {

    return Encryptor.encrypt ( data, secret, undefined, ENCRYPTION_PBKDF2_ROUNDS );

  },

  decrypt: ( data: Uint8Array, secret: string ): Promise<Uint8Array> => {

    return Encryptor.decrypt ( data, secret );

  }

};

/* EXPORT */

export default Secret;

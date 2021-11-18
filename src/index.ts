
/* IMPORT */

import Crypto from './crypto';

/* MAIN */

const Secret = {

  /* API */

  encrypt: ( data: Buffer, password: string ): Buffer => {

    return Crypto.encrypt ( data, Buffer.from ( password ) );

  },

  encryptStr: ( data: string, password: string ): string => {

    return Crypto.encrypt ( Buffer.from ( data ), Buffer.from ( password ) ).toString ( 'hex' );

  },

  decrypt: ( data: Buffer, password: string ): Buffer => {

    return Crypto.decrypt ( data, Buffer.from ( password ) );

  },

  decryptStr: ( data: string, password: string ): string => {

    return Crypto.decrypt ( Buffer.from ( data, 'hex' ), Buffer.from ( password ) ).toString ();

  }

};

/* EXPORT */

export default Secret;

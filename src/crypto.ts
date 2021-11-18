
/* IMPORT */

import crypto from 'crypto';

/* HELPERS */

const ALGORITHM = 'aes-256-gcm';

const KEY_HASH = 'sha512';
const KEY_ITERATIONS = 100001;
const KEY_LENGTH = 32;

const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

const IV_POSITION = 0;
const SALT_POSITION = IV_POSITION + IV_LENGTH;
const TAG_POSITION = SALT_POSITION + SALT_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/* MAIN */

// Largely inspired by "MauriceButler/cryptr"

//TODO: Make a standalone module out of this, with support for custom iterations rounds, custom precomputed salt, custom precomputed key etc.

const Crypto = {

  /* API */

  encrypt: ( data: Buffer, secret: Buffer ): Buffer => {

    const iv = crypto.randomBytes ( IV_LENGTH );
    const salt = crypto.randomBytes ( SALT_LENGTH );
    const key = Crypto.key ( secret, salt );
    const cipher = crypto.createCipheriv ( ALGORITHM, key, iv );
    const encrypted = Buffer.concat ( [cipher.update ( data ), cipher.final ()] );
    const tag = cipher.getAuthTag ();
    const vector = Buffer.concat ( [iv, salt, tag, encrypted] );

    return vector;

  },

  decrypt: ( vector: Buffer, secret: Buffer ): Buffer => {

    const iv = vector.slice ( IV_POSITION, SALT_POSITION );
    const salt = vector.slice ( SALT_POSITION, TAG_POSITION );
    const tag = vector.slice ( TAG_POSITION, ENCRYPTED_POSITION );
    const encrypted = vector.slice ( ENCRYPTED_POSITION );
    const key = Crypto.key ( secret, salt );
    const decipher = crypto.createDecipheriv ( ALGORITHM, key, iv ).setAuthTag ( tag );
    const decrypted = Buffer.concat ( [decipher.update ( encrypted ), decipher.final ()] );

    return decrypted;

  },

  key: ( secret: Buffer, salt: Buffer ) => {

    return crypto.pbkdf2Sync ( secret, salt, KEY_ITERATIONS, KEY_LENGTH, KEY_HASH );

  }

};

/* EXPORT */

export default Crypto;

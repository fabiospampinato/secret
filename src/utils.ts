
/* IMPORT */

import {color} from 'specialist';

/* MAIN */

const Utils = {

  /* API */

  fail: ( error: string ): void => {

    console.log ( color.red ( error ) );

    process.exit ( 1 );

  }

};

/* EXPORT */

export default Utils;

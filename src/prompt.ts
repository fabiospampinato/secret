
/* IMPORT */

import readline from 'readline';

/* MAIN */

//TODO: Maybe a little module out of this

const Prompt = {

  /* API */

  line: ( prompt: string ): Promise<string> => {

    process.stdout.write ( prompt );

    const rl = readline.createInterface ({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise ( resolve => {

      rl.on ( 'line', line => {

        rl.close ();

        resolve ( line );

      });

    });

  },

  Yn: async ( prompt: string ): Promise<boolean> => {

    const line = await Prompt.line ( prompt );

    return !line || line.toLowerCase () === 'y';

  }

};

/* EXPORT */

export default Prompt;

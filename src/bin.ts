#!/usr/bin/env node

/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {bin, color} from 'specialist';
import {SECRET_SUFFIX} from './constants';
import Prompt from './prompt';
import Utils from './utils';
import Secret from '.';

/* MAIN */

bin ( 'secret', 'The simplest command to encrypt/decrypt a file' )
  /* DEFAULT COMMAND */
  .argument ( '<file>', 'The file to encrypt/descrypt' )
  .action ( async ( options, inputFiles ) => {
    const inputFile = inputFiles[0];
    const isSecret = inputFile.endsWith ( SECRET_SUFFIX );
    const inputPath = path.resolve ( process.cwd (), inputFile );
    const inputExists = fs.existsSync ( inputPath );
    if ( !inputExists ) return Utils.fail ( `"${inputFile}" does not exist!` );
    const stat = fs.lstatSync ( inputPath );
    if ( !stat.isFile () ) return Utils.fail ( `"${inputFile}" is not a file!` );
    const inputBuffer = fs.readFileSync ( inputPath );
    const password = await Prompt.line ( 'Password: ' );
    if ( !password ) return Utils.fail ( 'Password can not be empty!' );
    const passwordConfirmation = await Prompt.line ( 'Password confirmation: ' );
    if ( password !== passwordConfirmation ) return Utils.fail ( 'The passwords do not match!' );
    try {
      const transform = isSecret ? Secret.decrypt : Secret.encrypt;
      const outputBuffer = transform ( inputBuffer, password );
      const outputFile = isSecret ? path.basename ( inputFile, path.extname ( inputFile ) ) : `${inputFile}${SECRET_SUFFIX}`;
      const outputPath = path.resolve ( process.cwd (), outputFile );
      const outputExists = fs.existsSync ( outputPath );
      const shouldOverwrite = !outputExists || await Prompt.Yn ( `"${outputFile}" already exists, do you want to overwrite it? [Y/n]: ` );
      if ( !shouldOverwrite ) return process.exit ( 0 );
      fs.writeFileSync ( outputPath, outputBuffer );
      console.log ( `${color.green ( '✔' )} ${isSecret ? 'Decrypted' : 'Encrypted'}: "${inputFile}" -> "${outputFile}"` );
    } catch {
      Utils.fail ( `${isSecret ? 'Decription' : 'Encryption'} failed, try again!` );
    }
  })
  /* RETURN */
  .run ();

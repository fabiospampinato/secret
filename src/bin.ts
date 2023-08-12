#!/usr/bin/env node

/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as prask from 'prask';
import {bin} from 'specialist';
import {SECRET_SUFFIX} from './constants';
import Secret from '.';

/* MAIN */

bin ( 'secret', 'The simplest command to encrypt/decrypt a file' )
  /* DEFAULT COMMAND */
  .argument ( '<file>', 'The file to encrypt or descrypt' )
  .action ( async ( options, inputFiles ) => {
    /* INPUT */
    const inputFile = inputFiles[0];
    const inputPath = path.resolve ( process.cwd (), inputFile );
    const inputExists = fs.existsSync ( inputPath );
    if ( !inputExists ) return prask.log.error ( `"${inputFile}" does not exist!` );
    const inputStat = fs.lstatSync ( inputPath );
    if ( !inputStat.isFile () ) return prask.log.error ( `"${inputFile}" is not a file!` );
    const inputBuffer = fs.readFileSync ( inputPath );
    /* PASSWORD */
    const isSecret = inputFile.endsWith ( SECRET_SUFFIX );
    const password = await prask.password ({ message: 'Password:', required: true });
    if ( !password ) return;
    const passwordConfirmation = isSecret ? password : await prask.password ({ message: 'Password confirmation:', required: true });
    if ( !passwordConfirmation ) return;
    if ( password !== passwordConfirmation ) return prask.log.error ( 'The two passwords do not match!' );
    /* OUTPUT */
    try {
      const transform = isSecret ? Secret.decrypt : Secret.encrypt;
      const outputBuffer = await transform ( inputBuffer, password );
      const outputFile = isSecret ? path.basename ( inputFile, path.extname ( inputFile ) ) : `${inputFile}${SECRET_SUFFIX}`;
      const outputPath = path.resolve ( process.cwd (), outputFile );
      const outputExists = fs.existsSync ( outputPath );
      const outputOverwrite = !outputExists || await prask.toggle ({ message: `"${outputFile}" already exists, do you want to overwrite it?` });
      if ( !outputOverwrite ) return;
      fs.writeFileSync ( outputPath, outputBuffer );
      prask.log.success ( `${isSecret ? 'Decrypted' : 'Encrypted'}, "${inputFile}" -> "${outputFile}"` );
    } catch {
      prask.log.error ( `${isSecret ? 'Decryption' : 'Encryption'} failed, try again!` );
    }
  })
  /* RETURN */
  .run ();

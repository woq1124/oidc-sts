#!/usr/bin/env node
import getArgs from './args.js';
import launchServer from './server.js';
import launchBrowser from './browser.js';
import { stdout, getExistCredentials, cleanCredentials } from './credential.js';

const { argv } = getArgs();

/**
 * @param {import('./types').Args} args
 */
async function main(args) {
    if (args.clean) {
        cleanCredentials();
    }

    const credentials = getExistCredentials();

    if (args.force || !credentials || credentials.Expiration * 1000 < Date.now()) {
        if (args.redirectUri.startsWith('http://localhost')) {
            launchServer(args);
        }
        launchBrowser(args);
    } else {
        stdout(credentials);
    }
}

main(argv);

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function getArgs() {
    return yargs(hideBin(process.argv))
        .option('issuer-url', {
            type: 'string',
            description: 'Issuer URL',
            demandOption: true,
        })
        .option('client-id', {
            type: 'string',
            description: 'Client ID',
            demandOption: true,
        })
        .option('client-secret', {
            type: 'string',
            description: 'Client Secret. Required for localhost redirect URIs',
        })
        .option('redirect-uri', {
            type: 'string',
            description: 'Redirect URI',
            demandOption: true,
        })
        .options('role-arn', {
            type: 'string',
            description: 'Role ARN',
            demandOption: true,
        })
        .options('role-session-name', {
            type: 'string',
            description: 'Role Session Name',
        })
        .options('duration', {
            type: 'number',
            description: 'Duration in seconds. Default 1 hour',
            default: 3600,
        })
        .options('scopes', {
            type: 'string',
            description: 'Scopes to request. Space separated. Default openid',
            default: 'openid',
        })
        .options('force', {
            type: 'boolean',
            description: 'Force re-authentication',
        })
        .options('clean', {
            type: 'boolean',
            description: 'Clean cache',
        })
        .help()
        .alias('help', 'h');
}

export default getArgs;

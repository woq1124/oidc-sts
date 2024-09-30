import fs from 'fs';
import path from 'path';
import axios from 'axios';
import userData from './user-data.js';

function stdout(credentials) {
    console.log(
        JSON.stringify(
            {
                Version: 1,
                AccessKeyId: credentials.AccessKeyId,
                SecretAccessKey: credentials.SecretAccessKey,
                SessionToken: credentials.SessionToken,
                Expiration: new Date(credentials.Expiration * 1000).toISOString(),
            },
            null,
            2,
        ),
    );
}

function cleanCredentials() {
    const cachePath = path.join(userData.cache, 'credentials.json');
    if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
    }
}

function getExistCredentials() {
    const cachePath = path.join(userData.cache, 'credentials.json');
    if (fs.existsSync(cachePath)) {
        return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    }
    return undefined;
}

/**
 * @param {{
 * idToken: string;
 * roleArn: string;
 * roleSessionName?: string;
 * duration: number;
 * }} args
 */
async function assumeRoleWithWebIdentify(args) {
    const {
        AssumeRoleWithWebIdentityResponse: {
            AssumeRoleWithWebIdentityResult: { Credentials: credentials },
        },
    } = await axios
        .post(
            'https://sts.amazonaws.com',
            new URLSearchParams({
                Action: 'AssumeRoleWithWebIdentity',
                Version: '2011-06-15',
                WebIdentityToken: args.idToken,
                RoleArn: args.roleArn,
                RoleSessionName: args.roleSessionName || 'web-identity',
                DurationSeconds: args.duration,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        )
        .then(({ data }) => data);

    fs.writeFileSync(path.join(userData.cache, 'credentials.json'), JSON.stringify(credentials));
    stdout(credentials);
}

export { stdout, cleanCredentials, getExistCredentials, assumeRoleWithWebIdentify };

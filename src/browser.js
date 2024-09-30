import { chromium } from 'playwright-chromium';
import userData from './user-data.js';
import { assumeRoleWithWebIdentify } from './credential.js';

/**
 * @param {import("./types").Args} args
 */
async function launchBrowser(args) {
    const loginUrl = `${args.issuerUrl}/auth?${new URLSearchParams({
        client_id: args.clientId,
        redirect_uri: args.redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
    }).toString()}`;

    const context = await chromium.launchPersistentContext(userData.data, {
        headless: false,
        args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await context.newPage();

    page.on('response', async (response) => {
        if (response.url().startsWith(args.redirectUri)) {
            const rawData = await response.text();
            const data = JSON.parse(rawData);
            await assumeRoleWithWebIdentify({
                idToken: data.id_token,
                roleArn: args.roleArn,
                roleSessionName: args.roleSessionName,
                duration: args.duration,
            });
            context.close();
            process.exit(0);
        }
    });

    try {
        await page.goto(loginUrl, { waitUntil: 'load' });
    } catch (error) {
        console.error('Navigation failed:', error);
    }
}

export default launchBrowser;

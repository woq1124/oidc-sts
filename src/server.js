import http from 'http';
import axios from 'axios';

/**
 * @param {string} pathname
 */
function parsePathname(pathname) {
    const [path, query] = pathname.split('?');
    const queryParams = new URLSearchParams(query);
    return { path, queryParams };
}

/**
 * @param {import('./types').Args} args
 * @param {string} code
 */
async function handleCode(args, code) {
    const tokenEndpoint = await axios
        .get(`${args.issuerUrl}/.well-known/openid-configuration`)
        .then(({ data }) => data.token_endpoint);

    return axios
        .post(
            tokenEndpoint,
            new URLSearchParams({
                code,
                client_id: args.clientId,
                client_secret: args.clientSecret,
                redirect_uri: args.redirectUri,
                grant_type: 'authorization_code',
            }),
        )
        .then(({ data }) => data);
}

/**
 * @param {import('./types').Args} args
 */
function launchServer(args) {
    const { hostname, port, pathname: callbackPath } = new URL(args.redirectUri);

    const server = http.createServer((req, res) => {
        const { path, queryParams } = parsePathname(req.url);

        if (path === callbackPath) {
            const code = queryParams.get('code');
            if (!code) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(`Missing code in query params: ${req.url}`);
                return;
            }
            handleCode(args, code).then((data) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
                server.close();
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            server.close();
        }
    });

    server.listen(port, hostname);
}

export default launchServer;

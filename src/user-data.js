import fs from 'fs';
import envpaths from 'env-paths';

const paths = envpaths('oidc-sts', { suffix: '' });

if (!fs.existsSync(paths.data)) {
    fs.mkdirSync(paths.data, { recursive: true });
}

if (!fs.existsSync(paths.cache)) {
    fs.mkdirSync(paths.cache, { recursive: true });
}

export default paths;

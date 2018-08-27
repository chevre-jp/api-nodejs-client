/**
 * 映画検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const creativeWorkService = new client.service.CreativeWork({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    const movies = await creativeWorkService.searchMovies({
        // identifier: movie.identifierf
    });
    console.log('found', movies);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

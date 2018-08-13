/**
 * 劇場検索サンプル
 */
const client = require('../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});
const placeService = new client.service.Place({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

async function main() {
    console.log('finding movieTheater...');
    const movieTheater = await placeService.findMovieTheaterByBranchCode({
        branchCode: '118'
    });
    console.log('movieTheater found', movieTheater);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

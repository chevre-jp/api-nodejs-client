/**
 * オファーカテゴリサンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const offerService = new client.service.Offer({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    let categories = await offerService.searchCategories({
        project: { ids: ['cinerino'] }
    });
    console.log('categories found', categories);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

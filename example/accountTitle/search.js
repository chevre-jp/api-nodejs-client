/**
 * 勘定科目検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const accountTitleService = new client.service.AccountTitle({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const result = await accountTitleService.search({
        limit: 10,
        page: 1,
    });
    console.log(result);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

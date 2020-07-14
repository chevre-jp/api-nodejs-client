/**
 * 販売者検索サンプル
 */
const client = require('../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const sellerService = new client.service.Seller({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const { totalCount, data } = await sellerService.search({
        project: { id: { $eq: 'cinerino' } },
        $projection: { name: 0, parentOrganization: 0, 'paymentAccepted.gmoInfo.shopPass': 0 }
    });
    console.log(data);
    console.log(totalCount, 'sellers found');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

/**
 * 上映イベントオファー検索サンプル
 */
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const eventService = new client.service.Event({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching offers...');
    const offers = await eventService.searchScreeningEventTicketOffers({ eventId: '2of644jo71xsqb' });
    console.log(offers);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

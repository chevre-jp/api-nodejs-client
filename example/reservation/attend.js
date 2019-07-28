/**
 * イベント入場サンプル
 */
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const reservationService = new client.service.Reservation({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('attending in...');
    await reservationService.attendScreeningEvent({
        id: '002-181030-000001-0',
    });
    console.log('attended');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

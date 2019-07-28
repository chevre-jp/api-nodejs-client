/**
 * イベント発券サンプル
 */
const auth = require('../auth');
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

    console.log('checking in...');
    await reservationService.checkInScreeningEventReservations({
        // id: '002-181216-000001-2',
        reservationNumber: '002-181216-000001'
    });
    console.log('checked in');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

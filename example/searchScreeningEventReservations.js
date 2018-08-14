/**
 * 上映イベント予約検索サンプル
 */
const moment = require('moment');
const client = require('../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});
const reservationService = new client.service.Reservation({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

async function main() {
    console.log('searching reservations...');
    const reservations = await reservationService.searchScreeningEventReservations({
        ids: ['118-180814-000007-0'],
        reservationStatuses: [client.factory.reservationStatusType.ReservationPending]
    });
    console.log(reservations.length, 'reservations found');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

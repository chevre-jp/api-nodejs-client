/**
 * 上映イベント検索サンプル
 */
const moment = require('moment');
const client = require('../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});
const eventService = new client.service.Event({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

async function main() {
    console.log('searching events...');
    const events = await eventService.searchScreeningEvents({
        startFrom: new Date(),
        endThrough: moment().add(1, 'month').toDate()
    });
    console.log(events.length, 'events found');

    console.log('searching offers...');
    const offers = await eventService.searchScreeningEventOffers({ eventId: events[0].id });
    console.log('offers:', offers);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

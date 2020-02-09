/**
 * 座席検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
const util = require('util');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });

    const placeService = new client.service.Place({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('finding movieTheater...');
    const { data } = await placeService.searchSeats({
        limit: 10,
        page: 2,
        containedInPlace: {
            containedInPlace: {
                branchCode: {
                    $eq: '10'
                },
                containedInPlace: {
                    branchCode: {
                        $eq: '001'
                    }
                }
            }
        }
        // name: 'モーション'
    });
    console.log(data);
    console.log(util.inspect(data[0], { depth: 5 }));
    console.log(data.length, 'seats found');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

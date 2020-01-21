const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: []
    });
    const offerService = new client.service.Offer({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const programMemberships = await offerService.fetch({
        uri: '/programMemberships',
        method: 'GET',
        // tslint:disable-next-line:no-magic-numbers
        expectedStatusCodes: [200],
        qs: {
            project: { id: { $eq: 'cinerino' } }
        }
    })
        .then(async (response) => {
            return response.json();
        });
    console.log(programMemberships.length, 'programMemberships found');

    const offers = await offerService.fetch({
        uri: `/programMemberships/${programMemberships[0].id}/offers`,
        method: 'GET',
        // tslint:disable-next-line:no-magic-numbers
        expectedStatusCodes: [200],
        qs: {
            project: { id: { $eq: 'cinerino' } }
        }
    })
        .then(async (response) => {
            return response.json();
        });
    console.log(offers.length, 'offers found');
    console.log(offers);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

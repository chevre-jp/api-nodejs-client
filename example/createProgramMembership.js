const client = require('../lib/');

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

    const offer = await offerService.fetch({
        uri: '/programMemberships',
        method: 'POST',
        // tslint:disable-next-line:no-magic-numbers
        expectedStatusCodes: [201],
        body:
        {
            "project": {
                "typeOf": "Project",
                "id": "cinerino"
            },
            "typeOf": "ProgramMembership",
            "programName": "test-cinerino-programMembership-20190116",
            "name": "test-cinerino-programMembership-20190116",
            "hasOfferCatalog": {
                "typeOf": "OfferCatalog",
                "id": "7iri85wk5ggjsmf",
            }
        }
    })
        .then(async (response) => {
            return response.json();
        });
    console.log('programMembership created', offer);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

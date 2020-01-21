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

    const offer = await offerService.fetch({
        uri: '/offerCatalogs',
        method: 'POST',
        // tslint:disable-next-line:no-magic-numbers
        expectedStatusCodes: [201],
        body: {
            "typeOf": "OfferCatalog",
            "itemListElement": [
                { typeOf: 'Offer', id: '7iri85wk5ggf685' }
            ],
            "project": {
                "typeOf": "Project",
                "id": "cinerino"
            },
            "identifier": "test-cinerino-offerCatalog-20200116",
            "name": {
                "ja": "test-cinerino-offerCatalog-20200116",
                "en": "test-cinerino-offerCatalog-20200116"
            },
            "description": {
                "ja": "",
                "en": ""
            },
            "itemOffered": {
                typeOf: 'ProgramMembership'
            },
        }
    })
        .then(async (response) => {
            return response.json();
        });
    console.log('offer created', offer);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

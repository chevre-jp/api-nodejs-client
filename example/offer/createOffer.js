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
        uri: '/offers',
        method: 'POST',
        // tslint:disable-next-line:no-magic-numbers
        expectedStatusCodes: [201],
        body: {
            "project": {
                "typeOf": "Project",
                "id": "cinerino"
            },
            "typeOf": "Offer",
            "priceCurrency": "JPY",
            "identifier": "test-cinerino-offer-20200116",
            "name": {
                "ja": "test-cinerino-offer-20200116",
                "en": "test-cinerino-offer-20200116"
            },
            "description": {
                "ja": "",
                "en": ""
            },
            "alternateName": {
                "ja": "",
                "en": ""
            },
            "availability": "InStock",
            "priceSpecification": {
                "project": {
                    "typeOf": "Project",
                    "id": "cinerino"
                },
                "typeOf": "UnitPriceSpecification",
                "price": 1000,
                "priceCurrency": "JPY",
                "valueAddedTaxIncluded": true,
                "referenceQuantity": {
                    "typeOf": "QuantitativeValue",
                    "value": 1,
                    "unitCode": "C62"
                },
            },
            "additionalProperty": [
            ],
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

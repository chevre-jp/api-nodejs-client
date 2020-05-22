/**
 * サービス登録取引サンプル
 */
const moment = require('moment');
const client = require('../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});

const registerService = new client.service.transaction.RegisterService({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

const product = { id: '5ebbf3f9416bbf0ea4d39639' };

const transactionNumber = `CIN${(new Date()).valueOf()}`;
const identifier = 'CIN158937572108700';

async function main() {
    console.log('starting transaction...identifier:', identifier);
    let transaction = await registerService.start({
        transactionNumber: transactionNumber,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        project: { id: project.id },
        typeOf: client.factory.transactionType.RegisterService,
        object: [
            {
                // 7iri85wk5ggjsmg
                id: '7k740xps7',
                itemOffered: {
                    id: product.id,
                    serviceOutput: {
                        toLocation: {
                            identifier: identifier
                        }
                    }
                }
            }
        ],
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    // 確定
    await registerService.confirm({
        id: transaction.id,
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

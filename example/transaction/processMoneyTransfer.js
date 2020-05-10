/**
 * 通貨転送取引サンプル
 */
const moment = require('moment');
const client = require('../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});

const moneyTransferService = new client.service.transaction.MoneyTransfer({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

async function main() {
    let transaction = await moneyTransferService.start({
        project: { id: project.id },
        agent: { typeOf: 'Person', name: 'Agent' },
        recipient: { typeOf: 'Person', name: 'Recipient' },
        object: {
            amount: {
                value: 1,
            },
            // fromLocation: {
            //     name: 'fromLocation'
            // },
            fromLocation: {
                typeOf: 'PrepaidPaymentCard',
                identifier: '50022500006',
                accessCode: '123'
            },
            // toLocation: {
            //     name: 'toLocation'
            // },
            toLocation: {
                typeOf: 'PrepaidPaymentCard',
                identifier: '80205600010',
                accessCode: '123'
            },
            description: 'sample'
        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    // 確定
    await moneyTransferService.confirm({
        id: transaction.id,
    });
    console.log('transaction confirmed');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

/**
 * 入金取引サンプル
 */
const moment = require('moment');
const open = require('open');
const readline = require('readline');
const util = require('util');
const client = require('../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});

const project = { typeOf: 'Project', id: 'cinerino' };

const depositService = new client.service.accountTransaction.Deposit({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth,
    project
});

async function main() {
    const { toAccountNumber, amount, description } = await new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // rl.question('入金先の口座タイプを入力してください。\n', async (accountType) => {
        // });
        rl.question('入金先の口座番号を入力してください。\n', async (toAccountNumber) => {
            rl.question('入金金額を入力してください。\n', async (amount) => {
                rl.question('取引説明を入力してください。\n', async (description) => {
                    rl.close();
                    resolve({ toAccountNumber, amount, description });
                });
            });
        });
    });

    const transactionNumber = `chevresdksamples-${project.id}-${(new Date()).valueOf()}`;
    console.log('取引が開始します...', toAccountNumber, amount, description);
    const transaction = await depositService.start({
        identifier: transactionNumber,
        transactionNumber: transactionNumber,
        project: project,
        expires: moment()
            .add(1, 'minutes')
            .toDate(),
        agent: {
            typeOf: client.factory.organizationType.Organization,
            id: 'agent-id',
            name: '@chevre/sdk',
            url: 'https://example.com'
        },
        recipient: {
            typeOf: client.factory.personType.Person,
            id: 'recipient-id',
            name: 'recipient name',
            url: 'https://example.com'
        },
        object: {
            amount: Number(amount),
            description,
            toLocation: {
                // accountType: accountType,
                accountNumber: toAccountNumber
            }
        }
    });
    console.log('取引が開始されました。', transaction.transactionNumber);

    await wait(1000);

    // await depositService.cancel({ transactionNumber: transactionNumber });
    // 確定
    await depositService.confirm({ transactionNumber });
    console.log('取引確定です。');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

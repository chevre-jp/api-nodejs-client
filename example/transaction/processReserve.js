/**
 * 予約取引サンプル
 */
const moment = require('moment');
const client = require('../../lib/');

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
const reserveService = new client.service.transaction.Reserve({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

const project = { id: 'cinerino' };

async function main() {
    console.log('searching events...');
    const events = await eventService.search({
        project: { ids: [project.id] },
        typeOf: client.factory.eventType.ScreeningEvent,
        inSessionFrom: new Date(),
        inSessionThrough: moment().add(1, 'month').toDate()
    });
    console.log(events.totalCount, 'events found');
    const selectedEvent = events.data[0];
    // const selectedEvent = { id: '7iri100jqrrpxy1' };

    console.log('searching ticket types...');
    const ticketOffers = await eventService.searchTicketOffers({ id: selectedEvent.id });
    console.log(ticketOffers.length, 'ticketOffers found');
    console.log('チケットオファーは以下の通りです')
    console.log(ticketOffers.map((o) => {
        const unitPriceSpecification = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.priceSpecificationType.UnitPriceSpecification)
            .shift();
        const videoFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.priceSpecificationType.VideoFormatChargeSpecification)
            .map((s) => `+${s.appliesToVideoFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        const soundFormatCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.priceSpecificationType.SoundFormatChargeSpecification)
            .map((s) => `+${s.appliesToSoundFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')
        const mvtkCharge = o.priceSpecification.priceComponent
            .filter((s) => s.typeOf === client.factory.priceSpecificationType.MovieTicketTypeChargeSpecification)
            .map((s) => `+${s.appliesToVideoFormat}チャージ:${s.price} ${s.priceCurrency}`).join(' ')

        return `${o.id} ${o.name.ja} ${unitPriceSpecification.price} ${o.priceCurrency} ${videoFormatCharge} ${soundFormatCharge} ${mvtkCharge}`
    }).join('\n'));

    console.log('searching offers...');
    const offers = await eventService.searchOffers({ id: selectedEvent.id });
    console.log(offers.length, 'offers found');
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');

    const selectedSectionOffer = offers[0];
    // const selectedSeatOffer = availableSeatOffers[0];
    const selectedSeatOffers = availableSeatOffers.slice(0, 2);
    const selectedTicketOffer = ticketOffers[Math.floor(ticketOffers.length * Math.random())];
    console.log('reserving...',
        selectedEvent.id,
        selectedSectionOffer.branchCode,
        selectedSeatOffers.map((o) => o.branchCode),
        selectedTicketOffer.id
    );

    console.log('starting transaction...');
    let transaction = await reserveService.start({
        project: { id: project.id },
        typeOf: client.factory.transactionType.Reserve,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: {
            event: {
                id: selectedEvent.id
            },
            acceptedOffer: selectedSeatOffers.map((o) => {
                return {
                    id: selectedTicketOffer.id,
                    ticketedSeat: {
                        seatNumber: o.branchCode,
                        seatSection: selectedSectionOffer.branchCode
                    }
                }
            }),
            notes: 'test from samples'
        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);
    console.log('予約を開始しました', transaction.object.reservations.map((r) => r.id).join(','));
    console.log(transaction.object.reservations.map((r) => {
        return `${r.id} ${r.reservationNumber} ${r.reservationStatus} ${r.reservedTicket.underName.name}`
    }).join('\n'));

    await wait(1000);

    // 中止
    await reserveService.cancel({
        id: transaction.id
    });
    console.log('transaction canceled');

    transaction = await reserveService.start({
        project: { id: project.id },
        typeOf: client.factory.transactionType.Reserve,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: {
            event: {
                id: selectedEvent.id
            },
            acceptedOffer: selectedSeatOffers.map((o) => {
                return {
                    id: selectedTicketOffer.id,
                    ticketedSeat: {
                        seatNumber: o.branchCode,
                        seatSection: selectedSectionOffer.branchCode
                    }
                }
            }),
            notes: 'test from samples'
        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);
    console.log('予約を開始しました', transaction.object.reservations.map((r) => r.id).join(','));
    console.log(transaction.object.reservations.map((r) => {
        return `${r.id} ${r.reservationNumber} ${r.reservationStatus} ${r.reservedTicket.underName.name}`
    }).join('\n'));


    // 確定
    await reserveService.confirm({
        id: transaction.id,
        object: {
            reservations: transaction.object.reservations.map((r) => {
                return {
                    id: r.id,
                    reservedTicket: {
                        issuedBy: {
                            typeOf: 'Organization',
                            name: 'Motion Theater',
                            additionalName: 'additionalName',
                            identifier: [{
                                name: 'branchCode',
                                value: '123'
                            }],
                            telephone: '+81312345678'
                        }
                    },
                    underName: {
                        typeOf: 'Person',
                        name: 'Motion Taro',
                        additionalName: 'additionalName',
                        identifier: [{
                            name: 'orderNumber',
                            value: '12345'
                        }],
                        email: 'hello@motionpicture.jp',
                        familyName: 'Motion',
                        gender: 'Female',
                        givenName: 'Taro',
                        telephone: '+819012345678'
                    }
                }
            })
        }
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

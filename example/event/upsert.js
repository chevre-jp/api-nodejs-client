const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const offerService = new client.service.Offer({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });
    const placeService = new client.service.Place({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });
    const eventService = new client.service.Event({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    const project = { typeOf: 'Project', id: 'cinerino' };

    // 劇場検索
    const searchMovieTheatersResult = await placeService.searchMovieTheaters({
        project: { ids: [project.id] }
    });
    const movieTheaterWithoutScreeningRoom = searchMovieTheatersResult.data.find((d) => d.branchCode === '001');
    const movieTheater = await placeService.findMovieTheaterById({ id: movieTheaterWithoutScreeningRoom.id });
    console.log('movieTheater:', movieTheater);

    const screeningRoom = movieTheater.containsPlace[0];

    // 劇場作品検索
    const searchScreeningEventSeriesResult = await eventService.search({
        project: { ids: [project.id] },
        typeOf: client.factory.eventType.ScreeningEventSeries,
        workPerformed: { identifiers: ['001'] }
    });
    const screeningEventSeries = searchScreeningEventSeriesResult.data[0];
    console.log('screeningEventSeries:', screeningEventSeries);

    // 券種検索
    const searchTicketTypeGroupsResult = await offerService.searchTicketTypeGroups({
        project: { ids: [project.id] },
        identifier: '^01$'
    });
    const ticketTypeGroup = searchTicketTypeGroupsResult.data[0];
    console.log('ticketTypeGroup:', ticketTypeGroup);

    const searchTicketTypesResult = await offerService.searchTicketTypes({
        project: { ids: [project.id] },
        ids: ticketTypeGroup.ticketTypes
    });
    const ticketTypes = searchTicketTypesResult.data;
    console.log('ticketTypes:', ticketTypes);

    const offers = {
        id: ticketTypeGroup.id,
        name: ticketTypeGroup.name,
        typeOf: 'Offer',
        priceCurrency: client.factory.priceCurrency.JPY,
        availabilityEnds: new Date(),
        availabilityStarts: new Date(),
        eligibleQuantity: {
            typeOf: 'QuantitativeValue',
            unitCode: client.factory.unitCode.C62,
            maxValue: 10,
            value: 1
        },
        itemOffered: {
            serviceType: {},
            serviceOutput: {
                typeOf: client.factory.reservationType.EventReservation,
                reservedTicket: {
                    typeOf: 'Ticket',
                    ticketedSeat: { typeOf: client.factory.placeType.Seat }
                }
            }
        },
        validFrom: new Date(),
        validThrough: new Date(),
        acceptedPaymentMethod: [
            client.factory.paymentMethodType.Cash,
            client.factory.paymentMethodType.CreditCard,
            client.factory.paymentMethodType.Others
        ]
    };

    const startDate = moment('2019-07-04T09:00:00+09:00').toDate();
    const event = {
        project: project,
        typeOf: client.factory.eventType.ScreeningEvent,
        eventStatus: client.factory.eventStatusType.EventScheduled,
        id: 'nonexistingid',
        name: screeningEventSeries.name,
        doorTime: moment(startDate).toDate(),
        startDate: startDate,
        endDate: moment(startDate).add(15, 'minutes').toDate(),
        workPerformed: screeningEventSeries.workPerformed,
        superEvent: screeningEventSeries,
        location: {
            project: project,
            typeOf: screeningRoom.typeOf,
            branchCode: screeningRoom.branchCode,
            name: screeningRoom.name,
            alternateName: screeningRoom.alternateName,
            address: screeningRoom.address
        },
        superEvent: screeningEventSeries,
        name: screeningEventSeries.name,
        offers: offers,
        checkInCount: undefined,
        attendeeCount: undefined,
        additionalProperty: [{ name: 'tourNumber', value: '091' }],
    };

    console.log('upserting event...', event.id);
    const result = await eventService.update({
        id: event.id,
        attributes: event,
        upsert: true
    });
    console.log('result:', result);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});

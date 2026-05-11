export interface TicketCreatedEvent {
    metadata: {
        eventType: string;
        timestamp: string;
    };
    payload: {
        ticketId: string;
        userId: string;
        title: string;
    };
}

export interface TicketStatusChangedEvent {
    metadata: {
        eventType: string;
        timestamp: string;
    };
    payload: {
        ticketId: string;
        userId: string;
        title: string;
    };
}
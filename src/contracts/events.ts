export interface TicketCreatedEvent {
    metadata: {
        eventType: string;
        timestamp: string;
        version?: number;
    };
    payload: {
        ticketId: string;
        creatorId: string;
        subject: string;
        organizationId?: string; 
        description?: string;
    };
}


export enum OrganizationTier {
    Premium = 'Premium',
    Medium = 'Medium',
    Free = 'Free'
}

export interface OrganizationCreatedEvent {
    metadata: {
        eventType: string;
        timestamp: string;
        version?: number;
    };
    payload: {
        organizationId: string;
        organizationName: string;
        tier: OrganizationTier;
        managerId: string;
    };
}


export interface UserInvitationCreated {
    metadata: {
        eventType: string;
        timestamp: string;
        version?: number;
    };
    payload: {
        organizationId: string,
        userEmail: string,
        targetRole: string,
        invitationToken: string;
    }
}

export interface TicketStatusChangedEvent {
    metadata: {
        eventType: string;
        timestamp: string;
        version?: number;
    };
    payload: {
        organizationId: string,
        ticketId: string,
        oldStatus: string,
        newStatus: string; 
        changedById: string,
        actorType: string; 
    }
}

export interface TicketMessageAddedEvent {
        metadata: {
        eventType: string;
        timestamp: string;
        version?: number;
    };
    payload: {
        organizationId: string,
        ticketId: string,
        messageId: string,
        senderId: string; 
        senderType: string,
        message: string; 
    }
}


export interface PaymentCompletedEvent {
  metadata: {
    eventType: string;
    timestamp: string;
    version: number;
  };
  payload: {
    organizationId: string;
    transactionId: string;
    status: string;
  };
}

export interface PaymentFailedEvent {
  metadata: {
    eventType: string;
    timestamp: string;
    version: number;
  };
  payload: {
    organizationId: string;
    transactionId: string;
    errorCode?: string;
    errorMessage?: string;
  };
}
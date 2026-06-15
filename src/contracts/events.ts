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
    FREE = 0,
    STANDARD = 1,
    PRO = 2,
    ENTERPRISE = 3,
    SUSPENDED = 99
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

export interface SlaDeadlineApproachingEvent {
  metadata: {
    eventType: string;
    timestamp: string;
    version: number;
  };
  payload: {
    ticketId: string;
    organizationId: string;
    slaType: 'FIRST_RESPONSE' | 'HUMAN_RESPONSE' | 'RESOLUTION';
    deadlineTime: string;
    minutesRemaining: number; 
  };
}

export interface SlaDeadlineBreachedEvent {
  metadata: {
    eventType: string;
    timestamp: string;
    version: number;
  };
  payload: {
    ticketId: string;
    organizationId: string;
    slaType: 'FIRST_RESPONSE' | 'HUMAN_RESPONSE' | 'RESOLUTION';
    deadlineTime: string;
  };
} 
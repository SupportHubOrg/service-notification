export function deriveIdempotencyKey(
  eventType: string,
  payload: Record<string, unknown>
): string | null {
  switch (eventType) { 
    case "OrganizationRegistered":
      return `OrganizationRegistered:${payload.organizationId}`;
    case "OrganizationCreated":
      return `OrganizationCreated:${payload.organizationId}`;
    case "UserInvitationCreated":
      return `UserInvitationCreated:${payload.invitationToken}`;
    case "UserInvitationAccepted":
      return `UserInvitationAccepted:${payload.userId}`;
    case "TicketCreated":
      return `TicketCreated:${payload.ticketId}`;
    case "TicketStatusChanged":
      return `TicketStatusChanged:${payload.ticketId}:${payload.newStatus}:${payload.changedById}`;
    case "TicketMessageAdded":
      return `TicketMessageAdded:${payload.messageId}`;
    case "PaymentCompleted":
      return `PaymentCompleted:${payload.transactionId}`;
    case "PaymentFailed":
      return `PaymentFailed:${payload.transactionId}`;
    case "SlaDeadlineApproaching":
      return `SlaDeadlineApproaching:${payload.ticketId}:${payload.slaType}:${payload.deadlineTime}`;
    case "SlaDeadlineBreached":
      return `SlaDeadlineBreached:${payload.ticketId}:${payload.slaType}:${payload.deadlineTime}`;
    default:
      return null;
  }
}

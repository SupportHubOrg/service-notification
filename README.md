# Notification Service - Local Setup

### 1. Configure Environment Variables
```bash
cp .env.sample .env
```
*(Note: Please update your Mailtrap SMTP credentials in the `.env` file before proceeding)*

### 2. Build and Start the Service
```bash
docker compose up --build -d
```

### 3. Sync Prisma Database Schema
```bash
docker exec -it notification-service npx prisma db push
```

### 4. Check Service Logs (Optional)
```bash
docker logs -f notification-service
```

### 5. Stop and Remove Containers
```bash
docker compose down
```

---

# Kafka Integration

### Consumed Topics & Events (Inputs)
* **`ticket-management-events`**
  * `TicketCreated`
  * `TicketStatusChanged`
  * `TicketMessageAdded`
  * `SlaDeadlineApproaching`
  * `SlaDeadlineBreached`
* **`organization-access-events`**
  * `OrganizationCreated`
  * `UserInvitationCreated`
  * `UserInvitationAccepted`
* **`billing-events`**
  * `PaymentCompleted`
  * `PaymentFailed`

### Produced Topics & Events (Outputs)
* **`notification-events`**
  * Publishes execution reports for monitoring and tracing (e.g., `NotificationSent`, `NotificationFailed`, `PaymentFailedNotificationSent`).
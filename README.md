# service-notification - Local Setup

### 1. Configure Environment Variables
```bash
cp .env.sample .env
```
*(Note: Please update Mailtrap credentials in the `.env` file before proceeding)*

### 2. Build and Start the Service
```bash
docker-compose up --build -d
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
docker-compose down
```
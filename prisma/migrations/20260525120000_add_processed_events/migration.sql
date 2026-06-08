CREATE TYPE "ProcessingStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

CREATE TABLE "ProcessedEvent" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "sourceTopic" TEXT NOT NULL,
    "partition" INTEGER NOT NULL,
    "offset" TEXT NOT NULL,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PROCESSING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessedEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProcessedEvent_idempotencyKey_key" ON "ProcessedEvent"("idempotencyKey");

CREATE INDEX "ProcessedEvent_status_updatedAt_idx" ON "ProcessedEvent"("status", "updatedAt");

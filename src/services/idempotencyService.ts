import { prisma } from "../db/prisma";
import { deriveIdempotencyKey } from "./idempotencyKey";

const ProcessingStatus = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

const STALE_PROCESSING_MS = 5 * 60 * 1000;

export interface KafkaMessageContext {
  topic: string;
  partition: number;
  offset: string;
  eventType: string;
  payload: Record<string, unknown>;
}

function isStaleProcessing(updatedAt: Date): boolean {
  return Date.now() - updatedAt.getTime() > STALE_PROCESSING_MS;
}

export async function processIdempotently(
  context: KafkaMessageContext,
  handler: () => Promise<void>
): Promise<void> {
  const idempotencyKey = deriveIdempotencyKey(context.eventType, context.payload);

  if (!idempotencyKey) {
    await handler();
    return;
  }

  const existing = await prisma.processedEvent.findUnique({
    where: { idempotencyKey },
  });

  if (existing?.status === ProcessingStatus.COMPLETED) {
    console.log(`[Idempotency] Already completed, skipping: ${idempotencyKey}`);
    return;
  }

  if (
    existing?.status === ProcessingStatus.PROCESSING &&
    !isStaleProcessing(existing.updatedAt)
  ) {
    console.warn(`[Idempotency] Still processing, will retry later: ${idempotencyKey}`);
    throw new Error(`Event ${idempotencyKey} is still being processed`);
  }

  await prisma.processedEvent.upsert({
    where: { idempotencyKey },
    create: {
      idempotencyKey,
      eventType: context.eventType,
      sourceTopic: context.topic,
      partition: context.partition,
      offset: context.offset,
      status: ProcessingStatus.PROCESSING,
      attemptCount: 1,
    },
    update: {
      eventType: context.eventType,
      sourceTopic: context.topic,
      partition: context.partition,
      offset: context.offset,
      status: ProcessingStatus.PROCESSING,
      attemptCount: { increment: 1 },
      lastError: null,
    },
  });

  try {
    await handler();

    await prisma.processedEvent.update({
      where: { idempotencyKey },
      data: {
        status: ProcessingStatus.COMPLETED,
        completedAt: new Date(),
        lastError: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await prisma.processedEvent.update({
      where: { idempotencyKey },
      data: {
        status: ProcessingStatus.FAILED,
        lastError: message,
      },
    });

    throw error;
  }
}

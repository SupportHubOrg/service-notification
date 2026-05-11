-- CreateTable
CREATE TABLE "UserCache" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCache_pkey" PRIMARY KEY ("userId")
);

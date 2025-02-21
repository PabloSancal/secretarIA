-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "messageText" TEXT NOT NULL,
    "userId" UUID,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

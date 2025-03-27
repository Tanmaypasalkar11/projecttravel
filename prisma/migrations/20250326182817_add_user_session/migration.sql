-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "room" TEXT,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutTime" TIMESTAMP(3),

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

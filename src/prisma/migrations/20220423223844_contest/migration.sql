-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('NOT_PUBLISHED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Contest" (
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "soaringSpotId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ContestStatus" NOT NULL DEFAULT E'NOT_PUBLISHED',

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("year")
);

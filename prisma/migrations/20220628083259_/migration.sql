-- CreateTable
CREATE TABLE "Post" (
    "slug" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "markdown" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "content" TEXT,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

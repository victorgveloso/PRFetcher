DROP TABLE IF EXISTS "PullRequests" CASCADE;

DROP TYPE IF EXISTS "public"."enum_PullRequests_state"; 
CREATE TYPE "public"."enum_PullRequests_state" AS ENUM('open', 'closed');

CREATE TABLE IF NOT EXISTS "PullRequests" (
    "owner" VARCHAR(255) NOT NULL,
    "repo" VARCHAR(255) NOT NULL,
    "number" INTEGER NOT NULL,
    "state" "public"."enum_PullRequests_state" NOT NULL,
    "title" VARCHAR(255),
    "body" VARCHAR(255),
    "comments" INTEGER,
    "commits" INTEGER,
    "changed_files" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("owner","repo","number"),
    UNIQUE ("owner","repo","number")
);
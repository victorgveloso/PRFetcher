DROP TABLE IF EXISTS "PullRequests" CASCADE;

DROP TYPE IF EXISTS "public"."enum_PullRequests_state"; 
CREATE TYPE "public"."enum_PullRequests_state" AS ENUM('open', 'closed');

CREATE TABLE IF NOT EXISTS "PullRequests" (
    "owner" VARCHAR(128) NOT NULL,
    "repo" VARCHAR(100) NOT NULL,
    "number" INTEGER NOT NULL,
    "state" "public"."enum_PullRequests_state" NOT NULL,
    "title" VARCHAR(255),
    "body" VARCHAR(65536),
    "comments" INTEGER,
    "commits" INTEGER,
    "changed_files" INTEGER,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY ("owner","repo","number"),
    UNIQUE ("owner","repo","number")
);

DROP TABLE IF EXISTS "Commits" CASCADE;
CREATE TABLE IF NOT EXISTS "Commits" (
    "owner" VARCHAR(128) NOT NULL,
    "repo" VARCHAR(100) NOT NULL,
    "number" INTEGER NOT NULL,
    "sha" VARCHAR(40) NOT NULL,
    "message" VARCHAR(40960),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY ("owner","repo","number") REFERENCES "PullRequests" ("owner","repo","number")
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    PRIMARY KEY ("owner","repo","number","sha"),
    UNIQUE ("owner","repo","number","sha")
);
DROP TABLE IF EXISTS "Files" CASCADE;
CREATE TABLE IF NOT EXISTS "Files" (
    "owner" VARCHAR(128) NOT NULL, 
    "repo" VARCHAR(100) NOT NULL, 
    "number" INTEGER NOT NULL, 
    "sha_commit" VARCHAR(40) NOT NULL, 
    "sha" VARCHAR(40) NOT NULL, 
    "filename" VARCHAR(4096) NOT NULL, 
    "status" VARCHAR(10) NOT NULL,
    FOREIGN KEY ("owner","repo","number","sha_commit") REFERENCES "Commits" ("owner","repo","number","sha")
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    PRIMARY KEY ("owner","repo","number","sha_commit","sha"),
    UNIQUE ("owner","repo","number","sha_commit","sha")
);
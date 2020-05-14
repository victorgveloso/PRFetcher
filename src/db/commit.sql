DROP TABLE IF EXISTS "Commits" CASCADE;
CREATE TABLE IF NOT EXISTS "Commits" (
    "owner" VARCHAR(255) NOT NULL,
    "repo" VARCHAR(255) NOT NULL,
    "number" INTEGER NOT NULL,
    "sha" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY ("owner","repo","number") REFERENCES "PullRequests" ("owner","repo","number")
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    PRIMARY KEY ("owner","repo","number","sha"),
    UNIQUE ("owner","repo","number","sha")
);
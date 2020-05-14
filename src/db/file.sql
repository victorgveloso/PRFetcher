DROP TABLE IF EXISTS "Files" CASCADE;
CREATE TABLE IF NOT EXISTS "Files" (
    "owner" VARCHAR(255) NOT NULL, 
    "repo" VARCHAR(255) NOT NULL, 
    "number" INTEGER NOT NULL, 
    "shaCommit" VARCHAR(255) NOT NULL, 
    "sha" VARCHAR(255) , 
    "path" VARCHAR(255), 
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
    FOREIGN KEY ("owner","repo","number","shaCommit") REFERENCES "Commits" ("owner","repo","number","sha")
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    PRIMARY KEY ("owner","repo","number","shaCommit","sha"),
    UNIQUE ("owner","repo","number","shaCommit","sha")
);
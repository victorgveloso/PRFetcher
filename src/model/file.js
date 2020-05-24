class File {
    constructor({owner, repo, number, sha_commit, sha, filename, status}) {
        this.owner = owner
        this.repo = repo
        this.number = number
        this.sha_commit = sha_commit
        this.sha = sha
        this.filename = filename
        this.status = status
    }
    static async fetch(client, owner, repo, number, sha_commit, sha) {
        try {
            let res = await client.query(`SELECT * FROM "Files" WHERE owner=$1 AND repo=$2 AND number=$3 AND sha_commit=$4 AND sha=$5`, [
                owner,
                repo,
                number,
                sha_commit,
                sha
            ])
            return new File(res.rows[0])
        } catch (err) {
            console.warn(err)
            return null
        }
    }
    save(client) {
        return client.query(`INSERT INTO "Files" VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [
            this.owner,
            this.repo,
            this.number,
            this.sha_commit,
            this.sha,
            this.filename,
            this.status
        ])
    }
}

module.exports = File
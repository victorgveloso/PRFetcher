class Commit {
    constructor({owner, repo, number, sha, message, created_at, updated_at}) {
        this.owner = owner
        this.repo = repo
        this.number = number
        this.sha = sha
        this.message = message.slice(0,40960) || ""
        this.created_at = created_at || "DEFAULT" 
        this.updated_at = updated_at || "DEFAULT"
    }
    static async fetch(client, owner, repo, number, sha) {
        try {
            let res = await client.query('SELECT * FROM "Commits" WHERE owner=$1 AND repo=$2 AND number=$3 AND sha=$4', [
                owner,
                repo,
                number,
                sha
            ])
            return new Commit(res.rows[0])
        } catch (err) {
            console.warn(err)
            return null
        }
    }
    clearDateSyntax(date){
        if (date !== "DEFAULT") {
            return `'${date}'`
        }
        return date
    }
    save(client) {
        return client.query(`INSERT INTO "Commits" VALUES ($1, $2, $3, $4, $5, ${this.clearDateSyntax(this.created_at)}, ${this.clearDateSyntax(this.updated_at)}) RETURNING *`, [
            this.owner,
            this.repo,
            this.number,
            this.sha,
            this.message,
        ])
    }
}
module.exports = Commit
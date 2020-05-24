class PullRequest {
    constructor({owner, repo, number, state, title, body, comments, commits, changed_files, created_at, updated_at}) {
        this.owner = owner
        this.repo = repo
        this.number = number
        this.state = state || "open"
        this.title = title.slice(0,255) || ""
        this.body = body.slice(0,65536) || ""
        this.comments = comments || 0
        this.commits = commits || 0
        this.changed_files = changed_files || 0
        this.created_at = created_at || "DEFAULT" 
        this.updated_at = updated_at || "DEFAULT"
    }
    static async fetch(client, owner, repo, number) {
        try {
            let res = await client.query('SELECT * FROM "PullRequests" WHERE owner=$1 AND repo=$2 AND number=$3', [
                owner,
                repo,
                number
            ])
            return new PullRequest(res.rows[0])
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
        return client.query(`INSERT INTO "PullRequests" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ${this.clearDateSyntax(this.created_at)}, ${this.clearDateSyntax(this.updated_at)}) RETURNING *`, [
            this.owner,
            this.repo,
            this.number,
            this.state,
            this.title,
            this.body,
            this.comments,
            this.commits,
            this.changed_files
        ])
    }
}
module.exports = PullRequest
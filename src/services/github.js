class Github {
    octokit
    owner
    repo

    constructor(octokit, owner, repo) {
        this.octokit = octokit
        this.owner = owner
        this.repo = repo
    }
    async* fetchPulls() {
        const pulls = await this.octokit.paginate(
            this.octokit.pulls.list, {
                owner: this.owner,
                repo: this.repo,
                base: "master",
                state: "closed",
                sort: "popularity",
                direction: "desc"
            }
        )
        try {
            for (p of pulls) {
                let pull = await this.octokit.pulls.get({
                    owner: this.owner,
                    repo: this.repo,
                    pull_number: p.number
                })
                try {
                    yield pull.data
                }
                catch(err) {
                    console.log(`Error status ${err}`)
                }
                
    
            }
        }
        catch(err) {
            console.log(`Error status ${err}`)
        }
    }
    
}
module.exports = Github
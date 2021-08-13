const PullRequest = require('../model/pullrequest')
const Commit = require('../model/commit')
const File = require('../model/file')
var fs = require('fs').promises

class Github {
    octokit
    owner
    repo
    constructor(octokit, owner, repo) {
        this.octokit = octokit
        this.owner = owner
        this.repo = repo
    }
    async fetchPull(number) {
        const pull = await this.octokit.pulls.get({
            owner: this.owner,
            repo: this.repo,
            pull_number: number
        })
        return new PullRequest({owner: this.owner, repo: this.repo, ...pull.data})
    }

    async getCache() {
        let pulls = null
        try {
            pulls = (await fs.readFile(`${this.owner}-${this.repo}.csv`,{encoding: "utf-8"})).split(',')
        } catch (error) {
            console.warn(`Could not read from file ${this.owner}-${this.repo}.csv: ${error}`)
        }
        return pulls
    }

    async createCache(pulls) {
        try {
            await fs.writeFile(`${this.owner}-${this.repo}.csv`,pulls.join(','),function(err) {
                if(err){
                    console.warn(`Error occurred trying to write to file:${err}`)
                }
            })
        } catch (error) {
            console.warn(`Could not write to file ${this.owner}-${this.repo}.csv: ${error}`)
        }
    }

    async fetchPullsNumber(opts) {
        let pulls = await this.getCache()
        
        if (!pulls){
            pulls = []
            for await (const pull_page of this.octokit.paginate.iterator(
                this.octokit.pulls.list, {
                    owner: this.owner,
                    repo: this.repo,
                    ...opts
                }
            )) {
                try {
                    for (const p of pull_page.data) {
                        pulls = [...pulls, p.number]
                    }
                } catch (err) {
                    console.warn(`Bad response! Expected pull page, obtained: ${pull_page}`)
                    console.warn(`Error status: ${err}`)
                }
            }
            await this.createCache(pulls)
        }
        return pulls
    }

    async *fetchPulls(db, opts) {
        let pulls = []
        try {
            pulls = await this.fetchPullsNumber(opts)
        } catch (err) {
            console.warn(`Trying to fetch pulls number from ${this.owner}/${this.repo}`)
            console.warn(`Error status ${err}`)
        }
        for (const p of pulls) {
            try {
                let fromDB = await PullRequest.fetch(db, this.owner, this.repo, p)
                if (fromDB === null) {
                    yield this.fetchPull(p)
                }
            } catch (error) {
                console.warn(`Unknown error occured while fetching pull ${p}: ${error}`)
            }
        }
    }

    async *fetchCommits({ // Limited to 100 commits
        owner,
        repo,
        number
    }) {
        try {
            const commits = (await this.octokit.pulls.listCommits({
                owner,
                repo,
                pull_number: number
            })).data
            for (let c of commits) {
                try {
                    yield new Commit({
                        owner,
                        repo,
                        number,
                        sha: c.sha,
                        message: c.commit.message,
                        tree: c.commit.tree.sha,
                        created_at: c.commit.author.date,
                        updated_at: c.commit.committer.date
                    })
                } catch (err) {
                    console.warn(`Failed to save commit ${c.sha} into db: ${err}`)
                }
            }
        } catch (err) {
            console.warn(`Failed to fetch commits from ${owner}/${repo} (#${number}): ${err}`)
        }
    }

    async *fetchChangedFiles({ // Limited to 300 files
        owner,
        repo,
        number,
        sha
    }) {
        try {
            const files = (await this.octokit.repos.getCommit({
                owner,
                repo,
                ref: sha
            })).data.files
            for (let f of files) {
                yield new File({
                    owner,
                    repo,
                    number,
                    sha_commit: sha,
                    sha: f.sha,
                    filename: f.filename,
                    status: f.status
                })
            }
        } catch (err) {
            console.warn(`Failed to fetch files ${owner}/${repo} (#${number} -> ${sha}): ${err}`)
        }
    }

}
module.exports = Github
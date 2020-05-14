const Github = require('./services/github')
const { Octokit } = require('@octokit/rest')

const octokit = new Octokit({ auth: "63ec59d1ae52d3f2b4710da01bc3b6b55e16d8d4" })
const owner = "spring-projects"
const repo = "spring-boot"
const github = new Github(octokit,owner,repo)

const db = require('./db/config')

/* (async () => {
    await db.connect()

    for await (pull of github.fetchPulls()) {
        // Insert
        console.log(`PR ${pull.number} have ${pull.changed_files} changed files, ${pull.commits} commits and ${pull.comments} comments`)
    }

    await db.end()
})() */

const {PullRequest, Tree, Commit} = require('./model')
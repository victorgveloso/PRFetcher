const Github = require('./services/github')
const {
    Octokit
} = require('@octokit/rest')
const {
    retry
} = require('@octokit/plugin-retry')
const {
    throttling
} = require('@octokit/plugin-throttling')

Octokit.plugin(retry)
Octokit.plugin(throttling)
const octokit = new Octokit({
    log: console,
    auth: process.env.AUTHKEY,
    request: {
        retries: 50,
        retryAfter: 10
    },
    retry: {
        doNotRetry: [
            400,
            401,
            404
        ]
    },
    throttle: {
        onRateLimit: (retryAfter, options) => {
            console.warn(`Trying to request ${options.method} ${options.url} (#${options.request.retryCount})...`)
            console.warn(`Rate limit exceeded, retrying after ${retryAfter} seconds`)
            return true
        },
        onAbuseLimit: (retryAfter, options) => {
            console.warn(`Trying to request ${options.method} ${options.url} (#${options.request.retryCount})...`)
            console.warn(`Abuse detection triggered, retrying after ${retryAfter} seconds`)
            return true
        }
    }
})
const owner = process.env.OWNER || "elastic"
const repo = process.env.REPO || "elasticsearch"
const github = new Github(octokit, owner, repo)
const db = require('./db/config')

async function saveFiles(commit) {
    for await (file of github.fetchChangedFiles(commit)) {
        try {
            await file.save(db)
            console.log(file)
        } catch (err) {
            console.warn(`Error ${err}`)
            console.warn(`Couldn't save File: ${file}`)
            continue
        }
    }
}
async function saveCommits(pull) {
    for await (commit of github.fetchCommits(pull)) {
        try {
            await commit.save(db)
            console.log(commit)
        } catch (err) {
            console.warn(`Error ${err}`)
            console.warn(`Couldn't save Commit: ${commit}`)
            continue
        }

        await saveFiles(commit)
    }
}
async function saveRemainingPulls() {
    let hasError
    do {
        try {
            for await (const pull of github.fetchPulls(db, {
                sort: "updated",
                direction: "desc",
                state: "all",
                per_page: 100
            })) {
                await (pull).save(db)
                console.log(pull)
                await saveCommits(pull)
            }
            hasError = false
        } catch (error) {
            console.warn(error)
            hasError = true
            await new Promise((res) => setTimeout(res, 1000))
        }
    } while (hasError);
}
async function finishIt() {
    await db.connect()
    await saveRemainingPulls()
    await db.end()
}

finishIt().then().catch(console.warn)
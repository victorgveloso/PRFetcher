const {
    Octokit
} = require('@octokit/rest')

let octokit
const owner = "elastic"
const repo = "elasticsearch"
beforeEach(() => {
    octokit = new Octokit({
        auth: process.env.AUTHKEY
    })
})
it('Should get all pull requests from spring-boot (without repetition)', async () => {
    let pulls = []
    for await (const pull_page of octokit.paginate.iterator(
        octokit.pulls.list, {
            owner,
            repo,
            state: "closed",
            per_page: 100
        }
    )) {
        for (const pull of pull_page.data) {
            let p = await octokit.pulls.get({
                owner,
                repo,
                pull_number: pull.number
            })
            pulls = [...pulls, p.data.number]
        }
    }
    let uniq = new Set(pulls)
    expect(uniq.size).toEqual(pulls.length)
    expect(pulls.length).toBeGreaterThanOrEqual(4199)
}, 300000)
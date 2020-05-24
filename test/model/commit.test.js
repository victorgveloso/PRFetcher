const client = require('../../src/db/config')
const Commit = require('../../src/model/commit')
const PullRequest = require('../../src/model/pullrequest')

describe("Given a commit", () => {
    stub = {
            owner: "victorgveloso",
            repo: "SpringBootDataExporter",
            number: 1,
            sha: "1f7280377f2cba6aef0a3b023fc649de00c025e9",
            message: "This is a test!"
        }
    beforeAll(async () => {
        await client.connect()
    })
    afterAll(async () => {
        await client.end()
    })
    beforeEach(async () => {
        await (new PullRequest({
            owner: "victorgveloso",
            repo: "SpringBootDataExporter",
            number: 1,
            state: "closed",
            title: "Test",
            body: "It's a test!",
            comments: 1,
            commits: 1,
            changed_files: 1
        })).save(client)
    })
    afterEach(async () => {
        await client.query('DELETE FROM "Commits"')
        await client.query('DELETE FROM "PullRequests"')
    })
    it("Shouldn't throw when saved to DB", async () => {
        let pr = new Commit(stub)
        try {
            await pr.save(client)
        } catch (error) {
            fail(error)
        }
    })
    it('Should be found after saving', async () => {
        let commit
        try {
            await (new Commit(stub)).save(client)
            commit = await Commit.fetch(client, "victorgveloso", "SpringBootDataExporter", 1, "1f7280377f2cba6aef0a3b023fc649de00c025e9")
        } catch (error) {
            fail(error)
        }
        expect(commit.owner).toBe("victorgveloso")
        expect(commit.repo).toBe("SpringBootDataExporter")
        expect(commit.number).toBe(1)
        expect(commit.sha).toBe("1f7280377f2cba6aef0a3b023fc649de00c025e9")
        expect(commit.message).toBe("This is a test!")
    })
})
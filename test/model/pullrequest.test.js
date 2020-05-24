const client = require('../../src/db/config')
const PullRequest = require('../../src/model/pullrequest')

describe("Given a pull request", () => {
    stub = {
            owner: "victorgveloso",
            repo: "SpringBootDataExporter",
            number: 1,
            state: "closed",
            title: "Test",
            body: "It's a test!",
            comments: 1,
            commits: 1,
            changed_files: 1
        }
    beforeAll(async () => {
        await client.connect()
    })
    afterAll(async () => {
        await client.end()
    })
    afterEach(async () => {
        await client.query('DELETE FROM "PullRequests"')
    })
    it("Shouldn't throw when saved to DB", async () => {
        let pr = new PullRequest(stub)
        try {
            await pr.save(client)
        } catch (error) {
            fail(error)
        }
    })
    it('Should be found after saving', async () => {
        let pr
        try {
            await (new PullRequest(stub)).save(client)
            pr = await PullRequest.fetch(client, "victorgveloso", "SpringBootDataExporter", 1)
        } catch (error) {
            fail(error)
        }
        expect(pr.owner).toBe("victorgveloso")
        expect(pr.repo).toBe("SpringBootDataExporter")
        expect(pr.number).toBe(1)
        expect(pr.title).toBe("Test")
        expect(pr.body).toBe("It's a test!")
        expect(pr.comments).toBe(1)
        expect(pr.commits).toBe(1)
        expect(pr.changed_files).toBe(1)
        expect(pr.state).toBe("closed")

    })
})
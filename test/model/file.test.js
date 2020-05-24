const client = require('../../src/db/config')
const File = require('../../src/model/file')
const Commit = require('../../src/model/commit')
const PullRequest = require('../../src/model/pullrequest')

describe("Given a file", () => {
    stub = {
            owner: "victorgveloso",
            repo: "SpringBootDataExporter",
            number: 1,
            sha_commit: "1f7280377f2cba6aef0a3b023fc649de00c025e9",
            sha: "ccd478404d2cb0ef2d62a898417dadd3f424c3b1",
            filename: "readme.md",
            status: "modified"
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
        await (new Commit({
            owner: "victorgveloso",
            repo: "SpringBootDataExporter",
            number: 1,
            sha: "1f7280377f2cba6aef0a3b023fc649de00c025e9",
            message: "This is test."
        })).save(client)
    })
    afterEach(async () => {
        await client.query('DELETE FROM "Files"')
        await client.query('DELETE FROM "Commits"')
        await client.query('DELETE FROM "PullRequests"')
    })
    it("Shouldn't throw when saved to DB", async () => {
        let pr = new File(stub)
        try {
            await pr.save(client)
        } catch (error) {
            fail(error)
        }
    })
    it('Should be found after saving', async () => {
        let file
        try {
            await (new File(stub)).save(client)
            file = await File.fetch(client, "victorgveloso", "SpringBootDataExporter", 1, "1f7280377f2cba6aef0a3b023fc649de00c025e9", "ccd478404d2cb0ef2d62a898417dadd3f424c3b1")
        } catch (error) {
            fail(error)
        }
        expect(file.owner).toEqual("victorgveloso")
        expect(file.repo).toEqual("SpringBootDataExporter")
        expect(file.number).toEqual(1)
        expect(file.sha_commit).toEqual("1f7280377f2cba6aef0a3b023fc649de00c025e9")
        expect(file.sha).toEqual("ccd478404d2cb0ef2d62a898417dadd3f424c3b1")
        expect(file.filename).toEqual("readme.md")
        expect(file.status).toEqual("modified")
    })
})
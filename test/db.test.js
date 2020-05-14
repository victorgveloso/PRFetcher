const sequelize = require("../src/db/config")
const PullRequest = require("../src/model/pullrequest")

describe("Given a PullRequest", () => {
    let SUT
    beforeEach(async () => {
        SUT = await PullRequest.build({
            owner: "victorgveloso",
            repo: "SpringBootDataExporter",
            number: 1,
            state: "closed",
            title: "Test",
            body: "It's a test!",
            comments: 1,
            commits: 1,
            changed_files: 1
        }, {
            isNewRecord: true
        })
    })
    afterAll(() => {
        return sequelize.close()
    })
    afterEach(async () => {
        await PullRequest.destroy({
            where: {
                owner: "victorgveloso",
                repo: "SpringBootDataExporter"
            },
            limit: 2
        })
    })
    it('Should be inserted without any error', async () => {
        try {
            await SUT.save()
        } catch (error) {
            fail(error)
        }
    })
    it('Should be found with same values', async () => {
        let PR
        try {
            await SUT.save()
            PR = await PullRequest.findOne({
                where: {
                    owner: "victorgveloso",
                    repo: "SpringBootDataExporter",
                    number: 1
                }
            })
        } catch (error) {
            fail(error)
        }
        expect(PR.owner).toBe("victorgveloso")
        expect(PR.repo).toBe("SpringBootDataExporter")
        expect(PR.number).toBe(1)
        expect(PR.state).toBe("closed")
        expect(PR.title).toBe("Test")
        expect(PR.body).toBe("It's a test!")
        expect(PR.comments).toBe(1)
        expect(PR.commits).toBe(1)
        expect(PR.changed_files).toBe(1)
    })
    it('Should be possible to add another PR from the same repo', async () => {
        let PRs
        try {
            await SUT.save()
        } catch (error) {
            fail(error)
        }
        try {
            await PullRequest.create({
                owner: "victorgveloso",
                repo: "SpringBootDataExporter",
                number: 2,
                state: "open",
                title: "Another test",
                body: "Is it a test?!",
                comments: 0,
                commits: 2,
                changed_files: 5
            }, {
                isNewRecord: true
            })
        } catch (error) {
            fail(error)
        }

        try {
            PRs = await PullRequest.findAll({
                where: {
                    owner: "victorgveloso",
                    repo: "SpringBootDataExporter"
                }
            })
            expect(PRs).toHaveLength(2)
        } catch (error) {
            fail(error)
        }

    })
})
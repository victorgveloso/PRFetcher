const Github = require('../src/services/github')
const {
    Octokit
} = require('@octokit/rest')

describe('Given a github connection', () => {
    let github
    const number = 4647
    const owner = "spring-projects"
    const repo = "spring-boot"
    beforeEach(() => {
        github = new Github(new Octokit({
            auth: process.env.AUTHKEY
        }), owner, repo)
    })
    it('Should get a valid pull request', async () => {
        let pull = await github.fetchPull(number)
        expect(pull.number).toEqual(number)
        expect(pull.state).toEqual("closed")
        expect(pull.title).toEqual("Ascii art banner generated from an image")
        expect(pull.body).toEqual('Add new ImageBanner class that generates ascii art with color based on\n' +
            'an image file (banner.gif, banner.jpg or banner.png). There are\n' +
            'configuration settings that go along with this:\n' +
            '- banner.image.dark: whether to invert image for a dark background.\n' +
            '  (default is false).\n' +
            '- banner.image.max-width: maximum width in characters of banner\n' +
            '  (default is 72).\n' +
            '- banner.image.aspect-ratio: correction to makes sure height is correct\n' +
            '  to accomodate the fact that fonts are taller than they are wide.\n' +
            '  (default is 0.5)\n')
        expect(pull.merged_at).toBeFalsy()
        expect(pull.created_at).toEqual('2015-11-30T17:57:22Z')
        expect(pull.updated_at).toEqual('2016-09-08T13:26:49Z')
        expect(pull.comments).toEqual(60)
        expect(pull.commits).toEqual(3)
        expect(pull.changed_files).toEqual(9)
        expect(pull.owner).toEqual(owner)
        expect(pull.repo).toEqual(repo)
    })
    it('Should get valid commits', async () => {
        let pull = await github.fetchPull(number)
        for await (let commit of github.fetchCommits(pull)) {
            expect(commit.owner).toEqual(owner)
            expect(commit.repo).toEqual(repo)
            expect(commit.number).toEqual(number)
            expect(commit.sha).toEqual(expect.any(String))
            expect(commit.sha).toHaveLength(40)
            expect(commit.message).toEqual(expect.any(String))
        }
    })
    it('Should get valid files', async () => {
        const commit = {
            owner: 'spring-projects',
            repo: 'spring-boot',
            number: 4647,
            sha: '83f13cb517e7eb947006dfc64cd8cfb3fadf6666',
            message: 'Merge pull request #1 from Shredder121/pr/4647\n' +
                '\n' +
                'Implement CIE94 color distance calculation',
            created_at: '2015-12-12T22:34:15Z',
            updated_at: '2015-12-12T22:34:15Z'
        }
        for await (let file of github.fetchChangedFiles(commit)) {
            expect(file.owner).toEqual(owner)
            expect(file.repo).toEqual(repo)
            expect(file.number).toEqual(number)
            expect(file.sha_commit).toEqual(commit.sha)
            expect(file.sha).toEqual(expect.any(String))
            expect(file.sha).toHaveLength(40)
            expect(file.filename).toEqual(expect.any(String))
            expect(file.status).toEqual(expect.any(String))
        }
    }, 6000)
})
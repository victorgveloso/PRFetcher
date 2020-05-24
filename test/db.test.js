const client = require('../src/db/config')

describe("Given a pull request", () => {
    beforeAll(async () => {
        await client.connect()
    })
    afterAll(async () => {
        await client.end()
    })
    it("", () => {
    })
})
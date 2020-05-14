const PullRequest = require('./pullrequest')
const Commit = require('./commit')
const File = require('./file')

PullRequest.hasMany(Commit, { foreignKey: 'owner' })
Commit.hasMany(File, { foreignKey: 'owner' })

PullRequest.sync({ force: true }).then(() => {
    console.log("Pull table created")
    Commit.sync({ force: true }).then(() => {
        console.log("Commit table created")
        File.sync({ force: true }).then(() => console.log("File table created"))
    })
}).then(() => {
    module.exports = {PullRequest, Commit, File}
}).catch(err => console.error(err))

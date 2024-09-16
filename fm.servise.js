const fs = require('node:fs/promises')
const path = require('node:path')


module.exports = {
    read: async () => {
        const pathToFile = path.join(__dirname, 'db.json')
        const data = await fs.readFile(pathToFile, "utf-8")
        console.log(pathToFile)
        // console.log(data)
        return data ? JSON.parse(data) : []

    },
    write: async (user) => {
        const pathToFile = path.join(__dirname, 'db.json')
        await fs.writeFile(pathToFile, JSON.stringify(user))
    }
}
const fetch = require('node-fetch');
const fs = require("fs")
const md5 = require('md5')

//const url = 'https://media.istockphoto.com/photos/portrait-of-pretty-indian-high-school-student-in-classroom-picture-id511353109?q=12'
// const url = 'https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?q=123'
// const url = 'https://scontent-waw1-1.cdninstagram.com/v/t51.2885-19/11850309_1674349799447611_206178162_a.jpg?_nc_ht=scontent-waw1-1.cdninstagram.com&_nc_ohc=1Lag4Wf4CXoAX_nkUsj&edm=ABfd0MgBAAAA&ccb=7-4&oh=5035465a2a1e4a93900fe9c06f06d7ea&oe=61775D04&_nc_sid=7bff83&q=12'

const url = 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Ash_Tree_-_geograph.org.uk_-_590710.jpg'

const response = fetch(url).then(async response => {
    let buf = await response.buffer()
    let hash = md5(buf, true)

    const dir = './img/' + hash.slice(0, 2)
    const file = hash.slice(2) + '.jpg'
    const path = `${dir}/${file}`

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(path, buf, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(`${url} saved to ${path}`)
        }
    })
})

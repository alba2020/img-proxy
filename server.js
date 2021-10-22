const express = require("express")
const fs = require("fs")
const path = require('path')
const fetch = require('node-fetch');
const md5 = require('md5')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json()); //Parse JSON-encoded bodies

app.use(express.static(__dirname + "/public"));
app.use('/img', express.static(path.join(__dirname, 'img')))


// async function download(url, path) {
//     const response = await fetch(url)
//     const buffer = await response.buffer()

//     fs.writeFile(path, buffer, function () {
//         console.log(`${url} saved to ${path}`)
//     })
// }

async function hashAndSave(url) {
    const response = await fetch(url)
    const buffer = await response.buffer()
    const hash = md5(buffer, true)

    const dir = 'img/' + hash.slice(0, 2)
    const file = hash.slice(2) + '.jpg'
    const path = `${dir}/${file}`

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(path, buffer, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(`${url} saved to ${path}`)
        }
    })

    return path
}

app.post('/api/save', async function (req, res) {
    const url = req.body.url
    if (!url) {
        res.json({ error: 'url is required' })
    } else {
        // await download(url, localPath(url))
        const path = await hashAndSave(url)
        res.send({ ok: '/' + path })
    }
})

// app.get('/api/cdn', async function (req, res) {
//     const url = req.query.url
//     if (!url) {
//         res.json({ error: 'url is required' })
//         return
//     }

//     path = localPath(url)

//     if (!fs.existsSync(path)) {
//         console.log('Downloading file...')
//         await download(url, path)
//     } else {
//         console.log(`File ${path} exists`)
//     }

//     res.redirect(webPath(url))
// })

const port = 6869
const server = app.listen(port, function () {
    console.log(`Listening on port ${port}`)
})


// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
var signals = {
    'SIGHUP': 1,
    'SIGINT': 2,
    'SIGTERM': 15
};
// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
    console.log("shutdown!");
    server.close(() => {
        console.log(`server stopped by ${signal} with value ${value}`);
        process.exit(128 + value);
    });
};

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
        console.log(`process received a ${signal} signal`);
        shutdown(signal, signals[signal]);
    });
});

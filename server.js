const express = require("express")
const fs = require("fs")
const path = require('path')
const fetch = require('node-fetch');
const md5 = require('md5')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.static(__dirname + "/public"));
app.use('/img', express.static(path.join(__dirname, 'img')))


async function download(url, filename) {
    const response = await fetch(url)
    const buffer = await response.buffer()
    fs.writeFile(filename, buffer, () =>
        console.log(`${url} saved to ${filename}`));
}

// url
app.post('/api/save', async function (req, res) {
    const url = req.body.url
    if (!url) {
        res.json({ error: 'url is required' })
    } else {
        await download(url, './img/first.jpg')
        res.send('done')
    }
})

app.get('/api/cdn', async function (req, res) {
    const url = req.query.url
    if (!url) {
        res.json({ error: 'url is required' })
        return
    }

    filename = md5(url) + '.jpg'
    localPath = './img/' + filename
    webPath = '/img/' + filename

    if (!fs.existsSync(localPath)) {
        console.log('Downloading file...')
        await download(url, localPath)
    } else {
        console.log(`File ${localPath} exists`)
    }

    res.redirect(webPath)
})

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

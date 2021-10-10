const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const XLSX = require('xlsx');
const _ = require('lodash');

const app = express();

app.use(
    cors(),
    fileUpload({
        createParentPath: true,
    })
);

app.get('/hello', cors(), (req, res) => {
    console.log('Hello Heroku!');
    res.status(200).json({
        message: 'Hello from root',
    });
});

app.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded',
            });
        } else {
            let upload = req.files.upload;
            let excel = readFile(upload);
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: upload.name,
                    mimetype: upload.mimetype,
                    size: upload.size,
                    excel: excel,
                },
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

function readFile(upload) {
    var workbook = XLSX.read(upload.data);
    console.log(workbook);
    var json = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'], null);
    console.log(JSON.stringify(json));
    return json;
}

//start app
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

app.listen(PORT, () => console.log(`App is listening on port ${HOST}:${PORT}`));

const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const whitelist = [
    'https://*.force.com',
    'https://me-lwc-recipes-dev-ed.lightning.force.com',
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
const bodyParser = require('body-parser');
const morgan = require('morgan');
const XLSX = require('xlsx');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(
    fileUpload({
        createParentPath: true,
    })
);

app.get('/hello', cors(corsOptions), (req, res) => {
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
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let upload = req.files.upload;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            //avatar.mv('./uploads/' + avatar.name);
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

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//start app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

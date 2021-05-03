var express = require('express');
var cors = require('cors');
var app = express();
var bodyparser = require('body-parser');
var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const CONFIG = require('../config');

const SESCONFIG = {
    apiVersion: '2010-12-01',
    region: CONFIG.AWS_SES_REGION
}

app.use(bodyparser.json());
app.use(cors());

const vaccinationData = require('../models/vaccination');


app.post('/addVaccination', async (req, res) => {
    let vaccinationModel = new vaccinationData(req.body);
    await vaccinationModel.save();
    res.json(vaccinationModel);
});

app.put('/checkVaccination', async (req, res) => {
    let vaccinationdata = await vaccinationData.find();
    if (vaccinationdata && vaccinationdata.length > 0) {
        vaccinationdata.forEach(data => {
            if (data.count != req.body.count) {
                if (req.body.count == 0 && data.count > 0) {
                    // sendEmail("Center unavailable");
                    vaccinationData.findOneAndUpdate(
                        { _id: data._id }, {
                            "$set":
                                { count: req.body.count }
                        },
                        { new: true },
                        (err, result) => {
                            if (err) {
                                res.send(err);
                            } else {
                                return res.json({ "message": "Center Unavailable" });
                            }
                        });
                } else if (req.body.count > 0 && data.count == 0) {
                    // sendEmail("Center available");
                    vaccinationData.findOneAndUpdate(
                        { _id: data._id }, {
                            "$set":
                                { count: req.body.count }
                        },
                        { new: true },
                        (err, result) => {
                            if (err) {
                                res.send(err);
                            } else {
                                return res.json({ "message": "Center Available" });
                            }
                        });
                } else {

                }


            } else {
                return res.json(vaccinationdata);
            }
        });
    } else {
        return res.json(vaccinationdata);
    }

});


app.post('/sendEmailVaccination', async (req, res) => {
    var params = {
        Destination: { /* required */
            ToAddresses: [
                'anjalyjkk021@gmail.com',
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: req.body.value
                },
                Text: {
                    Charset: "UTF-8",
                    Data: req.body.value
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: req.body.value
            }
        },
        Source: 'anjalyjkk021@gmail.com', /* required */
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES(SESCONFIG).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function (data) {
            return res.json({ "status": 200, "message": "Success" });
        }).catch(
            function (err) {
                return res.json({ "status": 400, "message": err });
            });
});

module.exports = app
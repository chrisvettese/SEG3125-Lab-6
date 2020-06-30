// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');

// read the data file
function readData(fileName) {
    let dataRead = fs.readFileSync('./data/' + fileName + '.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}

// read the data file
function writeData(info, fileName) {
    const data = JSON.stringify(info);
    fs.writeFileSync('./data/' + fileName + '.json', data);
}

// update the data file, I use "name" to be equal to fruit, or animal or color
// to match with the file names
// I assume we always just add 1 to a single item
function combineCounts(name, value) {
    // console.log(value);
    const info = readData(name);
    // will be useful for text entry, since the item typed in might not be in the list
    let found = 0;
    for (let i = 0; i < info.length; i++) {
        if (info[i][name] === value) {
            info[i].count = parseInt(info[i].count) + 1;
            found = 1;
        }
    }
    if (found === 0) {
        info.push({[name]: value, count: 1});
    }
    writeData(info, name);
}

// This is the controller per se, with the get/post
module.exports = function (app) {

    // when a user goes to localhost:3000/analysis
    // serve a template (ejs file) which will include the data from the data files
    app.get('/analysis', function (req, res) {
        const colour = readData("colour");
        const ease = readData("ease");
        const feature = readData("feature");
        const summarize = readData("summarize");
        const tracking = readData("tracking");
        const usage = readData("usage");
        res.render('showResults', {results: [colour, ease, feature, summarize, tracking, usage]});
        console.log([colour, ease, feature, summarize, tracking, usage]);
    });

    // when a user goes to localhost:3000/survey
    // serve a static html (the survey itself to fill in)
    app.get('/niceSurvey', function (req, res) {
        res.sendFile(__dirname + '/views/survey.html');
    });

    // when a user types SUBMIT in localhost:3000/survey
    // the action.js code will POST, and what is sent in the POST
    // will be recuperated here, parsed and used to update the data files
    app.post('/niceSurvey', urlencodedParser, function (req, res) {
        console.log(req.body);
        const json = req.body;
        for (const key in json) {
            console.log(key + ": " + json[key]);
            // in the case of checkboxes, the user might check more than one
            let fileName = key;
            if (key === "summarize[]") {
                fileName = "summarize";
            }
            //Special handling of checkboxes
            if ((key === "summarize[]")) {
                if (typeof json[key] === 'string') {
                    combineCounts(fileName, json[key]);
                } else {
                    for (const item in json[key]) {
                        combineCounts(fileName, json[key][item]);
                    }
                }
            } else {
                combineCounts(fileName, json[key]);
            }
        }
        // mystery line... (if I take it out, the SUBMIT button does change)
        // if anyone can figure this out, let me know!
        res.sendFile(__dirname + "/views/survey.html");
    });


};
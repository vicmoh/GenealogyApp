'use strict';

//dec vars
const ffi = require('ffi');//for the c lib
const ref = require("ref");//for the c pointer

var GEDCOMobject = ref.types.void;
var GEDCOMobjectPtr = ref.refType(GEDCOMobject);

//create the lib for c
let parserLib = ffi.Library("./parser/bin/parser.so", {
    // main writer gedcom
    "GEDCOMtoJSON": ["string", ["string"]],
    "createGEDCOMWrapper": [GEDCOMobjectPtr, ["string"]],
    "writeGEDCOMWrapper": ["void", ["string", GEDCOMobjectPtr]],
    //generation
    "descToJSON": ["string", ["string", "string", "string", "int"]],
    "anceToJSON": ["string", ["string", "string", "string", "int"]],
    //indivvidual
    "getIndiListJSON":["string", ["string"]],
    "addIndiJSON": ["void", ["string", "string", "string"]],
    //writer
    "writeString": ["void", ["string", "string"]],
    "getJSONString": ["string", ["string"]]
});

//testing the parser lib
function testParserLib(){
    var uploadNameTest = "./uploads/writeTest.ged";
    console.log("before calling parser lib");
    var fileNameTest = "./uploads/shakespeare.ged";
    var objectTest = parserLib.createGEDCOMWrapper(fileNameTest);
    console.log("middle calling parser lib");
    var stringTest = parserLib.descToJSON(fileNameTest, "William", "Shakespeare", 3);
    console.log(stringTest);
    parserLib.writeGEDCOMWrapper(uploadNameTest, objectTest);
    console.log("after calling parser lib");
    console.log("calling the create gedcom part 2");
    console.log("testing to read the uploaded file");
    var stringTest2 = parserLib.descToJSON(uploadNameTest, "William", "Shakespeare", 3);
    console.log(stringTest2);
    console.log("calling the parser PASSED");
}//end func

var fileNamesInJsonString = parserLib.getJSONString("./objects/listOfFileNames.json");
console.log("reading json list of file names: " + fileNamesInJsonString);
var listOfFileNames = JSON.parse(fileNamesInJsonString);
console.log("JSON.parse the file names: " + listOfFileNames);

/**********************************************************************
 * stubs
 **********************************************************************/

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');

app.use(fileUpload());

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
    //Feel free to change the contents of style.css to prettify your Web app
    res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
    fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
        const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
        res.contentType('application/javascript');
        res.send(minimizedContents._obfuscatedCode);
    });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
    if(!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    let uploadFile = req.files.uploadFile;
 
    // Use the mv() method to place the file somewhere on your server
    uploadFile.mv('uploads/' + uploadFile.name, function(err) {
        console.log(uploadFile.name);
        console.log("uploading file");
    if(err) {
        return res.status(500).send(err);
    }
        res.redirect('/');
    });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
    fs.stat('uploads/' + req.params.name, function(err, stat) {
        console.log(err);
        if(err == null) {
            res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
        } else {
            res.send('');
        }
    });
});

//******************** example code ******************** 

//Sample endpoint
app.get('/someendpoint', function(req , res){
    res.send({
        foo: "bar"
    });
});

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);

/**********************************************************************
 * my custom codes
 **********************************************************************/

//for the web assets
app.post('/assets', function(req, res) {
    if(!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    let uploadFile = req.files.uploadFile;
    uploadFile.mv('assets/' + uploadFile.name, function(err) {
    if(err) {
        return res.status(500).send(err);
    }
        res.redirect('/');
    });
});

//get request for the web assets just incase
app.get('/assets/:name', function(req , res){
    fs.stat('assets/' + req.params.name, function(err, stat) {
        console.log(err);
        if(err == null) {
            res.sendFile(path.join(__dirname+'/assets/' + req.params.name));
        } else {
            res.send('');
        }
    });
});

//for the web objects
app.post('/objects', function(req, res) {
    //for the list of file names
    var fileNameListPath = "./objects/listOfFileNames.json";
    var tempListOfFileNames = getListFileNames();
    writeJSONObjects(fileNameListPath, tempListOfFileNames);

    //file uploading
    if(!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    let uploadFile = req.files.uploadFile;
    uploadFile.mv('objects/' + uploadFile.name, function(err) {
    if(err) {
        return res.status(500).send(err);
    }
        res.redirect('/');
    });
});

//get request for the web objects
app.get('/objects/:name', function(req , res){
    fs.stat('objects/' + req.params.name, function(err, stat) {
        console.log(err);
        if(err == null) {
            res.sendFile(path.join(__dirname+'/objects/' + req.params.name));
        } else {
            res.send('');
        }
    });
});

/**********************************************************************
 * functions
 **********************************************************************/

function getListFileNames(){
    //dec vars
    var dir = './uploads'
    var fileList = [];
    //loop through and get the list of file names
    var files = fs.readdirSync(dir);
    for(var i in files){
        //if (!files.hasOwnProperty(i)) continue;
        var name = files[i];
        //if (!fs.statSync(name).isDirectory()){
        fileList.push(name);
        //}//end if
    }//end for
    return fileList;
}//end func

function writeJSONObjects(fileName, object){
    console.log("calling writeJSONObjects");
    fs.writeFile(fileName, JSON.stringify(object), (err) =>{
        if(err){
            console.log(err);
            console.log("error writing JSON objects");
            return;
        }//end if
    });
}//end func

function addFileNameToList(fileaName, list){
    console.log("calling addFileName = " + fileName);
    lsit.push(fileName);
    writeJSONObjects(JSONfileName, listOfFileName);
}//end func

function addIndividual(){
    console.log("calling addIndividual()");
    var GEDFileName = "./uploads/shakespeare.ged"
    var desc = parserLib.descToJSON(GEDFileName, "William", "Shakespeare", 0);
    parserLib.writeString(JSONFileName, desc);
}//end func

//write json of file objects
for(var x = 0; x<listOfFileNames.length; x++){
    var currentFile = "./objects/log-" + listOfFileNames[x];
    var currentGEDCOMFile = "./uploads/" + listOfFileNames[x];
    console.log("writing:" + currentFile + "...");
    var jsonString = parserLib.GEDCOMtoJSON(currentGEDCOMFile);
    parserLib.writeString(currentFile, jsonString);
}//end for

//write json of list of indi
for(var x = 0; x<listOfFileNames.length; x++){
    var currentFile = "./objects/indi-" + listOfFileNames[x];
    var currentGEDCOMFile = "./uploads/" + listOfFileNames[x];
    console.log("writing:" + currentFile + "...");
    var jsonString = parserLib.getIndiListJSON(currentGEDCOMFile);
    parserLib.writeString(currentFile, jsonString);
}//end for
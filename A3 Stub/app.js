// //'use strict'

// C library API
const ffi = require('ffi');

//typedef
const ref = require("ref");
var GEDCOMobject = ref.types.void;
var GEDCOMobjectPtr = ref.refType(GEDCOMobject);

//create the lib for c
let parserLib = ffi.Library("./parser/bin/parser.so", {
    // main writer gedcom
    "createGEDCOMWrapper": [GEDCOMobjectPtr, ["string"]],
    "writeGEDCOMWrapper": ["void", ["string", GEDCOMobjectPtr]],
    //generation
    "descToJSON": ["string", ["string", "string", "string", "int"]],
    "anceToJSON": ["string", ["string", "string", "string", "int"]],
    //indivvidual
    "getIndiListJSON":["string", ["string"]],
    "addIndiJSON": ["void", ["string", "string", "string"]],
    //writer
    "writeString": ["void", ["string", "string"]]
});

//my global vars'
var listOfFileName = [
    "minValid.ged",
    "shakespeare.ged",
    "simpleValid.ged"
];

//testing the parser lib
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

function addIndividual(){
    var JSONFileName = ".uploads/addIndiTest.json"
    var GEDFileName = "./uploads/shakespeare.ged"
    var desc = parerLib.descToJSON(GEDFileName, "William", "Shakespeare", 0);
    parserLib.writeString(JSONFileName, desc);
}//end func

addIndividual();

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

//for the web assets
app.post('/objects', function(req, res) {
    if(!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    let uploadFile = req.files.uploadFile;
    addIndividual();
    console.log("app post object called");
    uploadFile.mv('objects/' + uploadFile.name, function(err) {
    if(err) {
        return res.status(500).send(err);
    }
        res.redirect('/');
    });
});

//get request for the web assets just incase
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
 * test codes
 **********************************************************************/

 //for reference of the fucntion i created when coding
//ourRequest.open('GET', 'url') or 'POST'
    // // main writer gedcom
    // "createGEDCOMWrapper": [GEDCOMobjectPtr, ["string"]],
    // "writeGEDCOMWrapper": ["void", ["string", GEDCOMobjectPtr]],
    // //generation
    // "descToJSON": ["string", ["string", "string", "string", "int"]],
    // "anceToJSON": ["string", ["string", "string", "string", "int"]],
    // //indivvidual
    // "getIndiListJSON":["string", ["string"]],
    // "addIndiJSON": ["void", ["string", "string", "string"]]

// var uploadNameTest = "./uploads/writeTest.ged";

// console.log("before calling parser lib");
// var fileNameTest = "./uploads/shakespeare.ged";
// var objectTest = parserLib.createGEDCOMWrapper(fileNameTest);
// console.log("middle calling parser lib");
// var stringTest = parserLib.descToJSON(fileNameTest, "William", "Shakespeare", 3);
// console.log(stringTest);
// parserLib.writeGEDCOMWrapper(uploadNameTest, objectTest);
// console.log("after calling parser lib");

// console.log("calling the create gedcom part 2");
// console.log("testing to read the uploaded file");
// var stringTest2 = parserLib.descToJSON(uploadNameTest, "William", "Shakespeare", 3);
// console.log(stringTest2);
// console.log("calling the parser PASSED");

// function addIndividual(){
//     var uploadNameTest = "./uploads/writeTest.ged";

//     console.log("before calling parser lib");
//     var fileNameTest = "./uploads/shakespeare.ged";
//     var objectTest = parserLib.createGEDCOMWrapper(fileNameTest);
//     console.log("middle calling parser lib");
//     var stringTest = parserLib.descToJSON(fileNameTest, "William", "Shakespeare", 3);
//     console.log(stringTest);
//     parserLib.writeGEDCOMWrapper(uploadNameTest, objectTest);
//     console.log("after calling parser lib");

//     console.log("calling the create gedcom part 2");
//     console.log("testing to read the uploaded file");
//     var stringTest2 = parserLib.descToJSON(uploadNameTest, "William", "Shakespeare", 3);
//     console.log(stringTest2);
//     console.log("calling the parser PASSED");
// }//end func
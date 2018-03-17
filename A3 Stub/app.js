'use strict'

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
    "writeGEDCOMWrapper": ["void", ["string", GEDCOMobject]],
    //generation
    "descToJSON": ["string", ["string", "string", "string", "int"]],
    "anceToJSON": ["string", ["string", "string", "string", "int"]],
    //indivvidual
    "getIndiListJSON":["string", ["string"]],
    "addIndiJSON": ["void", ["string", "string", "string"]]
});

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
 
    // Use the mv() method to place the file somewhere on your server
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

//ourRequest.open('GET', 'url') or 'POST'

//for reference of the fucntion i created when coding
    // // main writer gedcom
    // "createGEDCOMWrapper": [GEDCOMobjectPtr, ["string"]],
    // "writeGEDCOMWrapper": ["void", ["string", GEDCOMobject]],
    // //generation
    // "descToJSON": ["string", ["string", "string", "int"]],
    // "anceToJSON": ["string", ["string", "string", "int"]],
    // //indivvidual
    // "getIndiListJSON":["string", ["string"]],
    // "addIndiJSON": ["void", ["string", "string", "string"]]

console.log("before calling parser lib");
var fileNameTest = "./uploads/shakespeare.ged";
var object = parserLib.createGEDCOMWrapper(fileNameTest);
console.log("middle calling parser lib");
var string = parserLib.descToJSON(fileNameTest, "William", "Shakespeare", 3);
console.log(string);
parserLib.writeGEDCOMWrapper("./uploads/writeTest.ged", object);
console.log("after calling parser lib");
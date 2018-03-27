/************************************************************
Name: Vicky Mohammad 
Date: March 4, 2018
Program: node and server
************************************************************/

'use strict';

//dec vars
const ffi = require('ffi');//for the c lib
const ref = require("ref");//for the c pointer

var GEDCOMobject = ref.types.void;
var GEDCOMobjectPtr = ref.refType(GEDCOMobject);

//create the lib for c
let parserLib = ffi.Library("./parser/bin/parser.so", {
    // main writer gedcom
    "newGEDCOM": [GEDCOMobjectPtr, ["string", "string", "string"]],
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

/**********************************************************************
 * sql
 **********************************************************************/

// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host     : 'dursley.socs.uoguelph.ca',
//     user     : 'mohammav',
//     password : '0895381',
//     database : 'mohammav'
// });
// connection.connect();

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

//post for the web assets
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

//get request for the web objects
app.get('/getFileList', function(req , res){
    //dec vars
    var tempListOfFileNames = getListFileNames();
    res.send(tempListOfFileNames);
});

//get request for the web objects
app.get('/getFileLogs', function(req , res){
    var fileNames = getListFileNames();
    var jsonString;
    var listOfFileLogObjects = [];
    for(var x=0; x<fileNames.length; x++){
        var currentFileName = "./uploads/" + fileNames[x];
        console.log("getFileLogs = " + currentFileName);
        var jsonString = parserLib.GEDCOMtoJSON(currentFileName);
        console.log("GEDCOMtoJSON did not crash");
        var tempFileLogObject = JSON.parse(jsonString);
        console.log(tempFileLogObject);
        listOfFileLogObjects.push(tempFileLogObject);
    }//end for
    res.send(listOfFileLogObjects);
    console.log(listOfFileLogObjects);
});

//get request for the web objects
app.get('/getIndiList', function(req , res){
    var selectedString = req.query.fileSelected;
    var filePath = "./uploads/" + selectedString;
    console.log("getIndiList file path = " + filePath);
    var jsonString = parserLib.getIndiListJSON(filePath);
    console.log("bonus string = " + jsonString);
    var jsonObject = JSON.parse(jsonString);
    res.send(jsonObject);
});

//get request for the web objects
app.get('/addIndiToList', function(req , res){
    console.log("calling addIndiToList");
    var file = req.query.fileSelected;
    var filePath = "./uploads/" + file;
    console.log("file path = " + filePath);
    var givenName = req.query.givenName;
    var surname = req.query.surname;
    console.log("given name: " + givenName + ", surname: " + surname);
    parserLib.addIndiJSON(filePath, givenName, surname);
    //using app.get instead of post just in case i might need something
    var dummy = [];
    res.send(dummy);    
});

//get request for the web objects
app.get('/getDescList', function(req , res){
    console.log("calling getDescList");
    var file = req.query.fileSelected;
    var filePath = "./uploads/" + file;
    console.log("filePath = " + filePath);
    var givenName = req.query.givenName;
    var surname = req.query.surname;
    var numGen = req.query.numGen;
    console.log("given name: " + givenName + ", surname: " + surname + ", numGen: " + numGen);
    var jsonString = parserLib.descToJSON(filePath, givenName, surname, numGen);
    console.log("jsonString = " + jsonString);
    var jsonObject = JSON.parse(jsonString);
    console.log("desc object:" + jsonObject);
    res.send(jsonObject);
});

//get request for the web objects
app.get('/getAnceList', function(req , res){
    console.log("calling getAnceList");
    var file = req.query.fileSelected;
    var filePath = "./uploads/" + file;
    console.log("filePath = " + filePath);
    var givenName = req.query.givenName;
    var surname = req.query.surname;
    var numGen = req.query.numGen;
    console.log("given name: " + givenName + ", surname: " + surname + ", numGen: " + numGen);
    var jsonString = parserLib.anceToJSON(filePath, givenName, surname, numGen);
    console.log("jsonString = " + jsonString);
    var jsonObject = JSON.parse(jsonString);
    console.log("ance object:" + jsonObject);
    res.send(jsonObject);
});

//get request for the web objects
app.get('/createGedcom', function(req , res){
    console.log("calling createGEDCOM");
    var file = req.query.fileName;
    var filePath = "./uploads/" + file + ".ged";
    console.log("filePath = " + filePath);
    var subName = req.query.subName;
    var subAddress = req.query.subAddress;
    var source = "Ancestry.com"
    console.log("sub name: " + subName + ", sub address: " + subAddress);
    var gedcomObject = parserLib.newGEDCOM(source, subName, subAddress);
    parserLib.writeGEDCOMWrapper(filePath, gedcomObject);
    // var jsonString = parseLib.GEDCOMtoJSON(filePath);
    // console.log("json string of new gedcom: " + jsonString);
    // var jsonObject = JSON.parse(jsonString);
    // res.send(jsonObject);
    var dummy = [];
    res.send(dummy);
});


app.get('/login', function (req, res){
    console.log("calling login");
    user = req.query.user;
    pass = req.query.pass;
    dbase = req.query.pass;
    const mysql = require('mysql');
    const connection = mysql.createConnection({
       host     : 'dursley.socs.uoguelph.ca',
       user     :  user,
       password :  pass,
       database :  dbase
    });
    connection.connect();
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
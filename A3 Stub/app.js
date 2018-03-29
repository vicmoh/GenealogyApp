/************************************************************
Name: Vicky Mohammad 
Date: March 4, 2018
Program: node and server
************************************************************/

'use strict';

//dec vars
const ffi = require('ffi');//for the c lib
const ref = require("ref");//for the c pointer
const mysql = require('mysql');

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
 * global variables
 **********************************************************************/

var connection;
var listOfFileLogObjects = [];

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
    for(var x=0; x<fileNames.length; x++){
        var currentFileName = "./uploads/" + fileNames[x];
        console.log("getFileLogs = " + currentFileName);
        var jsonString = parserLib.GEDCOMtoJSON(currentFileName);
        console.log("GEDCOMtoJSON did not crash");
        var tempFileLogObject = [];
        tempFileLogObject = JSON.parse(jsonString);
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
    var user = req.query.user;
    var pass = req.query.pass;
    var dbase = req.query.dbase;
    var result = false;
    console.log("app.js user = " + user + ", passID = " + pass + ", dbase = " + dbase);
    connection = mysql.createConnection({
        host     : 'dursley.socs.uoguelph.ca',
        user     :  user,
        password :  pass,
        database :  dbase
    });
    connection.connect(function(err) {
        if (err) {
            result = true;
            res.send(result);
            console.log("login failed!");
        }else{
            console.log("login successfully!");
            result = false;
            res.send(result);
        }
    });
});

app.get('/dbStoreFile', function (req, res){
    console.log("calling dbStoreFile");
    //create the table
    createFileTable();
    for(var x=0; x<listOfFileLogObjects.length; x++){
        //dec vars
        console.log("before SQL = " + listOfFileLogObjects[x]);
        var stringOfFileQuery = fileLogToSQL(listOfFileLogObjects[x]);
        console.log("stringOfFileQuery = ", stringOfFileQuery);
        connection.query(stringOfFileQuery, function (err, rows, fields) {
            if (err) {
                console.log("Something went wrong. "+err);
            }else{
                console.log("file table created successfully");
                
                // //connect the 
                // var fileName = listOfFileLogObjects.fileName;
                // var selectQuery = "SELECT file_id FROM FILE WHERE file_Name = " + fileName;
                
                // connection.query(selectQuery, function (err, rows, fields) {
                //     console.log("testing the select query: \n"+ err +" "+" "+ rows +" "+ fields);
                // });

            }//end if
        });
    }//end for

    //for indi
    createIndiTable();
    connection.query("SELECT * FROM FILE", function (err, rows, fields) {
        //Throw an error if we cannot run the query 
        if (err) 
            console.log("Something went wrong. "+err);
        else {
            console.log("Database contents:");
    
            //Rows is an array of objects.  Each object has fields corresponding to table columns
            for (let row of rows){
                var fileName = "./uploads/" + row.file_Name;
                var fileID = row.file_id;
                var numIndi = row.num_individuals
                console.log("inditable: fileName = "+fileName+" fileID = "+fileID);
                console.log("numIndi = " + numIndi);
                if(numIndi > 0){
                    var indiList = parserLib.getIndiListJSON(fileName);
                    var indiListObject = JSON.parse(indiList);
                    console.log("indiList = " + indiList);
                    console.log("indiList.length = " + indiListObject.length);
                    //inputing the indi table
                    for(var x=0; x<indiListObject.length; x++){
                        var inputIndiTableQuery = indiLogToSQL(indiListObject[x], fileID);
                        connection.query(inputIndiTableQuery, function (err, rows, fields) {
                            if (err) {
                                console.log("Something went wrong. "+err);
                            }else{
                                console.log("indi table created successfully");
                            }//end if
                        });
                    }//end for
                }//end if
            }//end for
        }//end if
    });
});

app.get('/dbClearFile', function (req, res){
    console.log("calling dbClearFile");
    var deleteTable = "DELETE FROM FILE;";
    connection.query(deleteTable);
});

app.get('/dbQueryInputs', function (req, res){
    console.log("calling dbQueryInputs");
    var queryInput = req.query.input;
    console.log("queryInput = " + queryInput);
    var data = [];
    connection.query(queryInput, function (err, rows, fields) {
        //Throw an error if we cannot run the query 
        if (err) 
            console.log("Something went wrong. "+err);
        else {
            console.log("Database contents:");
            
            //Rows is an array of objects.  Each object has fields corresponding to table columns
            for (let row of rows){
                data.push(row);
            }//end ffor
            res.send(data);
        }//end if
    });
});

app.get('/dbQueryOuputs', function (req, res){
    console.log("calling dbQueryOuputs");
    //dec vars
    var fileInfo = {fileNum: 0, indiNum: 0};
    //connect
    connection.query("SELECT * FROM FILE", function (err, rows, fields) {
        //Throw an error if we cannot run the query 
        if (err) 
            console.log("Something went wrong. "+err);
        else {
            console.log("Database contents:");
    
            //Rows is an array of objects.  Each object has fields corresponding to table columns
            for (let row of rows){
                fileInfo.fileNum = fileInfo.fileNum + 1;
                fileInfo.indiNum = fileInfo.indiNum + row.num_individuals;
                console.log("getNumberOfFileAndIndi = " + printDBstatus(fileInfo.fileNum, row.num_individuals));
            }//end ffor
            res.send(fileInfo);
        }//end if
    });
    console.log("dbaQueryOutputs: " + "fileNum = " + fileInfo.fileNum + " indiNum  = ", fileInfo.indiNum);
});


/**********************************************************************
 * functions
 **********************************************************************/

function printDBstatus(numData, numIndi){
    return "Database has " + numData + " files and " + numIndi + " individuals";
}//end func

function deleteFileTable(tableName){
    var deleteTable = "DELETE FROM " + tableName +";";
    connection.query(deleteTable);
}//end func

function createFileTable(){
    var createTable = "CREATE TABLE IF NOT EXISTS FILE (file_id INT AUTO_INCREMENT PRIMARY KEY, "
                    + "file_Name VARCHAR(60) NOT NULL, "
                    + "source VARCHAR(250) NOT NULL, "
                    + "version VARCHAR(10) NOT NULL, "
                    + "encoding VARCHAR(10) NOT NULL, "
                    + "sub_name VARCHAR(62) NOT NULL, "
                    + "sub_addr VARCHAR(256), "
                    + "num_individuals INT, "
                    + "num_families INT);";
    connection.query(createTable);
    deleteFileTable("FILE");
}//end func

function createIndiTable(){
    var createTable = "CREATE TABLE IF NOT EXISTS INDIVIDUAL (ind_id INT AUTO_INCREMENT PRIMARY KEY, "
                    + "surname VARCHAR(256) NOT NULL, "
                    + "given_name VARCHAR(256) NOT NULL, "
                    + "sex VARCHAR(1), "
                    + "fam_size INT, "
                    + "source_file INT);";
    connection.query(createTable);
    deleteFileTable("INDIVIDUAL");
}//end func

function indiLogToSQL(data, sourceFileID){
    console.log(data);
    var heading = "(surname, given_name, sex, fam_size, source_file)";
    var values = "('"+ data.surname + "', '"
                    + data.givenName + "', '"
                    + data.sex + "', '"
                    + data.famNum + "', '"
                    + sourceFileID + "')";
    var tableToBeInserted = "INSERT INTO INDIVIDUAL "+ heading +" VALUES "+ values +";";
    console.log(tableToBeInserted);
    return tableToBeInserted;
}//end func

function fileLogToSQL(data){
    var heading = "(file_Name, source, version, encoding, sub_name, sub_addr, num_individuals, num_families)";
    var values = "('"+ data.fileName.slice(10) + "', '"
                    + data.source + "', '"
                    + data.gedcVersion + "', '"
                    + data.encoding + "', '"
                    + data.subName + "', '"
                    + data.subAddress + "', '"
                    + data.indiNum + "', '"
                    + data.famNum + "')";
    var tableToBeInserted = "INSERT INTO FILE "+ heading +" VALUES "+ values +";";
    console.log(tableToBeInserted);
    return tableToBeInserted;
}//end func

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

function addFileNameToList(fileName, list){
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

function isEmptyObject(obj) {
    for(var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }//end if
    }//end for
    return true;
}//end func
/************************************************************
Name: Vicky Mohammad 
Date: March 4, 2018
Program: ajax and jquery
************************************************************/

// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    console.log("page has been loaded");
    var listOfFileNames = [];

    /******************************************************************************* 
     * My ajax code 
     *******************************************************************************/

    //ajax get the list of file names
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/getFileList',
        success: function (data) {
            console.log("file name = " + data);
            listOfFileNames = data;
            //add file names to the selected
            for(x = 0; x<listOfFileNames.length; x++){
                var currentFileName = "<option >"+listOfFileNames[x]+"</option>";
                $("select").append(currentFileName);
            }//end for
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });//end jquery

    //ajax get file logs
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/getFileLogs',
        success: function (data) {
            console.log("file logs = " + data);
            $(".fileLogTable tbody").remove();
            for(var x = 0; x<data.length; x++){
                var gedFileNameStringOnly = data[x].fileName.substring(10, data[x].fileName.length);
                var tableSections  = "<tbody><tr>"
                    +"<td><a class=\"setLightBlue\" href=\"" + data[x].fileName +"\">" + gedFileNameStringOnly + "</a></td>"
                    +"<td>" + data[x].source + "</td>"
                    +"<td>" + data[x].gedcVersion + "</td>"
                    +"<td>" + data[x].encoding + "</td>"
                    +"<td>" + data[x].subName + "</td>"
                    +"<td>" + data[x].subAddress + "</td>"
                    +"<td>" + data[x].indiNum + "</td>"
                    +"<td>" + data[x].famNum + "</td>"
                    +"</tr></tbody>"
                $(".fileLogTable").append(tableSections);
            }//end for
            if(data.length == 0 || isEmptyObject(data) == true){
                var tableSections  = "<tbody><th>NA</th></tr></tbody>"
                $(".fileLogTable").append(tableSections);
            }//end if
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });//end jquery

    /*******************************************************************************
     * My jquery code 
     *******************************************************************************/

    //smooth scrolling to setAnimateScroll
    $('.setAnimateScroll').on('click', function(event) {
        //make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            //prevent deafult anchor click behavior
            event.preventDefault();

            //store the hash
            var hash = this.hash;

            //using the jquery to call and animate the scroll by 800
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 1000, function(){
                // when done scrolling (default click behavior) add hash (#)
                window.location.hash = hash;
                console.log("calling animate scroll");
            });
        } // End if
    });//end jquery

    //creat a gedcom
    $('.createGedcom').on('click', function(event) {
        //get value
        console.log("createGedcom");
        var fileName = $(".fileNameCreateGed").val();
        var subName = $(".subNameCreateGed").val();
        var subAddress = $(".subAddressCreateGed").val();
        console.log("create ged form: " + fileName + subName + subAddress);
        appendStringToStatus("Creating a GEDCOM file...");
        //ajax get file logs
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/createGedcom',
            data: {fileName: fileName, subName: subName, subAddress: subAddress},
            success: function (data) {
                console.log("file logs = " + data);
                var tableSections  = "<tbody><tr>"
                    +"<td><a class=\"setLightBlue\" href=\"./uploads/" + fileName +".ged\">" + fileName + ".ged</a></td>"
                    +"<td>" + "Ancestry.com" + "</td>"
                    +"<td>" + "5.5" + "</td>"
                    +"<td>" + "ASCII" + "</td>"
                    +"<td>" + subName + "</td>"
                    +"<td>" + subAddress + "</td>"
                    +"<td>" + "0" + "</td>"
                    +"<td>" + "0" + "</td>"
                    +"</tr></tbody>"
                $(".fileLogTable").append(tableSections);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });//end jquery
        //clear the form
        var emptyString = "";
        $(".fileNameCreateGed").val(emptyString);
        $(".subNameCreateGed").val(emptyString);
        $(".subAddressCreateGed").val(emptyString);
        $("select option").remove();
        //ajax get the list of file names
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getFileList',
            success: function (data) {
                console.log("file name = " + data);
                listOfFileNames = data;
                //add file names to the selected
                for(x = 0; x<listOfFileNames.length; x++){
                    var currentFileName = "<option >"+listOfFileNames[x]+"</option>";
                    $("select").append(currentFileName);
                }//end for
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });//end jquery
        appendStringToStatus("GEDCOM \"" + fileName +"\" has been created.");
    });//end jquery

    //jquery for adding individual
    $('.addIndividual').on('click', function(event){
        //get element for the selected file menu
        console.log("calling ajax selection menu");
        var element = document.getElementById('indiFileSelection');
        var fileSelected = element.options[element.selectedIndex].text;
        console.log("file selected: " + fileSelected);
        //dec vars
        var emptyString = "";
        var firstName = "";
        var lastName = "";
        firstName = $(".addIndiFirstName").val();
        lastName = $(".addIndiLastname").val();
        // var sex = $('#addIndiSex').val();
        // var famSize = $('#addIndiFamSize').val();
        console.log("firstName = " + firstName);
        console.log("lastName = " + lastName);

        //error check of first name or last name is empty
        if(firstName.length > 0 && lastName.length > 0){
            //parse the file and send the data
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/addIndiToList',
                data: {fileSelected: fileSelected, givenName: firstName, surname: lastName},
                success: function (data) {
                    console.log("addIndiToList = (void?) " + data);
                    //not getting data right now but i may needed
                    appendStringToStatus("Adding " + givenName + " " + surname + " to the list of individual in " + fileSelected + ".");
                },
                fail: function(error) {
                    // Non-200 return, do something with error
                    console.log(error); 
                }
            });//end ajax
            
            //clear text
            $(".addIndiFirstName").val(emptyString);
            $(".addIndiLastname").val(emptyString);
            // $('#addIndiSex').val(emptyString);
            // $('#addIndiFamSize').val(emptyString);

            //refresh the indi table
            console.log("calling ajax selection menu");
            var element = document.getElementById('gedcomFileSelection');
            var fileSelected = element.options[element.selectedIndex].text;
            console.log("file selected: " + fileSelected);
            $(".indiTable tbody").remove();
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/getIndiList',
                data: {fileSelected: fileSelected},
                success: function (data) {
                    console.log("getIndiList object = " + data);
                    for(var x = 1; x<data.length; x++){
                        var tableSections  = "<tbody><tr>"
                            +"<td>" + x + "</td>"
                            +"<td>" + data[x].givenName + "</td>"
                            +"<td>" + data[x].surname + "</td>"
                            +"<td>" + data[x].sex + "</td>"
                            +"<td>" + data[x].famNum + "</td>"
                            +"</tr></tbody>"
                        $(".indiTable").append(tableSections);
                    }//end for
                },
                fail: function(error) {
                    // Non-200 return, do something with error
                    console.log(error); 
                }
            });//end ajax
        }else{
            appendStringToStatus("Failed Adding to the list of individual in " + fileSelected.substring(10, fileSelected.length) + ".");
            appendStringToStatus("First name and last name must be entered to add individual.");
        }    
    });//end jqeary

    //jquery for showing the indi
    $('.gedcomFileSelection').change('click', function(event){
        console.log("calling ajax selection menu");
        var element = document.getElementById('gedcomFileSelection');
        var fileSelected = element.options[element.selectedIndex].text;
        console.log("file selected: " + fileSelected);
        $(".indiTable tbody").remove();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getIndiList',
            data: {fileSelected: fileSelected},
            success: function (data) {
                console.log("getIndiList object = " + data);
                for(var x = 0; x<data.length; x++){
                    var tableSections  = "<tbody><tr>"
                        +"<td>" + x + "</td>"
                        +"<td>" + data[x].givenName + "</td>"
                        +"<td>" + data[x].surname + "</td>"
                        +"<td>" + data[x].sex + "</td>"
                        +"<td>" + data[x].famNum + "</td>"
                        +"</tr></tbody>"
                    $(".indiTable").append(tableSections);
                }//end for
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });//end ajax
    });//end jquery

    //jquery for showing the indi
    $('.searchDesc').on('click', function(event){
        //selection menu
        console.log("calling ajax selection menu");
        var element = document.getElementById('descFileSelection');
        var fileSelected = element.options[element.selectedIndex].text;
        console.log("file selected: " + fileSelected);
        //get value
        var givenName = $(".firstNameInputDesc").val();
        var surname = $(".lastNameInputDesc").val();
        var numGen = $(".numGenInputDesc").val();
        //remove the html body
        $(".genTable tbody").remove();
        if(numGen < 0){
            appendStringToStatus("Failed Searching for descendants, number of generation must be greater than 0.");
            var genNum = 1;
            var info = "Invalid input, please re-enter or continue...";
            var tableSections  = "<tbody><tr>"
                +"<td>" + genNum + "</td>"
                +"<td>" + info + "</td>"
                +"</tr></tbody>"
            $(".genTable").append(tableSections);
            return;
        }//end if
        //insert the new html body
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getDescList',
            data: {fileSelected: fileSelected, givenName: givenName, surname: surname, numGen: numGen},
            success: function (data) {
                console.log("get gen list object = " + data);
                for(var x = 0; x<data.length; x++){
                    var indiListString = "";
                    for(y = 0; y<data[x].length; y++){
                        var commaOrPeriod;
                        if(y==data[x].length-1){
                            commaOrPeriod = "."
                        }else{
                            commaOrPeriod = ", "
                        }//end if
                        indiListString = indiListString + data[x][y].givenName + " " + data[x][y].surname + commaOrPeriod;
                    }//end for
                    console.log("indi list = " + indiListString);
                    //append to the table
                    var genNum = x + 1;
                    var tableSections  = "<tbody><tr>"
                        +"<td>" + genNum + "</td>"
                        +"<td>" + indiListString + "</td>"
                        +"</tr></tbody>"
                    $(".genTable").append(tableSections);
                }//end for

                //check if data has value
                if(isEmptyObject(data) == true){
                    var genNum = 1;
                    var info = "NA";
                    var tableSections  = "<tbody><tr>"
                        +"<td>" + genNum + "</td>"
                        +"<td>" + info + "</td>"
                        +"</tr></tbody>"
                    $(".genTable").append(tableSections);
                }//end if
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });//end ajax
        appendStringToStatus("Searching " + numGen +" generation of " + givenName + " " + surname + "'s descendants.");
        //empty the form ones added
        var emptyString = "";
        $(".firstNameInputDesc").val(emptyString);
        $(".lastNameInputDesc").val(emptyString);
        $(".numGenInputDesc").val(emptyString);
    });//end jquery

    //jquery for showing the indi
    $('.searchAnce').on('click', function(event){
        //selection menu
        console.log("calling ajax selection menu");
        var element = document.getElementById('anceFileSelection');
        var fileSelected = element.options[element.selectedIndex].text;
        console.log("file selected: " + fileSelected);
        //get value
        var givenName = $(".firstNameInputAnce").val();
        var surname = $(".lastNameInputAnce").val();
        var numGen = $(".numGenInputAnce").val();
        //remove the html body
        $(".genTable tbody").remove();
        if(numGen < 0){
            appendStringToStatus("Failed Searching for ancestors, number of generation must be greater than 0.");
            var genNum = 1;
            var info = "Invalid input, please re-enter or continue...";
            var tableSections  = "<tbody><tr>"
                +"<td>" + genNum + "</td>"
                +"<td>" + info + "</td>"
                +"</tr></tbody>"
            $(".genTable").append(tableSections);
            return;
        }//end if
        //add new html body
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getAnceList',
            data: {fileSelected: fileSelected, givenName: givenName, surname: surname, numGen: numGen},
            success: function (data) {
                console.log("get gen list object = " + data);
                for(var x = 0; x<data.length; x++){
                    var indiListString = "";
                    for(y = 0; y<data[x].length; y++){
                        var commaOrPeriod;
                        if(y==data[x].length-1){
                            commaOrPeriod = "."
                        }else{
                            commaOrPeriod = ", "
                        }//end if
                        indiListString = indiListString + data[x][y].givenName + " " + data[x][y].surname + commaOrPeriod;
                    }//end for
                    console.log("indi list = " + indiListString);
                    //append to the table
                    var genNum = x + 1;
                    var tableSections  = "<tbody><tr>"
                        +"<td>" + genNum + "</td>"
                        +"<td>" + indiListString + "</td>"
                        +"</tr></tbody>"
                    $(".genTable").append(tableSections);
                }//end for

                //check if data has value
                if(isEmptyObject(data) == true){
                    var genNum = 1;
                    var info = "NA";
                    var tableSections  = "<tbody><tr>"
                        +"<td>" + genNum + "</td>"
                        +"<td>" + info + "</td>"
                        +"</tr></tbody>"
                    $(".genTable").append(tableSections);
                }//end if
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });//end ajax
        //reset the form to empty string
        appendStringToStatus("Searching " + numGen +" generation of " + givenName + " " + surname + "'s ancestors.");
        var emptyString = "";
        $(".firstNameInputAnce").val(emptyString);
        $(".lastNameInputAnce").val(emptyString);
        $(".numGenInputAnce").val(emptyString);
    });//end jquery

    //login
    $('#loginButtonID').click(function(event){
        console.log("calling loginID jquery");
        var user = $('#userID').val();
        var pass = $('#passID').val();
        var dbase = $('#dbaseID').val();
        console.log("user = " + user + ", passID = " + pass + ", dbase = " + dbase);
        var connectionFail = true;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/login',
            data: {user: user, pass: pass, dbase: dbase},
            success: function (data) {
                console.log("ajax pass returned = " + data);
                connectionFail = data;
                if(connectionFail == true){
                    alert("Invalid login");
                }else{
                    alert("Login successfull");
                }//end if
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log("ajax error returned = " + error); 
            }
        });//end ajax
        //empty the inputs
        var empty = "";
        $('#userID').val(empty);
        $('#passID').val(empty);
        $('#dbaseID').val(empty);
    });

    //store file logs to data base
    $('#storeAllFilesID').click(function(event){
        console.log("calling storeAllFilesID");
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/dbStoreFile',
            success: function (data) {
                console.log("ajax pass");
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log("ajax error returned = " + error); 
            }
        });//end ajax
        fileInfoAjax();
        event.preventDefault();
    });//end jquery

    //clear all files
    $('#clearAllDataID').click(function(event){
        console.log("calling storeAllFilesID");
        var queryFail = true;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/dbClearFile',
            success: function (data) {
                console.log("ajax pass = " + data);
                if(connectionFail == true){
                    alert("Invalid query");
                }else{
                    alert("Query successfull");
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log("ajax error returned = " + error); 
            }
        });//end ajax
        fileInfoAjax();
        appendStringToQueryStatus("All the table has been cleared in the data base");
        event.preventDefault();
    });//end jquery

    //clear all files
    $('#executeQueryID').click(function(event){
        console.log("calling textAreaQueryID");
        var input = $('#textAreaQueryID').val();
        console.log("input = " + input);
        fileInfoAjax();
        executeQueryAjax(input);
        //empty the text area
        var emptyString = "";
        $('#textAreaQueryID').val(emptyString);
    });//ennd  jquery

    //clear all files
    $('#selectQueryID').change('click', function(event){
        
    });//ennd  jquery

});//end doc ready jq

/*******************************************************************************
 * functions
 *******************************************************************************/

function appendToTable(data, toBeAppend){
    console.log("calling appendToQueryTable");
    //remove the items inside the table
    var thead = toBeAppend + "thead";
    var tbody = toBeAppend + "tbody";
    $(thead).remove();
    $(tbody).remove();

    //dev vars
    var header = "";
    var headerList = "";
    var body = "";
    var bodyList = "";

    //create the keys 
    var key = Object(data[0]).key;
    console.log("key = " + key);
    for(var x in key){
        var headerList = "<th>"+ key[x] +"</th>";
        header = "<thead><tr>" + headerList + "</tr></thead>";
    }//end for
    $(toBeAppend).append(header);
    console.log("header = " + header);

    //create the value
    for(var x in data){
        var value = Object(data[x]).value;
        for(var y in value){
            var bodyList = "<th>" + value + "</th>"
            body = "<tbody><tr>"+ bodyList + "</tbody><tr>";
        }//end for
    }//end for
    $(toBeAppend).append(body);
    console.log("body = " + body);
}//end func

function appendIndiTable(data, toBeAppend){
    console.log("calling appendIndiTable");
    //remove the items inside the table
    var thead = toBeAppend + "thead";
    var tbody = toBeAppend + "tbody";
    $(thead).remove();
    $(tbody).remove();
    //append the header
    var headerHtml = toBeAppend
        + "<thead>"
        + "<tr>"
        + "<th>#</th>"
        + "<th>Given Name</th>"
        + "<th>Surname</th>"
        + "<th>Sex</th>"
        + "<th>Family Size</th>"
        + "</tr>"
        + "</thead>"
    &(toBeAppend).append(headerHtml);
    //append the body
    for(var x = 1; x<data.length; x++){
        var tableSections  = "<tbody><tr>"
            +"<td>" + x + "</td>"
            +"<td>" + data[x].givenName + "</td>"
            +"<td>" + data[x].surname + "</td>"
            +"<td>" + data[x].sex + "</td>"
            +"<td>" + data[x].famNum + "</td>"
            +"</tr></tbody>"
        $(toBeAppend).append(tableSections);
    }//end for
}//end func

function appendFileTable(data, toBeAppend){
    console.log("calling appendFileTable");
    //remove the items inside the table
    var thead = toBeAppend + "thead";
    var tbody = toBeAppend + "tbody";
    $(thead).remove();
    $(tbody).remove();
    //append the header
    var headerHtml = toBeAppend
        + "<thead>"
        + "<tr>"
        + "<th>File Name</th>"
        + "<th>Source</th>"
        + "<th>GEDCOM Version</th>"
        + "<th>Encoding</th>"
        + "<th>Submitter Name</th>"
        + "<th>Submitter Address</th>"
        + "<th>Number of Individuals</th>"
        + "<th>Number of Families</th>"
        + "</tr>"
        + "</thead>";
    $(toBeAppend).append(headerHtml);
    //append the body
    for(var x = 0; x<data.length; x++){
        var gedFileNameStringOnly = data[x].fileName.substring(10, data[x].fileName.length);
        var tableSections  = "<tbody><tr>"
            +"<td><a class=\"setLightBlue\" href=\"" + data[x].fileName +"\">" + gedFileNameStringOnly + "</a></td>"
            +"<td>" + data[x].source + "</td>"
            +"<td>" + data[x].gedcVersion + "</td>"
            +"<td>" + data[x].encoding + "</td>"
            +"<td>" + data[x].subName + "</td>"
            +"<td>" + data[x].subAddress + "</td>"
            +"<td>" + data[x].indiNum + "</td>"
            +"<td>" + data[x].famNum + "</td>"
            +"</tr></tbody>";
        $(toBeAppend).append(tableSections);
    }//end for
}//end func 

function fileInfoAjax(){
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/dbQueryOuputs',
        success: function (data) {
            console.log("ajax pass");
            console.log("fileNum = " + data.fileNum + ", indiNum = " + data.indiNum);
            appendStringToStatus(printDBstatus(data.fileNum, data.indiNum));
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log("ajax error returned = " + error); 
        }
    });//end ajax
}//end func

function executeQueryAjax(input){
    console.log("calling executeQueryAjax");
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/dbQueryInputs',
        data: {input: input},
        success: function (data) {
            console.log("ajax pass");
            console.log("ajax data = " + data);
            appendToTable(data, '#queryTableID');
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log("ajax error returned = " + error); 
        }
    });//end ajax
}//end func

function appendStringToStatus(string){
    var statusString = "-> " + string + '\n';
    var myTextArea = $('#statusTextAreaID');
    myTextArea.val(myTextArea.val() + statusString);
}//edn func

function isEmptyObject(obj) {
    for(var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }//end if
    }//end for
    return true;
}//end func

function printDBstatus(numData, numIndi){
    return "Database has " + numData + " files and " + numIndi + " individuals";
}//end func

//logout when idle
// var time;
// $(document).on('mousemove keyup keypress', function(){
//     clearTimeout(time);
//     time=setTimeout(function(){
//         alert("Timed out, user has logged out");
//     }, 100000);//10 sec is 4 zeros
// });
// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    // On page-load AJAX Example
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/someendpoint',   //The server endpoint we are connecting to
        success: function (data) {
            /*  Do something with returned object
                Note that what we get is an object, not a string, 
                so we do not need to parse it on the server.
                JavaScript really does handle JSONs seamlessly
            */

            //We write the object to the console to show that the request was successful
            console.log(data); 
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });

    // Event listener form replacement example, building a Single-Page-App, no redirects if possible
    $('#someform').submit(function(e){
        e.preventDefault();
        $.ajax({});
    });
});

/*******************************************************************
 * my codes
 *******************************************************************/

var gedcomIndividual = {
    numberOfIndividual = 0,
    givenName: "",
    surname: "",
    sex: "",
    familySize: 0
}//end var

var gedcomObject = {
    fileName: "",
    source: "",
    gedcversion: 0,
    encoding: "",
    submitterName: "",
    submitterAddress: "",
    numberOfIndividuals: "",
    numberOfFamilies: ""
}//end var

function createGedcomIndiTable(individual){
    //dec vars for tables
    var table = document.createElement("table");
    var header = document.createElement("tr");
    //dec cell vars
    var givenNameCell = document.createElement("th");
    var surnameCell = document.createElement("th");
    var sexCell = document.createElement("th");
    var familySizeCell = document.createElement("th");
    //append all cell
    header.appendChild(givenNameCell);
    header.appendChild(surnameCell);
    header.appendChild(sexCell);
    header.appendChild(familySizeCell);
    //create the table
    table.appendChild(header);
}
// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    console.log("page has been loaded");
    // // On page-load AJAX Example
    // $.ajax({
    //     type: 'get',            //Request type
    //     dataType: 'json',       //Data type - we will use JSON for almost everything 
    //     url: '/someendpoint',   //The server endpoint we are connecting to
    //     success: function (data) {
    //         /*  Do something with returned object
    //             Note that what we get is an object, not a string, 
    //             so we do not need to parse it on the server.
    //             JavaScript really does handle JSONs seamlessly
    //         */

    //         //We write the object to the console to show that the request was successful
    //         console.log(data); 
    //     },
    //     fail: function(error) {
    //         // Non-200 return, do something with error
    //         console.log(error); 
    //     }
    // });

    /*******************************************************************************
     * My ajax code 
     *******************************************************************************/

    // //ajax get the list of file names
    // $.ajax({
    //     type: 'get',
    //     dataType: 'json',
    //     url: '/objects/listOfFileNames.json',   
    //     success: function (data) {
    //         console.log("ajax fileName are " + data);
    //         var listOfFileNames = data;
    //         //add file names to the selected
    //         for(x = 0; x<listOfFileNames.length; x++){
    //             currentFileName = "<option>"+listOfFileNames[x]+"</option>";
    //             $("select").append(currentFileName);
    //             console.log("listing all the file:");
    //             console.log(currentFileName);
    //         }//end for
    //         location.reload();
    //     },
    //     fail: function(error) {
    //         // Non-200 return, do something with error
    //         console.log(error); 
    //     }
    // });

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
    });

    //jquery for adding individual
    $('.addIndividual').on('click', function(event){
        //dec vars
        var emptyString = "";
        var firstName = $('#addIndiFirstName').val();
        var lastName = $('#addIndiLastname').val();
        var sex = $('#addIndiSex').val();
        var famSize = $('#addIndiFamSize').val();
        console.log("firstName = " + firstName);
        console.log("lastName = " + lastName);
        console.log("sex = " + sex);
        console.log("famSize = " + famSize);
        //parse the file to test

        //clear text
        $('#addIndiFirstName').val(emptyString);
        $('#addIndiLastname').val(emptyString);
        $('#addIndiSex').val(emptyString);
        $('#addIndiFamSize').val(emptyString);
    });
});

$(document).ready(function() {
    //dec vars
    console.log("ajax loaded");
    var listOfFileNames = [];
    
    //ajax get the list of file names
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/objects/listOfFileNames.json',   
        success: function (data) {
            console.log("ajax fileName are " + data);
            listOfFileNames = data;
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });
    
    //add file names to the selected
    for(x = 0; x<listOfFileNames.length; x++){
        currentFileName = "<option>"+listOfFileNames[x]+"</option>";
        $("select").append(currentFileName);
        console.log("listing all the file:");
        console.log(currentFileName);
    }//end for
});
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
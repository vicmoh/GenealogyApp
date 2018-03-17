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
    // $('#someform').submit(function(e){
    //     e.preventDefault();
    //     $.ajax({});
    // });

    // $("statusPanelID").click(function(e){       
    //     e.preventDefault();
    //     $('html,body').animate({scrollTop:$(this.hash).offset().top}, "slow");
    // });
});

/*******************************************************************************
 * My jquery code 
 *******************************************************************************/

//Add smooth scrolling on all links inside the navbar
$(document).ready(function(){
    // Add smooth scrolling to animateScoll
    $('.setAnimateScroll').on('click', function(event) {
        console.log("calling animate scroll");
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
            });
        } // End if
    });
});

$(document).ready(function(){
     //jquery for adding a individual
    // //Get
    // var bla = $('#txt_name').val();
    // //Set
    // $('#txt_name').val(bla);
    $('.addIndividual').on('click', function(event){
        var firstName = $('#addIndiFirstName').val;
        var lastName = $('#addIndiLastname').val;
        var sex = $('#addIndiSex').val;
        var famSize = $('#addIndiFamSize').val;
        console.log(firstName);
        console.log(lastName);
    });
});
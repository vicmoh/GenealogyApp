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
                currentFileName = "<option>"+listOfFileNames[x]+"</option>";
                $("select").append(currentFileName);
            }//end for
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });
    //ajax get file logs
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/getFileLogs',
        success: function (data) {
            console.log("file logs = " + data);
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
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });

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
        
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/addIndiToList',
            success: function (data) {
                console.log("addIndiToList = " + data);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });
        
        //clear text
        $('#addIndiFirstName').val(emptyString);
        $('#addIndiLastname').val(emptyString);
        $('#addIndiSex').val(emptyString);
        $('#addIndiFamSize').val(emptyString);
    });

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
                        +"</tr></tbody>"
                    $(".indiTable").append(tableSections);
                }//end for
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });
    });

    //jquery for showing the indi
    $('.searchDesc').on('click', function(event){
        //selection menu
        console.log("calling ajax selection menu");
        var element = document.getElementById('descFileSelection');
        var fileSelected = element.options[element.selectedIndex].text;
        console.log("file selected: " + fileSelected);
        //get username value
        var givenName = $(".firstNameInput").val();
        var surname = $(".lastNameInput").val();
        var numGen = $(".numGenInput").val();
        //get last name value
        $(".genTable tbody").remove();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getDescList',
            data: {fileSelected: fileSelected, givenName: givenName, surname: surname, numGen: numGen},
            success: function (data) {
                console.log("get gen list object = " + data);
                // for(var x = 0; x<data.length; x++){
                //     var indiListString;
                //     for(y = 0; y<data[x].length; y++){
                //         var commaOrPeriod;
                //         if(y==data[x].length-1){
                //             commaOrPeriod = "."
                //         }else{
                //             commaOrPeriod = ", "
                //         }//end if
                //         indiListString = indiListString + data[x][y] + commaOrPeriod;
                //     }//end for
                //     console.log("indi list = " + indiListString);
                //     //append to the table
                //     var tableSections  = "<tbody><tr>"
                //         +"<td>" + x + "</td>"
                //         +"<td>" + indiListString + "</td>"
                //         +"</tr></tbody>"
                //     $(".genTable").append(tableSections);
                // }//end for
            },
            fail: function(error) {
                // Non-200 return, do something with error
                console.log(error); 
            }
        });
    });
});
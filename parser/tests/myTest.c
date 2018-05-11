/**
 * @file helperFunctions.h
 * @author Vicky Mohammad
 * @date 2018
 * @brief My main for general helper functions to help coding c easier
 */

//include libs 
#include "GEDCOMparser.h"
#include "GEDCOMutilities.h"

//macros
#define DEBUG_TEST true

//main program to be able to run
int main( int argc, char **argv){
    char fileName[99];
    strcpy(fileName, argv[1]); 
    if(DEBUG_TEST)printf("******************************************************TESTING OBJECT\n");
    
    //note that free is not tested
    GEDCOMobject* testObject = NULL;
    GEDCOMerror error = initError(OK, -1); 
    error = createGEDCOM(fileName, &testObject);
    //print the error
    char* printErrorString  = printError(error);
    if(DEBUG_TEST)printf("%s", printErrorString );
    free(printErrorString);

    //print the testObjec 
    char* printObject = printGEDCOM(testObject);
    if(DEBUG_TEST)printf("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n%s", printObject);  
    free(printObject);

    //check the get descendant
    printf("----------------------------------------------------------------------TESTING GET DESCENDANTS\n");
    Individual* searchIndi = initIndividual();
    searchIndi->givenName = setString("Agnes");
    searchIndi->surname = setString("Webbe");
    List testDescendants = getDescendants(testObject, searchIndi);
    char* testIList = iListToJSON(testDescendants);
    char* printChildren = toString(testDescendants);
    printf("\nPrinting children from toString test main\n");
    printf("%s\n", printChildren);
    printf("Testing the iListToJSON function:\n%s\n\n", testIList);
    free(testIList);
    free(printChildren);
    deleteIndividual(searchIndi);
    clearList(&testDescendants);

    //testing for get generation
    printf("----------------------------------------------------------------------TESTING GET GENERATION\n");
    int gen = 9999;
    Individual* searchIndiGen = initIndividual();
    searchIndiGen->givenName = setString("Agnes");
    searchIndiGen->surname = setString("Webbe");
    List testGeneration = getDescendantListN(testObject, searchIndiGen, gen);
    char* printGeneration = toString(testGeneration);
    char* testingGListString = gListToJSON(testGeneration);
    printf("\nTesting get %d generation of %s %s\n", gen, searchIndiGen->givenName, searchIndiGen->surname);
    printf("%s", printGeneration);
    printf("Testing gListToJSON function:\n%s\n\n", testingGListString);
    free(testingGListString);
    free(printGeneration);
    clearList(&testGeneration);
    deleteIndividual(searchIndiGen);

    //testing for get ascendance
    printf("----------------------------------------------------------------------TESTING GET ANCESTOR\n");
    int genA = 9999;
    Individual* searchIndiGenA = initIndividual();
    searchIndiGenA->givenName = setString("Elizabeth");
    searchIndiGenA->surname = setString("Shakespeare");
    List testGenerationA = getAncestorListN(testObject, searchIndiGenA, genA);
    char* printGenerationA = toString(testGenerationA);
    printf("\nTesting get %d ancestor of %s %s\n", genA, searchIndiGenA->givenName, searchIndiGenA->surname);
    printf("%s", printGenerationA);
    free(printGenerationA);
    clearList(&testGenerationA);
    deleteIndividual(searchIndiGenA);

    //testing the json file
    printf("----------------------------------------------------------------------TESTING JSON\n");
    //testing if it create the string from object
    Individual* tempIndiForJSON = initIndividual();
    tempIndiForJSON->givenName = setString("Elizabeth");
    tempIndiForJSON->surname = setString("Shakespeare");
    char* indiJSONString = indToJSON(tempIndiForJSON);
    printf("Testing indToJSON: %s\n", indiJSONString);

    //testing by pasing the string if it create the object
    Individual* JSONIndiResult = JSONtoInd(indiJSONString);
    char* JSONtoIndString = printIndividualName(JSONIndiResult);
    printf("JSONtoInd result: %s\n", JSONtoIndString);

    free(JSONtoIndString);
    free(indiJSONString);
    deleteIndividual(JSONIndiResult);
    deleteIndividual(tempIndiForJSON);

    //testing the object
    char* testJSONtoGEDCOMString = setString("{\"source\":\"sourceTest.com\",\"gedcVersion\":\"5.5\",\"encoding\":\"ASCII\",\"subName\":\"vic\",\"subAddress\":\"pi lab\"}");
    GEDCOMobject* testObjFromJSON = JSONtoGEDCOM(testJSONtoGEDCOMString);
    free(testJSONtoGEDCOMString);

    char* debugString = calloc(1, sizeof(char)*256*6);
    char* debugHeader = calloc(1, sizeof(char)*256*3);
    char* debugEncoding = printEncoding(testObjFromJSON->header->encoding);
    char* debugSubmitter = printSubmitter(testObjFromJSON->submitter);
    sprintf(debugHeader, "Header source: %s\nHeader version: %0.2lf\nHeader encoding: %s\n", testObjFromJSON->header->source, testObjFromJSON->header->gedcVersion, debugEncoding);
    strcat(debugString, debugHeader);
    strcat(debugString, debugSubmitter);
    debug("debug JSONtoGEDCOM:\n%s\n", debugString);
    free(debugString);
    free(debugHeader);
    free(debugEncoding);
    free(debugSubmitter);
    deleteGEDCOM(testObjFromJSON);
    
    //cheking writing the gedcom is working
    printf("----------------------------------------------------------------------TESTING WRITE GEDCOM\n");
    error = writeGEDCOM("./assets/writeFile.ged", testObject);
    char* errorString = printError(error);
    printf("Writing error:\n%s\n", errorString);
    free(errorString);

    //cheking writing the gedcom is working
    printf("----------------------------------------------------------------------TESTING INDI FAMILIES\n");

    //testing if it create the string from object
    Individual* testIndiFamList = initIndividual();
    testIndiFamList->givenName = setString("John");
    testIndiFamList->surname = setString("Shakespeare");
    Individual* testPerson = findPerson(testObject, comparePerson, testIndiFamList);
    //char* testIndiFamString = toString(testPerson->families);
    //printf("Testing Individual Families: %s\n", testIndiFamString);
    printf("Number of Families: %d\n\n", getLength(testPerson->families));
    deleteIndividual(testIndiFamList);

    //cheking EXTRA
    printf("----------------------------------------------------------------------TESTING EXTRA\n");
    printf("Testing JSON to Indi\n");
    Individual* testJSONtoIndi = JSONtoInd("{\"givenName\":\"Roger\",\"surname\":\"\"");
    char* testJSONtoIndiString = printIndividual(testJSONtoIndi);
    printf("%s\n", testJSONtoIndiString);
    free(testJSONtoIndiString);

    printf("Testing indi to JSON\n");
    char* testInditoJSONStringAgain = indToJSON(testJSONtoIndi);
    printf("%s\n\n", testInditoJSONStringAgain);
    free(testInditoJSONStringAgain);
    deleteIndividual(testJSONtoIndi);

    printf("Testings JSON to GEDCOM\n");
    GEDCOMobject* testJSONtoGEDCOM = JSONtoGEDCOM("{\"source\":\"Blah\",\"gedcVersion\":\"5.5\",\"encoding\":\"ASCII\",\"subName\":\"Some dude\",\"subAddress\":\"nowhere\"}");
    if(testJSONtoGEDCOM == NULL){
        printf("GEDCOM == NULL");
    }//end if
    printf("GEDCOM Header Sub:\n");
    char* GEDheader = printSubmitter(testJSONtoGEDCOM->header->submitter);
    printf("%s\n", GEDheader);
    free(GEDheader);
    printf("GEDCOM Submitter\n");
    char* GEDsub = printSubmitter(testJSONtoGEDCOM->submitter);
    printf("%s\n", GEDsub);
    free(GEDsub);
    printf("GEDCOM Object\n");
    char* GEDGED = printGEDCOM(testJSONtoGEDCOM);
    printf("%s\n", GEDGED);
    free(GEDGED);
    deleteGEDCOM(testJSONtoGEDCOM);

    printf("Testing ilist when null\n");
    List emptyList = initializeList(dummyPrint, freeObject, dummyCompare);
    char* ilistNUllString = iListToJSON(emptyList);
    printf("|%s|\n", ilistNUllString);
    free(ilistNUllString);
    printf("Testing glist when null\n");
    char* glistNULLString = gListToJSON(emptyList);
    printf("|%s|\n", glistNULLString);
    free(glistNULLString);

    //delete
    deleteGEDCOM(testObject);
    printf("----------------------------------------------------------------------TESTING DONE\n");
    
    //exit main
    return 0;
}//end main

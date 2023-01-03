const jpdbBaseURL= 'http://api.login2explore.com:5577';
const jpdbIRL= '/api/irl';
const jpdbIML= '/api/iml';
const empDBName= 'SCHOOL-DB';
const empRelationName= 'STUDENT-TABLE';
const connToken= '90938160|-31949273054817040|90955227';

function saveRecNo2LS(jsonObj){
    let lvData=JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}

function getStudentRollAsJsonObj(){
    let sroll=$("#roll").val();
    let jsonStr={
        roll: sroll
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    let record=JSON.parse(jsonObj.data).record;
    $("#roll").val(record.roll);
    $("#name").val(record.name);
    $("#class").val(record.class);
    $("#date").val(record.dob);
    $("#address").val(record.address);
    $("#edate").val(record.edate);
}

function resetForm() {
    $("#roll").val("");
    $("#name").val("");
    $("#class").val("");
    $("#date").val("");
    $("#address").val("");
    $("#edate").val("");
    $("#roll").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#roll").focus();
}



function getStudent(){
    let studentRollJsonObj = getStudentRollAsJsonObj();
    let getRequest= createGET_BY_KEYRequest(connToken,empDBName,empRelationName,studentRollJsonObj);
    jQuery.ajaxSetup({async: false});
    let resJsonObj=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
    $("#save").prop("disabled",false);
    $("#reset").prop("disabled",false);
    $("#name").focus();
    }

    else if(resJsonObj.status === 200){
    $("#roll").prop("disabled",true);
    fillData(resJsonObj);
    $("#change").prop("disabled",false);
    $("#reset").prop("disabled",false);
    $("#name").focus();
    }
}

function validateData(){
    let sroll, sname, sclass, sdate, saddress, sedate;
    sroll = $("#roll").val();
    sname=$("#name").val();
    sclass=$("#class").val();
    sdate=$("#date").val();
    saddress=$("#address").val();
    sedate=$("#edate").val();

    if(sroll==''){
        alert('Student Roll No. Missing');
        $("#roll").focus();
        return "";
    }
    if(sname==''){
        alert('Student Name Missing');
        $("#name").focus();
        return "";
    }
    if(sclass==''){
        alert('Student Class Missing');
        $("#class").focus();
        return "";
    }
    if(sdate==''){
        alert('Student Date Of Birth Missing');
        $("#date").focus();
        return "";
    }
    if(saddress==''){
        alert('Student Address Missing');
        $("#address").focus();
        return "";
    }
    if(sedate==''){
        alert('Student Enrollment Date Missing');
        $("#edate").focus();
        return "";
    }
    
    let jsonStrObj ={
        roll: sroll,
        name: sname,
        class: sclass,
        address: saddress,
        dob: sdate,
        edate: sedate
    };
    return JSON.stringify(jsonStrObj);

}

function saveData(){
    let jsonStrObj=validateData();
    if(jsonStrObj===''){
        return "";
    }
    let putRequest= createPUTRequest(connToken,jsonStrObj,empDBName,empRelationName);
    jQuery.ajaxSetup({async: false});
    let resJsonObj=executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#roll").focus();
}

function changeData(){
    $("#change").prop("disabled",true);
    let jsonChg= validateData();
    let updateRequest= createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName,localStorage.getItem("rec_no"));
    jQuery.ajaxSetup({async: false});
    let resJsonObj=executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#roll").focus();
}
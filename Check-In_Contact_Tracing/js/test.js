/**
 * Copyright by NAUFAL MOHAMED NOORI
 * Created on 15 July 2020
 * Contact: +6018-3992400
 * Katalyst Data Management
 */

/**
 * A handler function to prevent default submission and run our custom script.
 * @param  {Event} event  the submit event triggered by the user
 * @return {void}
 * 
 */

var kdmHtmlStatus;
var mySejahteraHtmlStatus;
var queryFever;
var queryZone;


document.getElementById("submitForm").addEventListener("click", loadHTML);

async function loadHTML(){
    event.preventDefault();
    document.getElementById("submitForm").style.display = "none"; // to undisplay
    document.getElementById("buttonLoading").style.display = ""; // to display

    var e = document.getElementById("nameEmp");
    var userEmp = e.options[e.selectedIndex].value;
    var nameVisitor = document.getElementById("nameVisitor").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var temperature = document.getElementById("temperature").value;
    var now = new Date(); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time) 
    var isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    isoDate = new Date(now).toISOString();

    // if (userEmp == [])
    //     alert("Please Enter Your Name")

    if (userEmp == 99)
        var userName = nameVisitor;
    else
        userName = userEmp

    if (document.getElementById('no-fever').checked)
        var queryFever = 1;
    else
        queryFever = 0

    if (document.getElementById('no-redzone').checked)
        var queryZone = 1;
    else
        queryZone = 0

    if (queryFever == 1 && queryZone == 1)
        var type = "Low";
    else
        type = "High"

    var detailForm = {
        'method': "addRecord",
        'name': userName,
        'phone': phoneNumber,
        'temperature': temperature,
        'status': type,
        'date': isoDate
    };

    jsonBody = {};
    reqJson = {};
    reqJson = {
        'name': userName,
        'contact': phoneNumber,
        'userStatus': type,
        'tenant': "5f1fa0c599871c2a80f53654",
        'location': "Katalyst_Data_Management_KL_Trillion",
        'createdDate': isoDate,
        'type': 1
    }

    var formBody = [];
    for (var property in detailForm) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(detailForm[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    jsonBody = JSON.stringify(reqJson);
    console.log("Parameters Parsed to KDM database: " + formBody);
    console.log("Parameters Parsed to MySejahtera database: " + jsonBody);

    kdmHtmlStatus = await sendDataKDM(formBody);
    mySejahteraHtmlStatus = await sendDataSejahtera(jsonBody);

    var x = await makePromise(1000); // Time buffer 1s
    console.log("Time buffer: " + x); //Log Time buffer

    loadHtmlTemplate();
}

async function sendDataKDM (params){
    console.log('Sending Data to KDM database....');
    const urlKdm = 'Your API URL';
    const urlProxy = 'https://cors-anywhere.herokuapp.com/';
  
    fetch(urlProxy + urlKdm, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: params
    })
    .then(function(response){
        response.text().then((s) => kdmResponse = s);
        console.log("Sending data to KDM database HTML response: " + response.status);
        kdmHtmlStatus =  response.status
    })
    await makePromise(2000);
  
return kdmHtmlStatus;
}

async function sendDataSejahtera (params){
    console.log('Sending Data to MySejahtera database....');
    const urlSejahtera = 'https://mysejahtera.malaysia.gov.my/clockin';
    const urlProxy = 'https://cors-anywhere.herokuapp.com/';
  
    fetch(urlProxy + urlSejahtera, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      headers: {'Content-Type': 'application/json'},
      body: params
    })
    .then(function(response){
        response.text().then((s) => mySejahteraResponse = s);
        console.log("Sending data to MySejahtera database HTML response: " + response.status);
        mySejahteraHtmlStatus =  response.status
    })
    await makePromise(2000);
  
    return mySejahteraHtmlStatus;
  }

function makePromise(x) { 
    return new Promise(resolve => {
        setTimeout(() => {
        resolve(x);
        }, x);
    });
}

function loadHtmlTemplate (){

    if (document.getElementById('no-fever').checked)
        var queryFever = 1;
    else
        queryFever = 0;

    if (document.getElementById('no-redzone').checked)
        var queryZone = 1;
    else
        queryZone = 0;
    
    if (kdmHtmlStatus <=205 || mySejahteraHtmlStatus <=205)
      if (queryZone == 1 && queryFever == 1)
      window.location.href = 'successPage.html';
      else
      window.location.href = 'highRisk.html';
    else
    window.location.href = 'failurePage.html';
}

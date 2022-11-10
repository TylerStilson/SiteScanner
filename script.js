// this currently isn't working. it won't pull the variable from content.js
// var http = require('http');
// const {LinkList} = require('./content.js');

//buttons
const imageButton = document.getElementById('image-button');
const linkButton = document.getElementById('link-button');
//pages
const homepage = document.getElementById('homescreen');
const loadingPage = document.getElementById('loading');

const fullLinkList = document.body.getElementsByTagName("a");

var pageHTML = null;
var pel = false;
var firstA = false
var isATag = false;

var listOfLinks = [];
var tempLink = "";

document.querySelector('#link-button').onclick = function () {
    linkFunction();
    
    
}

document.querySelector('#image-button').onclick = function (){
    imageFunction();
}



function linkFunction(){
  homepage.style.display = "none";
  loadingPage.style.display = "flex";
  console.log("here");


  chrome.runtime.onMessage.addListener(
      // console.log("here again");
      function(response, sender, sendResponse){
          console.log("here again");
          var listOfLinks = response;
          console.log("list of links: ", listOfLinks);
          return listOfLinks;
      }
  )
}

function imageFunction(){
    homepage.style.display = "none";
    loadingPage.style.display = "flex";
    // make the list of images here
}




//dont know if we need this code any more becuase it gave me the html but in string format... so not the best


// chrome.runtime.onMessage.addListener(function(request, sender) {
//   if (request.action == "getSource") {
//     //message.innerText = request.source;
//     pageHTML = request.source;
//     console.log(pageHTML);
//   }
// });
  
// function onWindowLoad() {

//   var message = document.querySelector('#message');

//   chrome.tabs.executeScript(null, {
//     file: "getPagesSource.js"
//   }, function() {
//     // If you try and inject into an extensions page or the webstore/NTP you'll get an error
//     if (chrome.runtime.lastError) {
//       message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
//     }
//   });

// }
  
// window.onload = onWindowLoad;
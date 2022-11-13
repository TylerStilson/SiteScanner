// this currently isn't working. it won't pull the variable from content.js
// var http = require('http');
//const { LinkList } = require('./content.js');
// import {links} from './content.js';
// import LinkList from "./content.js";

// import getLinks from './content.js';
// const links = getLinks;

//const getLinks = require('./content');
// import getLinks from './content';

// import { getLinks } from "./content";
// console.log(getLinks);

//buttons
const imageButton = document.getElementById('image-button');
const linkButton = document.getElementById('link-button');
//pages
const homepage = document.getElementById('homescreen');
const loadingPage = document.getElementById('loading');
const loadingMessage = document.getElementById('loadingMessage');
const linkSuccess = document.getElementById('linkSuccess');
const linkError = document.getElementById('linkError');
const Blinks = document.getElementById('insertBlinks');

var LinkList = [];
var BrokenLinks = [];

// const fullLinkList = document.body.getElementsByTagName("a");

// var pageHTML = null;
// var pel = false;
// var firstA = false
// var isATag = false;

// var listOfLinks = [];
// var tempLink = "";

document.querySelector('#link-button').onclick = function () {
    linkFunction();
    
    
}

document.querySelector('#image-button').onclick = function (){
    imageFunction();
}



async function linkFunction(){
  homepage.style.display = "none";
  loadingPage.style.display = "flex";
  console.log("here in link function");
  for (let i in LinkList){
    console.log("individul: ", LinkList[i].link);
    if ( LinkList[i].link != null){
        var status = await makeRequest(LinkList[i].link);
    }
    if (status != '200'){
        console.log("status is: ", status);
        BrokenLinks.push(LinkList[i]);
    }
  }
  console.log("broken links: ", BrokenLinks);
  console.log("B list length: ", BrokenLinks.length);

  if (BrokenLinks.length == 0){
    console.log("link scanner success. found no broken links");
    loadingMessage.style.display = "none";
    linkSuccess.style.display = "block";
    loadingPage.style.alignItems = "flex-start";
  } else {
    console.log("there was broken links");
    for (let i in BrokenLinks){
        addElement(BrokenLinks[i].link, BrokenLinks[i].html);
    }

    loadingMessage.style.display = "none";
    linkError.style.display = "block";
    loadingPage.style.alignItems = "flex-start";
    
  }



}

function addElement(link, HtMl){
    console.log("url: ", link);
    console.log("text: ", HtMl);
    const newDiv = document.createElement("div");
    const newContent = document.createElement("p");
    newContent.innerHTML = "link: ";
    newContent.style.color = "#EB6565";
    const urlContent = document.createElement("p");
    urlContent.innerHTML = link;
    urlContent.style.paddingLeft = "8px";
    urlContent.style.color = "#EB6565";

    newDiv.appendChild(newContent);
    newDiv.appendChild(urlContent);

    newDiv.style.display = "flex";
    newDiv.style.marginBottom = "10px";

    Blinks.appendChild(newDiv);
}


async function makeRequest(url){
    try {
        var response = await fetch(url);
        // console.log('response.status: ', response.status);
        // console.log(response);
        return response.status;
    } catch (err) {
        console.log(err);
    }
}


function imageFunction(){
    homepage.style.display = "none";
    loadingPage.style.display = "flex";
    // make the list of images here

}

var Links = [];
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        console.log("tabs res: ", response);
        LinkList = response;
    });
});
// chrome.runtime.sendMessage('get-links', (response) => {
//     console.log("in runtime, links are: ", response);
//     Links = response;
// });

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
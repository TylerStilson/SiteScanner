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
const imageSuccess = document.getElementById('imageSuccess');
const imageError = document.getElementById('imageError');


var ImgList = [];
var LinkList = [];
var BrokenLinks = [];
var missingAltList = [];

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

document.querySelector('#arrow-position').onclick = function(){
    goBack();
}
document.querySelector('#arrow-position2').onclick = function(){
    goBack();
}
document.querySelector('#arrow-position3').onclick = function(){
    goBack();
}
document.querySelector('#arrow-position4').onclick = function(){
    goBack();
}

function goBack(){
    homepage.style.display = "block";
    loadingPage.style.display = "none";
    linkSuccess.style.display = "none";
    linkError.style.display = "none";
    imageError.style.display = "none";
    imageSuccess.style.display = "none";
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
        //console.log("status is: ", status);
        BrokenLinks.push(LinkList[i]);
    }
  }
  //console.log("broken links: ", BrokenLinks);
  //console.log("B list length: ", BrokenLinks.length);

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

    // chrome.tabs.sendMessage(tabs[0].id, {greeting: "show broken links"}).then((response)=>{
    //     console.log(response);
    // });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "show broken links"}, function(response) {
            console.log("response from the highlight call: ",response);
        });
    });
    
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
    for (let image in ImgList){
        console.log("in content indiv: ", ImgList[image]);
        if ( ImgList[image] == {} | ImgList[image].src == ''){
            console.log("dont count these");
        }
        else{
            if (ImgList[image].alt == ""){
                missingAltList.push(ImgList[image]);
            }
        }

        
    }

    if (missingAltList.length > 0){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "show empty alts"}, function(response) {
                console.log("resp from image call from content: ", response);
            });
        });
        loadingMessage.style.display = "none";
        imageError.style.display = 'block';
    }
    else{
        loadingMessage.style.display = "none";
        imageSuccess.style.display = "block";
    }

}

var Links = [];
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        console.log("tabs res: ", response);
        // console.log("tabs resp link: ", response.links);
        // console.log("tabs resp images: ", response.images);
        LinkList = response.links;
        ImgList = response.images;
        // console.log("tabs resp linklist var: ", LinkList);
        // console.log("tabs resp imglist var: ", ImgList);

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
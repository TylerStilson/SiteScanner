//buttons
const imageButton = document.getElementById('image-button');
const linkButton = document.getElementById('link-button');
//pages
const homepage = document.getElementById('homescreen');
const loadingPage = document.getElementById('loading');
const loadingMessage = document.getElementById('loadingIcon');
const linkSuccess = document.getElementById('linkSuccess');
const linkError = document.getElementById('linkError');
const Blinks = document.getElementById('insertBlinks');
const Bimgs = document.getElementById('insertBimgs');
const imageSuccess = document.getElementById('imageSuccess');
const imageError = document.getElementById('imageError');


var ImgList = [];
var LinkList = [];
var BrokenLinks = [];
var missingAltList = [];
var listIndex = [];

document.querySelector('#link-button .mainButton').onclick = function () {
    linkFunction();
}
document.querySelector('#image-button .mainButton').onclick = function () {
    imageFunction();
}
document.querySelectorAll('.back-arrow').forEach(function(arrow) {
    arrow.onclick = goBack;
});

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
  for (let i in LinkList){
    if ( LinkList[i].link != null && !LinkList[i].link.startsWith("mailto:") && !LinkList[i].link.startsWith("tel:")){
        var status = await makeRequest(LinkList[i].link);
    }
    if (status != '200'){
        BrokenLinks.push(LinkList[i]);
        listIndex.push(i);
    }
  }

  if (BrokenLinks.length == 0){
    console.log("Link scanner success - found no broken links");
    loadingMessage.style.display = "none";
    linkSuccess.style.display = "block";
    loadingPage.style.alignItems = "flex-start";
  } else {
    console.log("There are broken links");
    for (let i in BrokenLinks){
        if (BrokenLinks[i].link && BrokenLinks[i].link != null) {
            addLinkElement(BrokenLinks[i].link, BrokenLinks[i].html);
        }
    }

    loadingMessage.style.display = "none";
    linkError.style.display = "block";
    loadingPage.style.alignItems = "flex-start";

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: listIndex}, function(response) {
            console.log("response from the highlight call: ", response);
        });
    });
    
  }
}

function addImageElement(src){
    const newContent = document.createElement("p");
    newContent.innerHTML = `<strong>Src:</strong> ${src}`;
    newContent.classList.add("bad-item");
    Bimgs.appendChild(newContent);
}

function addLinkElement(link, html){
    html = html.toString();
    if (html.includes("<img")) {
        html = "Content contains an image";
    }
    const newContent = document.createElement("p");
    newContent.innerHTML = `<strong>Link:</strong> ${link} <br><strong>Content:</strong> ${html}`;
    newContent.classList.add("bad-item");
    Blinks.appendChild(newContent);
}

async function makeRequest(url){
    try {
        var response = await fetch(url);
        return response.status;
    } catch (err) {
        console.log(err);
    }
}

function imageFunction(){
    homepage.style.display = "none";
    loadingPage.style.display = "flex";
    loadingMessage.style.display = "block";
    for (let image in ImgList){
        console.log("in content indiv: ", ImgList[image]);
        if ((ImgList[image] != {} | ImgList[image].src != '') && (ImgList[image].alt == "" || !ImgList[image].alt)){
            missingAltList.push(ImgList[image]);
        }
    }
    for (let i in missingAltList){
        if (missingAltList[i].src && missingAltList[i].src != null) {
            addImageElement(missingAltList[i].src);
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
        loadingPage.style.alignItems = "flex-start";
    }
    else {
        loadingMessage.style.display = "none";
        imageSuccess.style.display = "block";
        loadingPage.style.alignItems = "flex-start";
    }
}

var Links = [];
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        LinkList = response.links;
        ImgList = response.images;
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    if (request.greeting == "grabIndex"){
        console.log("List of indexes in the add Listener: ",listIndex);
        sendResponse(listIndex);
    }  
    else{
        sendResponse("noresp for index");
    }
});
var BrokenLinks = [];
var LinkList = [];
var ImgList = [];
var missingAltList = [];
var AllLinks = [];

async function getLinks(){
    AllLinks = document.getElementsByTagName('a');

    for (let Link in AllLinks){
        LinkList.push({link: AllLinks[Link].href, html: AllLinks[Link].innerHTML});
    }
    console.log('All Links: ', LinkList);
    return LinkList;
}

async function getImage (){
    const images = document.getElementsByTagName('img');
    console.log("All images: ", images);

    for (let image in images){
        ImgList.push({src: images[image].currentSrc, alt: images[image].alt});

        if ( images[image] != 'img#wpstats'){
            if (images[image].alt == "" | images[image].alt == null){
                console.log("Missing image: ", images[image]);
                missingAltList.push(images[image]);
            }
        }
    }
    console.log("Missing alt attribute list: ", missingAltList);
    return ImgList;
}

chrome.runtime.sendMessage(getLinks());
chrome.runtime.sendMessage(getImage());

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    if (request.greeting == "show empty alts"){
        for (img in missingAltList){
            missingAltList[img].style.backgroundColor = "#EB6565";
            missingAltList[img].style.borderColor = "#EB6565";
            missingAltList[img].style.border = "5px solid";
            missingAltList[img].style.color = "#EB6565";
        }
        sendResponse("image done");
    }
    else if(request.greeting == "hello"){
        sendResponse({links: LinkList, images: ImgList});
    }
    else{
        console.log("else req: ", request.greeting);
        for (let i in request.greeting){
            console.log("each a highlight ele: ", request.greeting[i]);
            index = request.greeting[i];
            console.log("highlight object: ", LinkList[index]);
            AllLinks[index].style.backgroundColor = "#EB6565";
            AllLinks[index].style.borderColor = "#EB6565";
            AllLinks[index].style.border = "5px solid";
        }
        sendResponse("link highlight done");
    }
});

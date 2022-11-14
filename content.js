// this file is where you can change certain page elements. So this is where I am grabbing all the links

// const linkMessage = document.getElementById('message');

// console.log("link message: ", linkMessage);





var BrokenLinks = [];
var LinkList = [];
var ImgList = [];
var missingAltList = [];

async function getLinks(){
    const Links = document.getElementsByTagName('a');
    console.log("all link info: ",Links);
    //var LinkList = [];

    for (let Link in Links){
        //console.log(Link);
        LinkList.push({link: Links[Link].href, html: Links[Link].innerHTML});
        if (Links[Link].href != null){
            var status = await makeRequest(Links[Link].href);
        }
        
        if (status != '200'){
            BrokenLinks.push(Links[Link]);
            console.log("content.js blink list: ", BrokenLinks);
        }
    }
    //this doesnt show in the extention console. It shows in the browser console.
    // so next step would be to figure out how to get this "LinkList" variable to the script.js file
    console.log('list in content: ', LinkList);
    return LinkList;
}


async function getImage (){
    const images = document.getElementsByTagName('img');
    console.log("all image tags: ", images);

    for (let image in images){
        console.log("individual image: ", images[image]);
        ImgList.push({src: images[image].currentSrc, alt: images[image].alt});

        if ( images[image] != 'img#wpstats'){
            if (images[image].alt == "" | images[image].alt == null){
                console.log("indiv missing img: ", images[image]);
                missingAltList.push(images[image]);
            }
        }
        
    }
    console.log("mssing alt list: ", missingAltList);
    return ImgList;
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

chrome.runtime.sendMessage(getLinks());
chrome.runtime.sendMessage(getImage());


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//     console.log("reqParams: ", request, sender, sendResponse);
//     console.log("linklist before sending it: ", LinkList);
//     sendResponse({links: LinkList, images: ImgList});
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    console.log("request greeting: ",request.greeting);
    if (request.greeting == "show broken links"){
        for (link in BrokenLinks){
            BrokenLinks[link].style.backgroundColor = "#EB6565";
            BrokenLinks[link].style.borderColor = "#EB6565";
            BrokenLinks[link].style.border = "5px solid";
            // BrokenLinks[link].style.color = "#EB6565";
        }
        sendResponse("link done");
    }
    else if (request.greeting == "show empty alts"){
        console.log("this is in the image call seeing if it shows up");
        for (img in missingAltList){
            missingAltList[img].style.backgroundColor = "#EB6565";
            missingAltList[img].style.borderColor = "#EB6565";
            missingAltList[img].style.border = "5px solid";
            missingAltList[img].style.color = "#EB6565";
        }
        sendResponse("image done");
    }
    else{
        console.log({links: LinkList, images: ImgList});
        sendResponse({links: LinkList, images: ImgList});
    }
    // return Promise.resolve({response: "hello there"});

});

// export default getLinks;

//module.exports = getLinks;

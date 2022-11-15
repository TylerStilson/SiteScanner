var BrokenLinks = [];
var LinkList = [];
var ImgList = [];
var missingAltList = [];
var AllLinks = [];

async function getLinks(){
    AllLinks = document.getElementsByTagName('a');
    console.log("all link info: ",AllLinks);

    for (let Link in AllLinks){
        LinkList.push({link: AllLinks[Link].href, html: AllLinks[Link].innerHTML});
        // if (Links[Link].href != null){
        //     var status = await makeRequest(Links[Link].href);
        // }
        
        // if ((status < 200 | status > 299) & (status != 0)){
        //     console.log("okay what status code are you: ", status);
        //     BrokenLinks.push(Links[Link]);
        //     console.log("content.js blink list: ", BrokenLinks);
        // }
    }
    //var links = [LinkList, BrokenLinks];
    console.log('list in content: ', LinkList);
    console.log("list in content of broken links: ", BrokenLinks);
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
        // headers.append('Access-Control-Allow-Origin', '*');
        // headers.append('Access-Control-Allow-Credentials', 'true');
        var response = await fetch(url, {
            mode: "no-cors"
        });
        console.log('response.status: ', response.status);
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
    console.log("broken links: ", BrokenLinks);
    // if (request.greeting == "show broken links"){

    //     // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "grabIndex"}, function(response) {
    //     //         console.log("index res: ", response);
                
        
        
    //     //     });
    //     // });



    //     // for (link in BrokenLinks){
    //     //     BrokenLinks[link].style.backgroundColor = "#EB6565";
    //     //     BrokenLinks[link].style.borderColor = "#EB6565";
    //     //     BrokenLinks[link].style.border = "5px solid";
    //     //     // BrokenLinks[link].style.color = "#EB6565";
    //     // }
    //     sendResponse("link done");
    // }
    if (request.greeting == "show empty alts"){
        console.log("this is in the image call seeing if it shows up");
        for (img in missingAltList){
            missingAltList[img].style.backgroundColor = "#EB6565";
            missingAltList[img].style.borderColor = "#EB6565";
            missingAltList[img].style.border = "5px solid";
            missingAltList[img].style.color = "#EB6565";
        }
        sendResponse("image done");
    }
    else if(request.greeting == "hello"){
        console.log({links: LinkList, images: ImgList});
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

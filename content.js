// this file is where you can change certain page elements. So this is where I am grabbing all the links

// const linkMessage = document.getElementById('message');

// console.log("link message: ", linkMessage);






var LinkList = [];
function getLinks(){
    const Links = document.getElementsByTagName('a');
    console.log("all link info: ",Links);
    //var LinkList = [];

    for (let Link in Links){
        //console.log(Link);
        LinkList.push({link: Links[Link].href, html: Links[Link].innerHTML});
    }
    //this doesnt show in the extention console. It shows in the browser console.
    // so next step would be to figure out how to get this "LinkList" variable to the script.js file
    console.log('list in content: ', LinkList);
    //linkMessage.innerHTML = LinkList;
    return LinkList;
}

//console.log("links: ", Links);




chrome.runtime.sendMessage(getLinks());

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message === 'get-links'){
//         sendResponse(LinkList);
//     }
//     else{
//         sendResponse("not right message");
//     }
// });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log("reqParams: ", request, sender, sendResponse);
    console.log("linklist before sending it: ", LinkList);
    sendResponse(LinkList);
});



// export default getLinks;

//module.exports = getLinks;

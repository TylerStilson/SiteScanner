// this file is where you can change certain page elements. So this is where I am grabbing all the links

function getLinks(){
    const Links = document.getElementsByTagName('a');
    var LinkList = [];

    for (Link in Links){
        console.log(Link);
        LinkList.push(Links[Link].href);
    }
    //this doesnt show in the extention console. It shows in the browser console.
    // so next step would be to figure out how to get this "LinkList" variable to the script.js file
    console.log('list: ', LinkList);
    return LinkList;
}

//console.log("links: ", Links);

// module.exports = {LinkList};

//chrome.storage.local.set({LinksList: LinkList});
chrome.runtime.sendMessage(getLinks());
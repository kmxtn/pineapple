// wait for page to load, then wait for click
document.addEventListener("DOMContentLoaded", function () {
    // get input
    const itemName = document.getElementById("itemName");
    const addButton = document.getElementById("addButton");
    const itemNotes = document.getElementById("itemNotes") || "N/A";
  
    addButton.addEventListener("click", function() {
        // yoink url
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            const item = itemName.value.trim();

            // add to list
            if (item !== "") {
                const link = currentTab.url;
                pineTime(item, link, itemNotes.value.trim());
            }
        });
    });
});
  
function pineTime(itemName, link, itemNotes) {
    chrome.storage.sync.get("pineList", function(data) {
        const pineList = data.pineList || [];
        pineList.push({itemName, link, itemNotes});

        chrome.storage.sync.set({"pineList": pineList}, function() {
            displayWishList(pineList);
            itemNameInput.value = "";
        });
    });
}

function displayWishList(pineList) {
    const elem = document.getElementById("item");
    elem.innerHTML = "";

    // to only get the last 3 added
    if (pineList.length > 0) {
        const min = (pineList.length > 3) ? pineList.length - 3 : 0;
        for (let i = pineList.length - 1; i >= min; i--) {
            const item = pineList[i];
            const listItem = document.createElement("li");
            const linkElement = document.createElement("a");    // link
            linkElement.href = item.link;
            linkElement.textContent = item.itemName;
            linkElement.target = "_blank";  // open link

            listItem.appendChild(linkElement);
            elem.appendChild(listItem);
        }
    }
}
  
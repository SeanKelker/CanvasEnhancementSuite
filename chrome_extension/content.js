//Add header to camino
let main_window = document.body;
let font = document.createElement('link');
font.href = "https://use.typekit.net/fmp3diy.css";
font.rel = "stylesheet";
document.head.appendChild(font);

function createHeader () {
    let header = document.createElement('ul');
    header.setAttribute('id', 'ces-header');
    let title = '<li class="bar-item" id="ces-header-title">CES</li>';

    //CLASS 1
    let class1 = document.createElement('li');
    class1.className = 'bar-item ces-dropdown';

    let dropbtn1 = document.createElement('a');
    dropbtn1.className = "dropbtn";
    dropbtn1.innerHTML = "COEN174";
    dropbtn1.href = "javascript:void(0)";

    let dropContent1 = document.createElement('div');
    dropContent1.className = 'dropdown-content';

    let contentStr1 = '<a href="#">Assignments</a><a href="#">Announcements</a>'
    dropContent1.insertAdjacentHTML('beforeend', contentStr1);

    class1.appendChild(dropbtn1);
    class1.appendChild(dropContent1);

    //CLASS 2
    let class2 = document.createElement('li');
    class2.className = 'bar-item ces-dropdown';

    let dropbtn2 = document.createElement('a');
    dropbtn2.className = "dropbtn";
    dropbtn2.innerHTML = "COEN150";
    dropbtn2.href = "javascript:void(0)";

    let dropContent2 = document.createElement('div');
    dropContent2.className = 'dropdown-content';

    let contentStr2 = '<a href="#">Assignments</a><a href="#">Announcements</a>'
    dropContent2.insertAdjacentHTML('beforeend', contentStr2);
    class2.appendChild(dropbtn2);
    class2.appendChild(dropContent2);

    header.insertAdjacentHTML('beforeend', title);
    header.appendChild(class1);
    header.appendChild(class2);
    return header;
}

function tagModuleItem(event) {
    let item = event.target.parentElement;
    let link = item.children[0].href;
    let name = item.children[0].ariaLabel;
    let type = item.children[1].title;
    
    console.log(name + ", " + type + ", " + link);

}

//Will add a tag button to module item cards
async function addTagsModule() {
    let modItems = await document.getElementsByClassName('ig-row');
    
    for (var i = 0; i < modItems.length; i++) {
        if(!modItems[i].parentElement.classList.contains('context_module_sub_header')) {
            let tagButton = document.createElement('input');
            tagButton.type = 'checkbox';
            tagButton.value = 'Tag';
            tagButton.onchange = tagModuleItem;
            console.log(modItems[i]);
            modItems[i].appendChild(tagButton);
        }
    }
}

main_window.prepend(createHeader());
addTagsModule();
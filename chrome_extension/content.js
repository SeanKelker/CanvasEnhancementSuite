//const { userInfo } = require("os");
var userName = '';
var userId = '';
const serverUrl = 'localhost:3000/';

function createHeader(courses) {
    courses = courses
        .filter(c => c.course_code)
        .filter(c => new Date(c['end_at']) >= Date.now())

    let header = document.createElement('ul');
    header.setAttribute('id', 'ces-header');
    let title = '<li class="bar-item" id="ces-header-title">CES</li>';
    header.insertAdjacentHTML('beforeend', title);

    for (let i = 0; i < courses.length; i++) {
        const c = courses[i];

        let course = document.createElement('li');
        course.className = 'bar-item ces-dropdown';

        let dropbtn = document.createElement('a');
        dropbtn.className = "dropbtn";
        dropbtn.innerHTML = c['course_code'];
        dropbtn.href = "javascript:void(0)";

        let dropContent = document.createElement('div');
        dropContent.className = 'dropdown-content';
        let courseStr = '<a href="/courses/' + c['id'] + '">Assignments</a>'
        let announcementStr = '<a href="/courses/' + c['id'] + '/announcements">Announcements</a>'
        let contentStr = courseStr + announcementStr
        dropContent.insertAdjacentHTML('beforeend', contentStr);

        course.appendChild(dropbtn);
        course.appendChild(dropContent);
        header.appendChild(course);
    }
    return header;
}

function tagModuleItem(event) {
    let item = event.target.parentElement;
    let link = item.children[0].href;
    let name = item.children[0].ariaLabel;
    let type = item.children[1].title;
    
    console.log(name + ", " + type + ", " + link);
}
function tagAssignment(event) {
    let parent = event.target.parentElement;
    let type = 'Assignment';
    let link = parent.children[0].children[1].children[0].href;
    let name = parent.children[0].children[1].children[0].text;

    console.log(name + ", " + type + ", " + link);
}
//Will add a tag button to module item cards
async function addTags() {
    let modItems = await document.getElementsByClassName('ig-row');
    console.log(modItems.length)

    for (var i = 0; i < modItems.length; i++) {
        console.log('Test');
        if(!modItems[i].parentElement.classList.contains('context_module_sub_header')) {
            let tagButton = document.createElement('input');
            tagButton.type = 'checkbox';
            tagButton.value = 'Tag';
            if (modItems[i].parentElement.classList.contains('context_module_item')) {
                tagButton.onchange = tagModuleItem;
            } else if (modItems[i].parentElement.classList.contains('assignment')) {
                tagButton.onchange = tagAssignment;
            }
            modItems[i].appendChild(tagButton);
        }
    }
}
fetch('https://camino.instructure.com/api/v1/users/self')
    .then(result => result.text())
    .then(result => {
        let userInfo = JSON.parse(result.substr(9, result.length));
        console.log(userInfo);
        userId = userInfo.id;
        userName = userInfo.short_name;
        let main_window = document.body;
        let font = document.createElement('link');
        font.href = "https://use.typekit.net/fmp3diy.css";
        font.rel = "stylesheet";
        document.head.appendChild(font);
        //main_window.prepend(createHeader(courses));
    })
    .then(() => {
        fetch(serverUrl + 'courses/?name=' + userName + '&id=' + userId)
        .then(result => console.log(result))
    });

window.addEventListener("load", function(event) {
    addTags();
});
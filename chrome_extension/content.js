var userName = '';
var userId = '';
const serverUrl = 'http://localhost:3000/';
let types = ['assignments', 'announcements', 'pages'];
let courses = [
    {
        course_name: 'COEN 174',
        assignments: [
            {name: "Andrew Hill HS Presentations", link: 'https://www.google.com'},
            {name: "Assignment 3", link: 'https://www.google.com'},
        ],
        announcements: [
            {name: "Very important!", link: 'https://www.google.com'},
        ],
        pages: []
    }
]

function createHeader(courses) {
    let header = document.createElement('ul');
    header.setAttribute('id', 'ces-header');
    let title = '<li class="bar-item" id="ces-header-title">CES</li>';
    header.insertAdjacentHTML('beforeend', title);

    for (let i = 0; i < courses.length; i++) {
        const c = courses[i];

        let course = document.createElement('li');
        course.className = 'bar-item ces-dropdown';
        course.id = c.course_name +'-dropdown'

        let dropbtn = document.createElement('a');
        dropbtn.className = "dropbtn";
        dropbtn.innerHTML = c.course_name;
        dropbtn.href = "javascript:void(0)";

        let dropContent = document.createElement('ul');
        dropContent.className = 'dropdown-content';

        let assignmentsElem = document.createElement('li'); 
        assignmentsElem.className = 'dropdown-category';
        let announcementsElem = document.createElement('li'); 
        announcementsElem.className = 'dropdown-category';
        let pagesElem = document.createElement('li'); 
        pagesElem.className = 'dropdown-category';

        let assignmentBtn = document.createElement('a');
        assignmentBtn.innerHTML = "Assignments";
        let announcementsBtn = document.createElement('a');
        announcementsBtn.innerHTML = "Announcements";
        let pagesBtn = document.createElement('a');
        pagesBtn.innerHTML = "Pages";

        let assignmentsList = document.createElement('ul');
        let announcementsList = document.createElement('ul');
        let pagesList = document.createElement('ul');
        
        for (let j = 0; j < 3; j++) {
            let type = types[j];
            for (let k = 0; k < c[type].length; k++) {
                let itemStr = `<li><a href="${c[type][k].link}">${c[type][k].name}</a></li>`;
                console.log(itemStr)
                switch (type) {
                    case 'assignments':
                        assignmentsList.insertAdjacentHTML('afterbegin', itemStr);
                        break;
                    case 'announcements':
                        announcementsList.insertAdjacentHTML('afterbegin', itemStr);
                        break;
                    case 'pages':
                        pagesList.insertAdjacentHTML('afterbegin', itemStr);
                        break;
                }
            }
        }

        assignmentsElem.appendChild(assignmentBtn);
        assignmentsElem.appendChild(assignmentsList);
        announcementsElem.appendChild(announcementsBtn);
        announcementsElem.appendChild(announcementsList);
        pagesElem.appendChild(pagesBtn);
        pagesElem.appendChild(pagesList);

        course.appendChild(dropbtn);
        dropContent.appendChild(assignmentsElem);
        dropContent.appendChild(announcementsElem);
        dropContent.appendChild(pagesElem);
        course.appendChild(dropContent);

        header.appendChild(course);
    }
    return header;
}

//
function getCourseName() {
    let breadcrumbs = document.getElementById('breadcrumbs');
    let name = breadcrumbs.children[0].children[1].children[0].children[0].innerHTML;
    if(name)
        return name;
    else 
        return '';
}

function getCourseId() {
    let location = window.location.href;
    return (location.split('/')[4]);
}

function typeToTypes(type) {
    switch(type){
        case 'Assignment':
            return 'assignments';
            break;
        case 'Page':
            return 'pages'
            break;
        case 'Announcement':
            return 'announcements';
            break;
        default:
            return '';
            break;
    }
}

function tagModuleItem(event) {
    let item = event.target.parentElement;
    let link = item.children[0].href;
    let name = item.children[0].ariaLabel;
    let type = item.children[1].title;
    let courseName = getCourseName();
    let courseId = getCourseId();
    let body = {
        type: typeToTypes(type),
        itemName: name,
        itemLink: link,
        courseName: courseName,
        courseId: courseId
    }

    if(courseName){
        console.log(name + ", " + type + ", " + link);
        let checked = event.target.checked;
        if (checked) {
            fetch(serverUrl+'items/add?name=' + userName + '&id=' + userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((res) => res.json())
            .then(async res => {
                if (res.success === true) {
                    console.log('Add success')
                    let header = document.getElementById('ces-header');
                    let items = await getCourseItems()
                    let newHeader = createHeader(items);
                    document.body.replaceChild(newHeader, header);
                } else {
                    console.log('Add failed');
                    event.target.checked = false;
                }
            });
        } else {
            fetch(serverUrl+'items/delete?name=' + userName + '&id=' + userId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((res) => res.json())
            .then(async res => {
                if (res.success === true) {
                    console.log('Delete success')
                    let header = document.getElementById('ces-header');
                    let items = await getCourseItems()
                    let newHeader = createHeader(items);
                    document.body.replaceChild(newHeader, header);
                } else {
                    console.log('Delete failed');
                    event.target.checked = true;
                }
            });
        }
    } else {
        console.log('Could not operate on this item');
    }
    
}

function tagAssignment(event) {
    let parent = event.target.parentElement;
    let type = 'Assignment';
    let link = parent.children[0].children[1].children[0].href;
    let name = parent.children[0].children[1].children[0].text;
    let courseName = getCourseName();
    let courseId = getCourseId();
    let body = {
        type: typeToTypes(type),
        itemName: name,
        itemLink: link,
        courseName: courseName,
        courseId: courseId
    }

    if(courseName){
        console.log(name + ", " + type + ", " + link);
        let checked = event.target.checked;
        if (checked) {
            fetch(serverUrl+'items/add?name=' + userName + '&id=' + userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((res) => res.json())
            .then(async res => {
                if (res.success === true) {
                    console.log('Add success')
                    let header = document.getElementById('ces-header');
                    let items = await getCourseItems()
                    let newHeader = createHeader(items);
                    document.body.replaceChild(newHeader, header);
                } else {
                    console.log('Add failed');
                    event.target.checked = false;
                }
            });
        } else {
            fetch(serverUrl+'items/delete?name=' + userName + '&id=' + userId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then((res) => res.json())
            .then(async res => {
                if (res.success === true) {
                    console.log('Delete success')
                    let header = document.getElementById('ces-header');
                    let items = await getCourseItems()
                    let newHeader = createHeader(items);
                    document.body.replaceChild(newHeader, header);
                } else {
                    console.log('Delete failed');
                    event.target.checked = true;
                }
            });
        }
    } else {
        console.log('Could not operate on this item');
    }
}
//Will add a tag button to module item cards
async function addTags(courses) {
    let modItems = await document.getElementsByClassName('ig-row');
    let courseId = getCourseId();
    let course = courses[courses.findIndex(c => c.course_id===courseId)];
    console.log(course);
    for (var i = 0; i < modItems.length; i++) {
        if(!modItems[i].parentElement.classList.contains('context_module_sub_header')) {
            let tagButton = document.createElement('input');
            tagButton.type = 'checkbox';
            tagButton.value = 'Tag';
            if (modItems[i].parentElement.classList.contains('context_module_item') && typeToTypes(modItems[i].children[1].title)) {
                tagButton.onchange = tagModuleItem;
                let link = modItems[i].children[0].href;
                
                var found = false;
                if (course) {
                    let items = course[typeToTypes(modItems[i].children[1].title)];
                    for(var j = 0; j < items.length; j++) {
                        if (items[j].link === link) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    tagButton.checked = true;
                }
                modItems[i].appendChild(tagButton);
            } else if (modItems[i].parentElement.classList.contains('assignment')) {
                tagButton.onchange = tagAssignment;
                let link = modItems[i].children[0].children[1].children[0].href;
                var found = false;
                if (course) {
                    let items = course['assignments'];
                    for(var j = 0; j < items.length; j++) {
                        if (items[j].link === link) {
                            found = true;
                            break;
                        }
                    }
                }

                if (found) {
                    tagButton.checked = true;
                }
                

                modItems[i].appendChild(tagButton);
            }
        }
    }
}

function getCourseItems() {
    return new Promise((resolve, reject)=>{
        fetch(serverUrl + 'courses/?name=' + userName + '&id=' + userId)
        .then(result => result.json())
        .then((courses) => {resolve(courses)})
    })
}


window.addEventListener("load", function(event) {
    fetch('https://camino.instructure.com/api/v1/users/self')
    .then(result => result.text())
    .then(result => {
        let userInfo = JSON.parse(result.substr(9, result.length));
        console.log(userInfo);
        userId = userInfo.id;
        userName = userInfo.short_name;
        
        let font = document.createElement('link');
        font.href = "https://use.typekit.net/fmp3diy.css";
        font.rel = "stylesheet";
        document.head.appendChild(font);
        
    })
    .then(async () => {
        let courses = await getCourseItems();
        console.log(courses);
        let main_window = document.body;
        addTags(courses);
        main_window.prepend(createHeader(courses));
        
    });
});
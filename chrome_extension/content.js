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

        let contentStr = '<a href="#">Assignments</a><a href="#">Announcements</a>'
        dropContent.insertAdjacentHTML('beforeend', contentStr);

        course.appendChild(dropbtn);
        course.appendChild(dropContent);
        header.appendChild(course);
    }
    return header;
}

fetch('https://camino.instructure.com/api/v1/courses')
    .then(result => result.text())
    .then(result => {
        courses = JSON.parse(result.substr(9, result.length));
        console.log(courses)
        let main_window = document.body;
        let font = document.createElement('link');
        font.href = "https://use.typekit.net/fmp3diy.css";
        font.rel = "stylesheet";
        document.head.appendChild(font);
        main_window.prepend(createHeader(courses));
    });

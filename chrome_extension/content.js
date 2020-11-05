//Add header to camino
let main_window = document.body;

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

main_window.prepend(createHeader());
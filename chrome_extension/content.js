//Add header to camino
let main_window = document.body;

function createHeader () {
    let header = document.createElement('ul');
    header.setAttribute('id', 'ces-header');
    let title = "<li class=\"bar-item\" id=\"ces-header-title\">CES</li>";
    let class1 = "<li class=\"bar-item dropdown\">COEN174</li>"
    let class2 = "<li class=\"bar-item dropdown\">COEN150</li>"
    header.insertAdjacentHTML('beforeend', title);
    header.insertAdjacentHTML('beforeend', class1);
    header.insertAdjacentHTML('beforeend', class2);
    return header;
}

main_window.prepend(createHeader());
document.addEventListener('DOMContentLoaded', async function () {
    const allCourses = await getAllCourses();
    const parentDiv = document.querySelector('#courses');
    allCourses.forEach((courseData) => {
        /* Add an element for each course onto to page */
        const elementDiv = document.createElement('div');
        parentDiv.appendChild(elementDiv);
        const elementText = document.createElement('p');
        elementText.innerHTML = courseData.email;
        const elementButton = document.createElement('button');
        elementButton.innerHTML = 'Add Course';
        elementDiv.appendChild(elementText);
        elementDiv.appendChild(elementButton);
    });
});

async function getAllCourses() {
    try {
        const data = await (await fetch('/api/users')).json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

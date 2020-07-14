document.addEventListener('DOMContentLoaded', async function () {
    const allCourses = await getAllCourses();
    const parentDiv = document.querySelector('#courses');
    allCourses.forEach((courseData) => {
        /* Add an element for each course onto to page */
        const elementDiv = document.createElement('div');
        parentDiv.appendChild(elementDiv);
        const elementText = document.createElement('p');
        elementText.innerHTML = `${courseData.courseId} - ${courseData.name}`;
        const elementButton = document.createElement('button');
        elementButton.innerHTML = 'Add Course';
        elementButton.addEventListener('click', async (e) => {
            const success = await addCourse(courseData._id);
            if (success) {
                alert(`Added ${courseData.courseId}`);
            } else {
                alert(`You already have ${courseData.courseId}`);
            }
        });
        elementDiv.appendChild(elementText);
        elementDiv.appendChild(elementButton);
    });
});

async function getAllCourses() {
    try {
        const data = await (await fetch('/api/courses')).json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function addCourse(courseId) {
    try {
        const success = await fetch(`/api/courses/add/${courseId}`, {
            method: 'POST',
        });
        const blob = await success.json();
        return blob.message === 'Added';
    } catch (err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    let parentDiv = document.querySelector('#courseAddDIV');
    if (parentDiv !== null) {
        createCourseAdd(parentDiv);
    } else {
        parentDiv = document.querySelector('#courseViewDIV');
        createCourseView(parentDiv);
    }
});

async function createCourseAdd(parentDiv) {
    const allCourses = await getAllCourses();

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
}

async function createCourseView(parentDiv) {
    const userCourses = await getUserCourses();

    // eslint-disable-next-line no-restricted-syntax
    for (const course of userCourses) {
        console.log(course);
        const elementDiv = document.createElement('div');
        parentDiv.appendChild(elementDiv);
        const elementText = document.createElement('p');
        elementText.innerHTML = `${course.courseId} - ${course.name}`;
        const elementButton = document.createElement('button');
        elementButton.innerHTML = 'Add Course';
        elementButton.addEventListener('click', async (e) => {
            const success = await addCourse(course._id);
            if (success) {
                alert(`Added ${course.courseId}`);
            } else {
                alert(`You already have ${course.courseId}`);
            }
        });
        elementDiv.appendChild(elementText);
        elementDiv.appendChild(elementButton);
    }
}

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
        const response = await fetch(`/api/courses/add/${courseId}`, {
            method: 'POST',
        });
        const blob = await response.json();
        return blob.message === 'Added';
    } catch (err) {
        console.log(err);
    }
}

async function getUserCourses() {
    try {
        const user = await (await fetch(`/users/me`)).json();
        const courseData = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const courseRawId of user.courses) {
            // eslint-disable-next-line no-await-in-loop
            const data = await // eslint-disable-next-line no-await-in-loop
            (await fetch(`/api/courses/${courseRawId}`)).json();
            courseData.push(data);
        }
        return courseData;
    } catch (err) {
        console.log(err);
    }
}

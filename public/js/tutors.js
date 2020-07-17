document.addEventListener('DOMContentLoaded', async function () {
    let parentDiv = document.querySelector('#tutorAddDIV');
    if (parentDiv !== null) {
        createTutorAdd(parentDiv);
    } else {
        parentDiv = document.querySelector('#tutorViewDIV');
        createTutorView(parentDiv);
    }
});

async function createTutorAdd(parentDiv) {
    const allTutors = await getAllTutors();

    allTutors.map(async (tutor) => {
        const tutorCourseData = await getTutorCourses(tutor._id);
        /* Add an element for each course onto to page */
        const elementDiv = document.createElement('div');
        parentDiv.appendChild(elementDiv);
        const elementText = document.createElement('p');
        elementText.innerHTML = `${tutor.name} - ${tutor.email}`;
        elementDiv.appendChild(elementText);
        tutorCourseData.map((course) => {
            const elementText2 = document.createElement('p');
            elementText2.innerHTML = `${course.courseId}`;
            elementDiv.appendChild(elementText2);
        });
        const elementButton = document.createElement('button');
        elementButton.innerHTML = 'Add Course';
        elementButton.addEventListener('click', async (e) => {
            //
            console.log('hi');
        });
        elementDiv.appendChild(elementButton);
        return true;
    });
}

async function createTutorView(parentDiv) {}

async function getAllTutors() {
    try {
        const data = await (await fetch('/api/tutors')).json();
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

async function getTutorCourses(tutorId) {
    try {
        const courseData = await (
            await fetch(`/api/users/${tutorId}/courses`)
        ).json();
        console.log(courseData);
        return courseData;
    } catch (err) {
        console.log(err);
    }
}

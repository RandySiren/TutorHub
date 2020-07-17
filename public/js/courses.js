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
    const element = document.createElement('div');

    allCourses.forEach((courseData, index) => {
        if (index % 3 === 0) {
            element.innerHTML += `
                <div class="row">
            `;
        }
        element.innerHTML += `
                        <div class="col-md-4 col-sm-4">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    ${courseData.courseId}<br /> <i>${courseData.name}</i>
                                </div>
                                <div class="panel-footer">
                                    <button class="btn btn-warning" data-toggle="modal" data-target="#myModal${index}">
                                        View Course
                                    </button>
                                    <div class="modal fade" id="myModal${index}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                    <h4 class="modal-title" id="myModalLabel">${courseData.name}</h4>
                                                </div>
                                            <div class="modal-body">
                                                <table>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Course ID:</strong></td>
                                                        <td style="padding:5px">${courseData.courseId}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Course Name:</strong></td>
                                                        <td style="padding:5px">${courseData.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Institution:</strong></td>
                                                        <td style="padding:5px">${courseData.school}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Year:</strong></td>
                                                        <td style="padding:5px">${courseData.level}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-warning">Add Course</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        `;
        if (index % 3 === 2) {
            element.innerHTML += `
                </div>
            `;
        }
        parentDiv.appendChild(element);
    });

    // allCourses.forEach((courseData) => {
    //     const elementDiv = document.createElement('div');
    //     parentDiv.appendChild(elementDiv);
    //     const elementText = document.createElement('p');
    //     elementText.innerHTML = `${courseData.courseId} - ${courseData.name}`;
    //     const elementButton = document.createElement('button');
    //     elementButton.innerHTML = 'Add Course';
    //     elementButton.addEventListener('click', async (e) => {
    //         const success = await addCourse(courseData._id);
    //         if (success) {
    //             alert(`Added ${courseData.courseId}`);
    //         } else {
    //             alert(`You already have ${courseData.courseId}`);
    //         }
    //     });
    //     elementDiv.appendChild(elementText);
    //     elementDiv.appendChild(elementButton);
    // });
}

async function createCourseView(parentDiv) {
    const userCourses = await getUserCourses();
    userCourses.map(async (course) => {
        const elementDiv = document.createElement('div');
        parentDiv.appendChild(elementDiv);
        const elementText = document.createElement('p');
        elementText.innerHTML = `${course.courseId} - ${course.name}`;
        const elementButton = document.createElement('button');
        elementButton.innerHTML = 'Add Course';
        elementButton.addEventListener('click', async () => {
            const success = await addCourse(course._id);
            if (success) {
                alert(`Added ${course.courseId}`);
            } else {
                alert(`You already have ${course.courseId}`);
            }
        });
        elementDiv.appendChild(elementText);
        elementDiv.appendChild(elementButton);
    });
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
        const courseData = await (
            await fetch(`/api/users/${user._id}/courses`)
        ).json();
        return courseData;
    } catch (err) {
        console.log(err);
    }
}

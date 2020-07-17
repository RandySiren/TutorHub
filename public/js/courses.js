document.addEventListener('DOMContentLoaded', async function () {
    let parentDiv = document.querySelector('#courseAddDIV');
    if (parentDiv !== null) {
        createCourseAdd(parentDiv);
    } else {
        parentDiv = document.querySelector('#courseViewDIV');
    }
});

async function createCourseAdd(parentDiv) {
    const allCourses = await getAllCourses();
    const userCourses = await getUserCourses();
    const allCoursesHas = await Promise.all(
        allCourses.map(async (data, index) => {
            const hasCourse1 = await hasCourse(data._id, userCourses);
            const buttonType = {
                class: 'btn-warning',
                text: 'Add Course',
            };
            if (hasCourse1) {
                buttonType.class = 'btn-danger';
                buttonType.text = 'Remove Course';
            }
            return buttonType;
        })
    );
    const element = document.createElement('div');

    await allCourses.map(async (courseData, index) => {
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
                                                <button ty="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn ${allCoursesHas[index].class}" id="add-course-button-${index}">${allCoursesHas[index].text}</button>
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
    for (let i = 0; i < allCourses.length; i += 1) {
        document
            .querySelector(`#add-course-button-${i}`)
            .addEventListener('click', async (e) => {
                if (e.target.innerText === 'Remove Course') {
                    await updateCourse('remove', allCourses[i]._id);
                    document.querySelector(
                        `#add-course-button-${i}`
                    ).className = 'btn btn-warning';
                    document.querySelector(
                        `#add-course-button-${i}`
                    ).innerText = 'Add Course';
                } else {
                    await updateCourse('add', allCourses[i]._id);
                    document.querySelector(
                        `#add-course-button-${i}`
                    ).className = 'btn btn-danger';
                    document.querySelector(
                        `#add-course-button-${i}`
                    ).innerText = 'Remove Course';
                }
            });
    }
}

async function hasCourse(courseRawId, userCourses) {
    let hasCourse = false;
    userCourses.forEach((course) => {
        if (course._id === courseRawId) {
            hasCourse = true;
        }
    });
    return hasCourse;
}

async function getAllCourses() {
    try {
        const data = await (await fetch('/api/courses')).json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function updateCourse(method, courseRawId) {
    try {
        const response = await fetch(`/api/courses/${method}/${courseRawId}`, {
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

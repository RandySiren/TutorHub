document.addEventListener('DOMContentLoaded', async function () {
    let parentDiv = document.querySelector('#tutorAddDIV');
    if (parentDiv !== null) {
        createTutorAdd(parentDiv);
    } else {
        parentDiv = document.querySelector('#tutorViewDIV');
        createTutorView(parentDiv);
    }
});

async function createTutorView(parentDiv) {
    const userTutors = await getUserTutors();
    const allTutorData = await Promise.all(
        userTutors.map(async (data, index) => {
            const tutorCourseData = await getTutorCourses(data._id);
            let courseText = ``;
            tutorCourseData.forEach((course) => {
                courseText += `${course.courseId} - ${course.name}<br />`;
            });
            const tutorData = {
                courseText,
                class: 'btn-danger',
                text: 'Remove Tutor',
            };
            return tutorData;
        })
    );
    const element = document.createElement('div');
    userTutors.map(async (tutor, index) => {
        /* Add an element for each course onto to page */

        if (index % 3 === 0) {
            element.innerHTML += `
                <div class="row">
            `;
        }
        element.innerHTML += `
                        <div class="col-md-4 col-sm-4">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    ${tutor.name}<br /> <i>${tutor.email}</i>
                                </div>
                                <div class="panel-footer">
                                    <button class="btn btn-warning" data-toggle="modal" data-target="#myModal${index}">
                                        View Tutor
                                    </button>
                                    <div class="modal fade" id="myModal${index}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                    <h4 class="modal-title" id="myModalLabel">${tutor.name}</h4>
                                                </div>
                                            <div class="modal-body">
                                                <table>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Tutor Name:</strong></td>
                                                        <td style="padding:5px">${tutor.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Tutor E-mail:</strong></td>
                                                        <td style="padding:5px">${tutor.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Courses:</strong></td>
                                                        <td style="padding:5px">${allTutorData[index].courseText}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-warning" id="view-tutor-button-${index}">More Info</button>
                                                <button type="button" class="btn ${allTutorData[index].class}" id="add-tutor-button-${index}">${allTutorData[index].text}</button>
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
    if (userTutors.length === 0) {
        element.innerHTML += `
            <h3>You have no Tutors, go add some!</h3>`;
        parentDiv.appendChild(element);
    }
    for (let i = 0; i < userTutors.length; i += 1) {
        document
            .querySelector(`#view-tutor-button-${i}`)
            // eslint-disable-next-line no-loop-func
            .addEventListener('click', (_e) => {
                window.location = `/tutors/view/${userTutors[i]._id}`;
            });
        document
            .querySelector(`#add-tutor-button-${i}`)
            .addEventListener('click', async (e) => {
                if (e.target.innerText === 'Remove Tutor') {
                    await updateTutor('remove', userTutors[i]._id);
                }
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            });
    }
}

async function createTutorAdd(parentDiv) {
    const allTutors = await getAllTutors();
    const userTutors = await getUserTutors();
    const allTutorData = await Promise.all(
        allTutors.map(async (data, index) => {
            const tutorCourseData = await getTutorCourses(data._id);
            let courseText = ``;
            tutorCourseData.forEach((course) => {
                courseText += `${course.courseId} - ${course.name}<br />`;
            });
            const hasTutor1 = await hasTutor(data._id, userTutors);
            const tutorData = {
                courseText,
                class: 'btn-warning',
                text: 'Add Tutor',
            };
            if (hasTutor1) {
                tutorData.class = 'btn-danger';
                tutorData.text = 'Remove Tutor';
            }
            return tutorData;
        })
    );

    const element = document.createElement('div');
    allTutors.map(async (tutor, index) => {
        /* Add an element for each course onto to page */

        if (index % 3 === 0) {
            element.innerHTML += `
                <div class="row">
            `;
        }
        element.innerHTML += `
                        <div class="col-md-4 col-sm-4">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    ${tutor.name}<br /> <i>${tutor.email}</i>
                                </div>
                                <div class="panel-footer">
                                    <button class="btn btn-warning" data-toggle="modal" data-target="#myModal${index}">
                                        View Tutor
                                    </button>
                                    <div class="modal fade" id="myModal${index}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                    <h4 class="modal-title" id="myModalLabel">${tutor.name}</h4>
                                                </div>
                                            <div class="modal-body">
                                                <table>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Tutor Name:</strong></td>
                                                        <td style="padding:5px">${tutor.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Tutor E-mail:</strong></td>
                                                        <td style="padding:5px">${tutor.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:5px"><strong>Courses:</strong></td>
                                                        <td style="padding:5px">${allTutorData[index].courseText}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-warning" id="view-tutor-button-${index}">More Info</button>
                                                <button type="button" class="btn ${allTutorData[index].class}" id="add-tutor-button-${index}">${allTutorData[index].text}</button>
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
    for (let i = 0; i < allTutors.length; i += 1) {
        document
            .querySelector(`#view-tutor-button-${i}`)
            .addEventListener('click', (e) => {
                window.location = `/tutors/view/${allTutors[i]._id}`;
            });
        document
            .querySelector(`#add-tutor-button-${i}`)
            // eslint-disable-next-line no-loop-func
            .addEventListener('click', async (e) => {
                if (e.target.innerText === 'Remove Tutor') {
                    await updateTutor('remove', allTutors[i]._id);
                    document.querySelector(`#add-tutor-button-${i}`).innerText =
                        'Add Tutor';
                    document.querySelector(`#add-tutor-button-${i}`).className =
                        'btn btn-warning';
                } else {
                    await updateTutor('add', allTutors[i]._id);
                    document.querySelector(`#add-tutor-button-${i}`).innerText =
                        'Remove Tutor';
                    document.querySelector(`#add-tutor-button-${i}`).className =
                        'btn btn-danger';
                }
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            });
    }
}

async function hasTutor(tutorId, userTutors) {
    let hasTutor = false;
    userTutors.forEach((tutor) => {
        if (tutor._id === tutorId) {
            hasTutor = true;
        }
    });
    return hasTutor;
}

async function updateTutor(method, tutorRawId) {
    try {
        const response = await fetch(`/api/tutors/${method}/${tutorRawId}`, {
            method: 'POST',
        });
        const blob = await response.json();
        return blob.message === 'Added';
    } catch (err) {
        console.log(err);
    }
}

async function getUserTutors() {
    try {
        const user = await (await fetch(`/users/me`)).json();
        const tutorData = await (
            await fetch(`/api/users/${user._id}/tutors`)
        ).json();
        return tutorData;
    } catch (err) {
        console.log(err);
    }
}

async function getAllTutors() {
    try {
        const data = await (await fetch('/api/tutors')).json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getTutorCourses(tutorId) {
    try {
        const tutorCourseData = await (
            await fetch(`/api/users/${tutorId}/courses`)
        ).json();
        return tutorCourseData;
    } catch (err) {
        console.log(err);
    }
}

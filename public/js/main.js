/*
Main landing page javascript
This artifact is ran when a user logs into the website and is redirected to the homepage
Written by Mandeep Sran on July 30th 2020 and approved by Joseph Power on Aug 1st 2020.

File extends capabilities with the following functions:
- createTutorRequestAdminPanel (Creates panel for a tutor request)
- getTutorRequests (Gets the list of open tutor requests)
- updateRequest (Updates the status of a tutor request)


*/
document.addEventListener('DOMContentLoaded', async function () {
    let parentDiv = document.querySelector('#tutorrequests');
    if (parentDiv !== null) {
        createTutorRequestAdminPanel(parentDiv);
    } else {
        parentDiv = document.querySelector('#courseViewDIV');
    }
});

async function createTutorRequestAdminPanel(parentDiv) {
    const tutorRequests = await getTutorRequests();
    await tutorRequests.map((tutorRequest, index) => {
        const element = document.createElement('tr');
        element.innerHTML += `
        <td>${tutorRequest.name}</td>
        <td>${tutorRequest.email}</td>
        <td>
            <button type="button" class="btn btn-success" id="btn-accept-${index}">Accept</button>
            <button type="button" class="btn btn-danger" id="btn-deny-${index}">Deny</button>
        </td>`;
        parentDiv.appendChild(element);
    });
    for (let i = 0; i < tutorRequests.length; i += 1) {
        document
            .querySelector(`#btn-accept-${i}`)
            // eslint-disable-next-line no-loop-func
            .addEventListener('click', async (_e) => {
                await updateRequest('accept', tutorRequests[i]._id);
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            });
        document
            .querySelector(`#btn-deny-${i}`)
            // eslint-disable-next-line no-loop-func
            .addEventListener('click', async (_e) => {
                await updateRequest('deny', tutorRequests[i]._id);
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            });
    }
}

async function getTutorRequests() {
    try {
        const tutorRequests = await (
            await fetch(`/admin/tutorrequests`)
        ).json();
        return tutorRequests;
    } catch (err) {
        console.log(err);
    }
}

async function updateRequest(method, id) {
    try {
        await fetch(`/admin/tutorrequests/${method}/${id}`, {
            method: 'DELETE',
        });
    } catch (err) {
        console.log(err);
    }
}

const url = "http://127.0.0.1:5000/"
let studentName="test"

// Sets default button tab open when accessing student/professor page (that being "My courses") (FOR CSS)
function setActiveButton(clickedButton) {
    const buttons = document.querySelectorAll('.courses');
    buttons.forEach(button => button.classList.remove('active'));
    clickedButton.classList.add('active');
}

// "My courses" tab placeholder (FOR CSS)
function viewYourCourses() {
    console.log("viewing your courses")
    const myCoursesElement = document.querySelector('.myCourses');
    const addCoursesElement = document.querySelector('.addCourses');
    
    if (myCoursesElement) {
        myCoursesElement.style.display = 'block';
    }
    if (addCoursesElement) {
        addCoursesElement.style.display = 'none';
    }
}

// "Add courses" tab placeholder (FOR CSS)
function viewAddCourses(){
    console.log("viewing add courses")
    const myCoursesElement = document.querySelector('.myCourses');
    const addCoursesElement = document.querySelector('.addCourses');
    
    if (myCoursesElement) {
        myCoursesElement.style.display = 'none';
    }
    if (addCoursesElement) {
        addCoursesElement.style.display = 'block';
    }
}

let studentCoursesData = [];

// Available courses test
let availableCoursesData = [
    {
        course: 'CSE 108',
        teacher: 'Professor Smith',
        time: 'Monday',
        enrolled: '3',
        capacity: '3',
        isEnrolled: true
    },
    {
        course: 'CSE 162',
        teacher: 'Professor Davis',
        time: 'Tuesday',
        enrolled: '5',
        capacity: '5',
        isEnrolled: false
    },
    {
        course: 'CSE 172',
        teacher: 'Professor Davis',
        time: 'Tuesday',
        enrolled: '5',
        capacity: '7',
        isEnrolled: false
    }
];


// Populates courses table for student page
function loadStudentCourses() {
    const tableBody = document.getElementById('mycourses-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    studentCoursesData.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.course}</td>
            <td>${course.teacher}</td>
            <td>${course.time}</td>
            <td>${course.enrolled}/${course.capacity}</td>
        `;
        tableBody.appendChild(row);
    });
        viewYourCourses();
    
}

// Populates add courses table for student page
function loadAddCourses() {
    const tableBody = document.getElementById('student-add-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    availableCoursesData.forEach(course => {
        const row = document.createElement('tr');
        const buttonText = course.isEnrolled ? 'Remove' : 'Add';
        const buttonClass = course.isEnrolled ? 'remove-button' : 'add-button';
        const onClick = course.isEnrolled ? `removeCourse('${course.course}')` : `addCourse('${course.course}')`;
        if(!course.isEnrolled && course.capacity==course.enrolled){
                row.innerHTML = `
                <td>${course.course}</td>
                <td>${course.teacher}</td>
                <td>${course.time}</td>
                <td>${course.enrolled}/${course.capacity}</td>
                <td></td>
            `;
        }else{
            row.innerHTML = `
                <td>${course.course}</td>
                <td>${course.teacher}</td>
                <td>${course.time}</td>
                <td>${course.enrolled}/${course.capacity}</td>
                <td><button class="${buttonClass}" onclick="${onClick}">${buttonText}</button></td>
            `;
        }
        tableBody.appendChild(row);
    });
    viewAddCourses();
}

function removeCourse(course){
    console.log("remove class "+String(course))
    let courseNameFormatted= course.replace(" ","_")
    fetch(url+"courseUpdate/"+studentName+"/"+courseNameFormatted, {
        method: "DELETE",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        availableCoursesData=data;
        loadAddCourses();

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function addCourse(course){
    console.log("add class "+String(course))
    let courseNameFormatted= course.replace(" ","_")
    fetch(url+"courseUpdate/"+studentName+"/"+courseNameFormatted, {
        method: "POST",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        availableCoursesData=data;
        loadAddCourses();

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function getYourCourses(){
    fetch(url+"student/"+studentName+"/my_courses", {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        studentCoursesData=data;
        loadStudentCourses();

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}



function getAddCourses(){
    fetch(url+"student/"+studentName+"/all_courses", {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        availableCoursesData=data;
        loadAddCourses();

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}
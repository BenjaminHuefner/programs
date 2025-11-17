
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

// INITIAL TABLE DATA FOR TESTING
// Professor page course data
// Student page course data
const studentCoursesData = [
    {
        course: 'CSE 108',
        teacher: 'Professor Smith',
        time: 'Monday',
        enrolled: '3'
    },
    {
        course: 'CSE 30',
        teacher: 'Professor Johnson',
        time: 'Monday',
        enrolled: '2'
    }
];

// Available courses test
const availableCoursesData = [
    {
        course: 'CSE 108',
        teacher: 'Professor Smith',
        time: 'Monday',
        enrolled: '3',
        isEnrolled: true
    },
    {
        course: 'CSE 30',
        teacher: 'Professor Johnson',
        time: 'Monday',
        enrolled: '2',
        isEnrolled: true
    },
    {
        course: 'CSE 162',
        teacher: 'Professor Davis',
        time: 'Tuesday',
        enrolled: '5',
        isEnrolled: false
    },
    {
        course: 'CSE 220',
        teacher: 'Professor Miller',
        time: 'Wednesday',
        enrolled: '4',
        isEnrolled: false
    },
    {
        course: 'MATH 100',
        teacher: 'Professor Miller',
        time: 'Wednesday',
        enrolled: '4',
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
            <td>${course.enrolled}</td>
        `;
        tableBody.appendChild(row);
    });
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
        
        row.innerHTML = `
            <td>${course.course}</td>
            <td>${course.teacher}</td>
            <td>${course.time}</td>
            <td>${course.enrolled}</td>
            <td><button class="${buttonClass}" onclick="${onClick}">${buttonText}</button></td>
        `;
        tableBody.appendChild(row);
    });
}


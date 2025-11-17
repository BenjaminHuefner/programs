// Displays status messages on sign in (FOR CSS)
function displayMessage(elementID, message, type){
    const element = document.getElementById(elementID);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    const messageDiv = element.firstElementChild;
    messageDiv.style.opacity = '1';
    setTimeout(() => {
        messageDiv.style.opacity = '0';
    }, 100);
}

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

// Show courses list (FOR CSS)
function showCoursesList() {
    document.getElementById('courses-table').style.display = 'table';
    document.getElementById('course-detail-table').style.display = 'none';
    document.getElementById('back-button').style.display = 'none';
    
    // Restore tab title to 'Your Courses'
    document.querySelector('.tab-title').textContent = 'Your Courses';
}

// Sign in placeholder, called when pressing the sign in button for testing login
function signin(){
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!name || !password){
        displayMessage('message-display', 'Please enter username and password.', 'error')
        return;
    }
    else if (name == 'admin' && password == '123') {
        displayMessage('message-display', 'Successfully logged into admin.', 'success')
        window.location.href= `admin.html?username=${name}`;
        return;
    }
    else if (name == 'professor' && password == '123') {
        displayMessage('message-display', 'Successfully logged into professor.', 'success')
        window.location.href= `professor.html?username=${name}`;
        return;
    }
    else if (name == 'student' && password == '123') {
        displayMessage('message-display', 'Successfully logged into student.', 'success')
        window.location.href= `student.html?username=${name}`;
        return;
    }
    else {
        displayMessage('message-display', 'Invalid username or password.', 'error')
        return;
    }
}

// INITIAL TABLE DATA FOR TESTING
// Professor page course data
const coursesData = [
    {
        course: 'CSE 108',
        teacher: 'Professor Smith',
        time: 'Monday',
        enrolled: '3',
        students: [
            { name: 'Michael', grade: 92 },
            { name: 'Ben', grade: 95 },
            { name: 'Salvador', grade: 99}
        ]
    },
    {
        course: 'CSE 30',
        teacher: 'Professor Johnson',
        time: 'Monday',
        enrolled: '2',
        students: [
            { name: 'Sarah', grade: 92 },
            { name: 'John', grade: 85 }
        ]
    }
];

// Populates courses table
function loadCourses() {
    const tableBody = document.getElementById('mycourses-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    coursesData.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="showCourseDetails('${course.course}'); return false;" style="text-decoration: underline; color: inherit; font-size: 1em;">${course.course}</a></td>
            <td>${course.teacher}</td>
            <td>${course.time}</td>
            <td>${course.enrolled}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Show course details with students
function showCourseDetails(courseName) {
    const course = coursesData.find(c => c.course === courseName);
    if (!course) return;
    
    // Hide courses table and show students table
    document.getElementById('courses-table').style.display = 'none';
    document.getElementById('course-detail-table').style.display = 'table';
    document.getElementById('back-button').style.display = 'block';
    
    // Update tab title to show course name
    document.querySelector('.tab-title').textContent = courseName;
    
    // Populate students table
    const studentsBody = document.getElementById('course-detail-table-body');
    studentsBody.innerHTML = '';
    
    course.students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td contenteditable="true" data-student-index="${index}">${student.grade}</td>
        `;
        
        // Event Listener for grade changes
        const gradeCell = row.querySelector('td[contenteditable="true"]');
        gradeCell.addEventListener('blur', function() {
            const newGrade = parseInt(this.textContent.trim());
            if (!isNaN(newGrade)) {
                course.students[index].grade = newGrade;
                console.log(`Updated ${student.name}'s grade to ${newGrade}`);
            } else {
                this.textContent = course.students[index].grade;
            }
        });
        
        studentsBody.appendChild(row);
    });
}


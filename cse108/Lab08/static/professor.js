const url = "http://127.0.0.1:5000/"
let professorName="test"
let currStudents=[
            // { name: 'Michael', grade: 92 },
            // { name: 'Ben', grade: 95 },
            // { name: 'Salvador', grade: 99}
        ]
let coursesData = []

function getCourses(name){
    professorName=name
    console.log(name)
    fetch(url+"teacher/"+name+"/courses", {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        coursesData=data;
        loadCourses();

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function getEnrollments(course){
    let courseNameFormatted= course.replace(" ","_")
    fetch(url+"grades/"+professorName+"/"+courseNameFormatted, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
        return response.json();
      })
      .then(data => {
        currStudents=data;
        showCourseDetails(course);

      })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function updateGrade(course,student,grade){
    let courseNameFormatted= course.replace(" ","_")
    let studentNameFormatted= student.replace(" ","_")
    fetch(url+"gradeUpdate/"+professorName+"/"+courseNameFormatted+"/"+studentNameFormatted, {
        method: "POST",
        headers: {
            'Content-Type': 'text/plain'
        },
        body: String(grade)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP Error: "+response.status);
        }
      })
    .catch((error) => {
        console.error("Error:", error);
    });
}
// Show courses list (FOR CSS)
function showCoursesList() {
    document.getElementById('courses-table').style.display = 'table';
    document.getElementById('course-detail-table').style.display = 'none';
    document.getElementById('back-button').style.display = 'none';
    
    // Restore tab title to 'Your Courses'
    document.querySelector('.tab-title').textContent = 'Your Courses';
}

// INITIAL TABLE DATA FOR TESTING
// Professor page course data


// Populates courses table for professor page
function loadCourses() {
    const tableBody = document.getElementById('mycourses-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    coursesData.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="getEnrollments('${course.course}'); return false;" style="text-decoration: underline; color: inherit; font-size: 1em;">${course.course}</a></td>
            <td>${course.teacher}</td>
            <td>${course.time}</td>
            <td>${course.enrolled}/${course.capacity}</td>
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
    
    document.querySelector('.tab-title').textContent = courseName;

    const studentsBody = document.getElementById('course-detail-table-body');
    studentsBody.innerHTML = '';
    
    currStudents.forEach((student, index) => {
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
                currStudents[index].grade = newGrade;
                console.log(`Updated ${student.name}'s grade to ${newGrade}`);
                updateGrade(courseName,student.name,String(newGrade))

            } else {
                this.textContent = currStudents[index].grade;
            }
        });
        
        studentsBody.appendChild(row);
    });
}


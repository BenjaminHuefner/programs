

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

// Populates courses table for professor page
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
    
    document.querySelector('.tab-title').textContent = courseName;

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


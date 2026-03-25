// Table reference
const tbody = document.querySelector("#attendanceTable tbody");
const addStudentBtn = document.getElementById("addStudentBtn");

// Load students from localStorage or empty object
let students = JSON.parse(localStorage.getItem("students")) || {};

// Get current date dd/mm/yyyy
function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

// Save to localStorage
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Calculate attendance % realistically
function calcPercent(student) {
    const total = students[student].present + students[student].absent;
    if (total < 2) return "N/A"; // less than 2 classes → don't show %
    return ((students[student].present / total) * 100).toFixed(1) + "%";
}

// Create table row
function createStudentRow(name) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-student", name);

    tr.innerHTML = `
        <td>${name}</td>
        <td><button class="presentBtn">Present</button></td>
        <td><button class="absentBtn">Absent</button></td>
        <td class="dateCell">${getCurrentDate()}</td>
        <td><button class="deleteBtn">Delete</button></td>
        <td class="totalPresent">${students[name].present}</td>
        <td class="totalAbsent">${students[name].absent}</td>
        <td class="attendancePercent">${calcPercent(name)}</td>
    `;

    // Event listeners
    tr.querySelector(".presentBtn").addEventListener("click", () => updateAttendance(name, "present", tr));
    tr.querySelector(".absentBtn").addEventListener("click", () => updateAttendance(name, "absent", tr));
    tr.querySelector(".deleteBtn").addEventListener("click", () => {
        delete students[name];
        tr.remove();
        saveData();
    });

    tbody.appendChild(tr);
}

// Update attendance
function updateAttendance(name, type, row) {
    if (type === "present") students[name].present++;
    else if (type === "absent") students[name].absent++;

    row.querySelector(".totalPresent").textContent = students[name].present;
    row.querySelector(".totalAbsent").textContent = students[name].absent;
    row.querySelector(".attendancePercent").textContent = calcPercent(name);

    saveData();
}

// Load existing students on page load
for (let student in students) {
    createStudentRow(student);
}

// Add new student
addStudentBtn.addEventListener("click", () => {
    const studentName = prompt("Enter student name:");
    if (studentName && !students[studentName]) {
        students[studentName] = { present: 0, absent: 0 };
        createStudentRow(studentName);
        saveData();
    } else if (students[studentName]) {
        alert("Student already exists!");
    }
});

// Auto-update date every hour
setInterval(() => {
    document.querySelectorAll(".dateCell").forEach(cell => {
        cell.textContent = getCurrentDate();
    });
}, 1000 * 60 * 60);

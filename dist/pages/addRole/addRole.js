import { RoleService } from "../../services/roleService.js";
let inputName = document.getElementById("input-text-box");
let inputLocation = document.getElementById("location");
let inputDepartment = document.getElementById("department");
let inputDescription = document.getElementById("description");
const employeeListDiv = document.querySelector(".assign-role-employee-list");
const assignDiv = document.querySelector(".assign-employee");
const selectedEmployeesList = [];
let rolesData = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
let employeesData = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
let roleService = new RoleService();
init();
function init() {
    window.selectEmployeeToAssign = selectEmployeeToAssign;
    window.addInAssignedEmployees = addInAssignedEmployees;
    window.searchEmployee = searchEmployee;
    window.addRole = addRole;
    window.cancelAddRole = cancelAddRole;
    document.addEventListener("click", (e) => {
        let isClickedInside = assignDiv.contains(e.target);
        if (!isClickedInside) {
            employeeListDiv.classList.remove("active");
        }
    });
}
function selectEmployeeToAssign(selectBtn) {
    populateEmployeesList();
    employeeListDiv.classList.toggle("active");
}
function populateEmployeesList() {
    employeesData.forEach((employee) => {
        let fullName = employee.firstName + " " + employee.lastName;
        let emp = document.createElement("div");
        emp.innerHTML = `
        <div class="employee-list-container">
            <p>${fullName}</p>
            <input type="checkbox" onchange="addInAssignedEmployees(this,'${employee.empId}')"/>
        </div>
        `;
        employeeListDiv.appendChild(emp);
    });
}
function addInAssignedEmployees(checkbox, empId) {
    if (!selectedEmployeesList.includes(empId)) {
        selectedEmployeesList.push(empId);
    }
    else {
        selectedEmployeesList.splice(selectedEmployeesList.indexOf(empId), 1);
    }
}
function searchEmployee() {
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("employee-list-container");
    for (let i = 0; i < x.length; i++) {
        let element = x[i].children[0].textContent.toLowerCase();
        if (!element.includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "flex";
        }
    }
}
function showError(input, msg) {
    if (msg.length != 0)
        input.style.outline = "2px solid red";
    else {
        input.style.outline = "2px solid #e0e4e4";
    }
    input.nextElementSibling.innerHTML = `${msg}`;
}
function validateRole() {
    let roleId = roleService.generateRoleId(inputName.value, inputLocation.value);
    let b = true;
    if (inputLocation.value == "") {
        showError(inputLocation, "&#9888 cant be empty");
        b = false;
    }
    else {
        showError(inputLocation, "");
    }
    if (inputName.value == "") {
        showError(inputName, "&#9888 cant be empty");
        b = false;
    }
    else {
        showError(inputName, "");
    }
    if (roleId in rolesData) {
        showError(inputName, "role already exist");
        b = false;
    }
    else {
        showError(inputName, "");
    }
    return b;
}
function addRole() {
    if (!validateRole()) {
        validateRole();
    }
    let newRoleId = roleService.generateRoleId(inputName.value, inputLocation.value);
    let empArr = selectedEmployeesList;
    let newRole = {
        roleId: newRoleId,
        roleName: inputName.value,
        department: inputDepartment.value,
        roleDesc: inputDescription.value,
        location: inputLocation.value,
        employees: empArr,
    };
    rolesData.push(newRole);
    updateEmployeesData(newRoleId, rolesData, empArr);
}
function updateEmployeesData(newRoleId, rolesData, empArr) {
    employeesData.forEach((emp) => {
        if (empArr.includes(emp.empId)) {
            rolesData = roleService.removeEmployeeFromRole(emp.empId, emp.roleId, newRoleId, rolesData);
            emp.roleId = newRoleId;
        }
    });
    localStorage.setItem("employeesDetails", JSON.stringify(employeesData));
    localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
    alert("The role is added");
    window.parent.postMessage("added");
}
function cancelAddRole() {
    window.parent.postMessage("cancelled");
}

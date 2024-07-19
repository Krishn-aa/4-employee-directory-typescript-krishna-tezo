import Employee from "../../models/employee";
import Role from "../../models/role";
import { RoleService } from "../../services/roleService.js";

let inputName = document.getElementById("input-text-box") as HTMLInputElement;
let inputLocation = document.getElementById("location") as HTMLSelectElement;
let inputDepartment = document.getElementById(
  "department"
) as HTMLSelectElement;
let inputDescription = document.getElementById(
  "description"
) as HTMLInputElement;

const employeeListDiv = document.querySelector(".assign-role-employee-list")!;
const assignDiv = document.querySelector(".assign-employee")!;
const selectedEmployeesList: string[] = []!;

let rolesData: Role[] = JSON.parse(
  localStorage.getItem("rolesDetails") || "{}"
);

let employeesData: Employee[] = JSON.parse(
  localStorage.getItem("employeesDetails") || "{}"
);

let roleService = new RoleService();

declare global {
  interface Window {
    selectEmployeeToAssign: Function;
    addInAssignedEmployees: Function;
    searchEmployee: Function;
    addRole: Function;
    cancelAddRole: Function;
  }
}

init();
function init() {
  window.selectEmployeeToAssign = selectEmployeeToAssign;
  window.addInAssignedEmployees = addInAssignedEmployees;
  window.searchEmployee = searchEmployee;
  window.addRole = addRole;
  window.cancelAddRole = cancelAddRole;

  // Check for dropdown collapse
  document.addEventListener("click", (e) => {
    let isClickedInside = assignDiv.contains(e.target as Node);
    if (!isClickedInside) {
      employeeListDiv.classList.remove("active");
    }
  });
}

// Assign Employee dropdown check
function selectEmployeeToAssign(selectBtn: HTMLDivElement) {
  populateEmployeesList();
  employeeListDiv.classList.toggle("active");
}

//Populate dropdown employee list
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

function addInAssignedEmployees(checkbox: HTMLInputElement, empId: string) {
  if (!selectedEmployeesList.includes(empId)) {
    selectedEmployeesList.push(empId);
  } else {
    selectedEmployeesList.splice(selectedEmployeesList.indexOf(empId), 1);
  }
}

//Search bar in assign employee dropdown
function searchEmployee() {
  let input = (document.getElementById("searchbar")! as HTMLInputElement).value;
  input = input.toLowerCase();
  let x = document.getElementsByClassName(
    "employee-list-container"
  )! as HTMLCollectionOf<HTMLDivElement>;

  for (let i = 0; i < x.length; i++) {
    let element = x[i].children[0].textContent!.toLowerCase();
    if (!element.includes(input)) {
      x[i].style.display = "none";
    } else {
      x[i].style.display = "flex";
    }
  }
}

//Form validation msg error
function showError(input: HTMLInputElement | HTMLSelectElement, msg: string) {
  if (msg.length != 0) input.style.outline = "2px solid red";
  else {
    input.style.outline = "2px solid #e0e4e4";
  }
  input.nextElementSibling!.innerHTML = `${msg}`;
}

// Add role form validation
function validateRole() {
  let roleId = roleService.generateRoleId(inputName.value, inputLocation.value);
  let b = true;
  if (inputLocation.value == "") {
    showError(inputLocation, "&#9888 cant be empty");
    b = false;
  } else {
    showError(inputLocation, "");
  }
  if (inputName.value == "") {
    showError(inputName, "&#9888 cant be empty");
    b = false;
  } else {
    showError(inputName, "");
  }
  if (roleId in rolesData) {
    showError(inputName, "role already exist");
    b = false;
  } else {
    showError(inputName, "");
  }

  return b;
}

//Adding role to the employeesDatabase
function addRole() {
  if (!validateRole()) {
    validateRole();
  }

  let newRoleId = roleService.generateRoleId(
    inputName.value,
    inputLocation.value
  );
  let empArr = selectedEmployeesList;

  let newRole: Role = {
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

//Updating employeesData with newly assigned role
function updateEmployeesData(
  newRoleId: string,
  rolesData: Role[],
  empArr: string[]
) {
  //Remove employee from its previous role
  employeesData.forEach((emp) => {
    if (empArr.includes(emp.empId)) {
      rolesData = roleService.removeEmployeeFromRole(
        emp.empId,
        emp.roleId,
        newRoleId,
        rolesData
      );
      emp.roleId = newRoleId;
    }
  });
  localStorage.setItem("employeesDetails", JSON.stringify(employeesData));
  localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
  alert("The role is added");
  window.parent.postMessage("added");
}

//Cancel Add Role
function cancelAddRole() {
  window.parent.postMessage("cancelled");
}

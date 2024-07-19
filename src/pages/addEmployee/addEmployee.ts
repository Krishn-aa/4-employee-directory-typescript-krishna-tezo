import Employee from "../../models/employee";
import Role from "../../models/role";
import { RoleService } from "../../services/roleService.js";
import { sidePanelToggle } from "../common/common.js";

const roleService = new RoleService();

const form = document.querySelector("#employeeForm")! as HTMLFormElement;
const btn = document.querySelector("#submit-button")! as HTMLButtonElement;
let uploadPicture = document.getElementById(
  "uploadPicture"
)! as HTMLInputElement;
let rolesData = JSON.parse(
  localStorage.getItem("rolesDetails") || "{}"
) as Role[];
let employeesData = JSON.parse(
  localStorage.getItem("employeesDetails") || "{}"
) as Employee[];

let inputEmpNo = document.getElementById("empNo")! as HTMLInputElement;
let inputFirstName = document.getElementById("firstName")! as HTMLInputElement;
let inputLastName = document.getElementById("lastName")! as HTMLInputElement;
let inputDOB = document.getElementById("dob")! as HTMLInputElement;
let inputEmail = document.getElementById("email")! as HTMLInputElement;
let inputMobNo = document.getElementById("mobNumber")! as HTMLInputElement;
let inputJoinDate = document.getElementById("joinDate")! as HTMLInputElement;
let inputLocation = document.getElementById("location")! as HTMLSelectElement;
let inputRoleName = document.getElementById("roleName")! as HTMLSelectElement;
let inputDepartment = document.getElementById(
  "department"
)! as HTMLSelectElement;
let inputManager = document.getElementById("managerName")! as HTMLSelectElement;
let inputProject = document.getElementById("projectName")! as HTMLSelectElement;
let roles: Role[] = JSON.parse(localStorage.getItem("rolesDetails") || "{}");

let empId: string;
let roleId: string;
let employeeInfo: Employee;
let employeePicURL: string;
let userInputValid = false;
let isEditEmployeeForm = false;
let isViewEmployeeForm = false;

declare global {
  interface Window {
    manageSidePanelToggle: Function;
    cancelAddEmployee: Function;
  }
}

window.cancelAddEmployee = cancelAddEmployee;
window.manageSidePanelToggle = manageSidePanelToggle;

init();
function init() {
  //Check if page info or add employee or edit employee or add employee with fixed role
  let url = new URL(document.URL);
  let params = new URLSearchParams(url.search);
  if (params.get("action") != null) {
    if (params.get("action") == "viewemployee") {
      empId = params.get("id")!;
      isEditEmployeeForm = false;
      isViewEmployeeForm = true;

      for (let employee of employeesData) {
        if (employee.empId == empId) {
          employeeInfo = employee;
          setFormDataInfo(employeeInfo, employee.empId);
          break;
        }
      }
    } else if (params.get("action") == "addemployee") {
      roleId = params.get("id")!;
      setFormDataRole(roleId, rolesData);
    } else if (params.get("action") == "editemployee") {
      empId = params.get("id")!;
      isEditEmployeeForm = true;
      for (let employee of employeesData) {
        if (employee.empId == empId) {
          employeeInfo = employee;
          setFormDataInfo(employeeInfo, employee.empId);
          break;
        }
      }
    }
  } else {
    manageRoleChain();
  }

  // Add new employee
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (validateUserInput()) {
      addEmployee();
    }
  });

  uploadPicture.onchange = (evt) => {
    const file = uploadPicture.files![0];
    if (file) {
      getBaseUrl(file);
    }
  };
}

let isCollapsed = false;
function manageSidePanelToggle() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    sidePanelToggle(isCollapsed);
  } else {
    sidePanelToggle(isCollapsed);
    isCollapsed = !isCollapsed;
  }
}

function addTheSelectOption(
  selectInput: HTMLSelectElement,
  selectName: string,
  selectValue: string
) {
  //Create the new option to display
  let newOption = document.createElement("option");
  newOption.value = selectValue;
  newOption.innerHTML = selectValue;
  selectInput.appendChild(newOption);
}

// Set all values for view or edit employee
function setFormDataInfo(emp: Employee, empId: string) {
  roles = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
  //Remove the employee from the current role
  let roleId = emp["roleId"];
  let empArr = roleService.getRolesDataById(roleId, "employees", rolesData);
  if (typeof empArr == "object") {
    empArr.splice(empArr.indexOf(empId), 1);
  }

  let formInputs = document.getElementsByClassName(
    "add-employee-input"
  )! as HTMLCollectionOf<HTMLInputElement>;
  let selectInputs = document.getElementsByClassName(
    "add-employee-select-inputs"
  )! as HTMLCollectionOf<HTMLSelectElement>;
  let heading = document.querySelector(
    ".add-employee-container h1"
  )! as HTMLHeadElement;
  let uploadBtn = document.querySelector(
    ".upload-profile-pic-btn"
  )! as HTMLButtonElement;
  let profilePic = document.querySelector(
    "#profileImagePreview"
  )! as HTMLImageElement;
  let addEmployeeBtn = document.querySelector(
    "#submit-button"
  )! as HTMLButtonElement;

  if (isViewEmployeeForm) {
    addEmployeeBtn.style.display = "none";
    uploadBtn.classList.add("hide");
    heading.innerHTML = "Employee Info";
  } else if (isEditEmployeeForm) {
    addEmployeeBtn.innerHTML = "Update Employee";
    heading.innerHTML = "Edit Employee";
    uploadBtn.innerHTML = "Edit Profile Picture";
    employeePicURL = emp["empProfilePic"];
  }
  profilePic.style.scale = "1.2";
  profilePic.src = emp["empProfilePic"];

  for (let input of formInputs) {
    let inputName: string = input.name;
    if (input.name == "empNo") {
      input.value = empId;
    } else if (input.name != "profileImage") {
      let p2 = inputName;
      input.value = emp[inputName as keyof Employee];
    }
    if (!isEditEmployeeForm || input.name == "empNo") input.disabled = true;
  }

  for (let select of selectInputs) {
    let selectName = select.name;

    if (selectName == "managerName" || selectName == "projectName") {
      addTheSelectOption(select, selectName, emp[selectName as keyof Employee]);
      select.value = emp[selectName];
    } else {
      if (select.name == "department") {
        manageRoleChain("department");
      } else if (select.name == "roleName") {
        manageRoleChain("roleName");
      } else if (select.name == "location") {
        manageRoleChain("location");
      }
      select.value = roleService.getRolesDataById(
        roleId,
        selectName,
        rolesData
      ) as string;
    }
    if (!isEditEmployeeForm) select.disabled = true;

    localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
  }
}

//Set Data for role if page is navigated from roles page
function setFormDataRole(roleId: string, rolesData: Role[]) {
  let selectInputs = document.getElementsByClassName(
    "add-employee-select-inputs"
  )! as HTMLCollectionOf<HTMLSelectElement>;

  for (let select of selectInputs) {
    let selectName = select.name;

    if (selectName != "managerName" && selectName != "projectName") {
      if (select.name == "department") {
        manageRoleChain("department");
      } else if (select.name == "roleName") {
        manageRoleChain("roleName");
      } else if (select.name == "location") {
        manageRoleChain("location");
      }
      select.value = roleService.getRolesDataById(
        roleId,
        selectName,
        rolesData
      ) as string;
    }
    if (!isEditEmployeeForm) select.disabled = true;
  }
}

//Chaining roles selection
function manageRoleChain(checkParameter = "department") {
  if (checkParameter == "department") {
    inputLocation.disabled = true;
    inputRoleName.disabled = true;

    populateSelectDropDownData(
      checkParameter,
      inputDepartment,
      inputDepartment,
      roles
    );
  } else if (checkParameter == "roleName") {
    populateSelectDropDownData(
      checkParameter,
      inputDepartment,
      inputRoleName,
      roles
    );
  } else {
    populateSelectDropDownData(
      checkParameter,
      inputRoleName,
      inputLocation,
      roles
    );
  }
}

function populateSelectDropDownData(
  checkParameter: string,
  prevSelectElement: HTMLSelectElement,
  currSelectElement: HTMLSelectElement,
  roles: Role[]
) {
  let optionsUnderSelect: string[] = [];

  let tempRoles: Role[] = roles.slice();

  roles.forEach((role) => {
    let currValue = role[checkParameter as keyof Role] as string;
    if (checkParameter != "department") {
      let prevRoleDepartment = prevSelectElement.value;
      let currElementRoleDepartment =
        role[prevSelectElement.name as keyof Role];
      if (prevRoleDepartment != currElementRoleDepartment) {
        tempRoles.splice(tempRoles.indexOf(role), 1);
      } else {
        if (!optionsUnderSelect.includes(currValue as string)) {
          optionsUnderSelect.push(currValue as string);
        }
      }
    } else if (!optionsUnderSelect.includes(currValue as string)) {
      optionsUnderSelect.push(currValue as string);
    }
  });

  roles = tempRoles.slice();

  //unpopulate current select
  currSelectElement.innerHTML = `<option value="search" hidden>Search</option>`;
  for (let i = 0; i < optionsUnderSelect.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = optionsUnderSelect[i];
    newOption.innerHTML = optionsUnderSelect[i];
    currSelectElement.appendChild(newOption);
  }

  if (currSelectElement.name != "location") {
    currSelectElement.onchange = () => {
      if (checkParameter == "department") {
        inputRoleName.disabled = false;
        manageRoleChain("roleName");
      } else {
        inputLocation.disabled = false;
        manageRoleChain("location");
      }
    };
  }
}

//Validations
function showError(input: HTMLInputElement | HTMLSelectElement, msg: string) {
  if (msg.length != 0) input.style.outline = "2px solid red";
  else {
    input.style.outline = "2px solid #e0e4e4";
  }
  input.nextElementSibling!.innerHTML = `${msg}`;
}

function validateUserInput() {
  let formInputs = document.getElementsByClassName(
    "add-employee-input"
  )! as HTMLCollectionOf<HTMLInputElement>;
  let selectInputs = document.getElementsByClassName(
    "add-employee-select-inputs"
  ) as HTMLCollectionOf<HTMLSelectElement>;

  let flag = true;
  for (let input of formInputs) {
    if (input.name == "dob" || input.name == "profileImage") {
      continue;
    } else {
      if (input.value == "") {
        showError(input, "&#9888 cant be empty");
        flag = false;
      } else {
        showError(input, "");
      }
      if (input.name == "mobNumber") {
        if (!/\d{10}/.test(input.value)) {
          showError(input, "&#9888 enter valid phone number");
          flag = false;
        } else {
          showError(input, "");
        }
      } else if (input.name == "email") {
        if (!/^[\w-\.]+@([\w]+\.)+[\w]{2,4}$/.test(input.value)) {
          showError(input, "&#9888 enter valid email");
          flag = false;
        } else {
          showError(input, "");
        }
      } else if (input.name == "empNo" && !isEditEmployeeForm) {
        let employees: Employee[] = JSON.parse(
          localStorage.getItem("employeesDetails") || "{}"
        );

        let existingEmpIds: string[] = [];
        employees.forEach((emp) => {
          existingEmpIds.push(emp.empId);
        });
        if (existingEmpIds.includes(input.value)) {
          showError(input, "&#9888 Id already exists");
          flag = false;
        } else {
          showError(input, "");
        }
      }
    }
  }

  for (let input of selectInputs) {
    if (input.name == "managerName" || input.name == "projectName") {
      continue;
    } else {
      if (input.value == "") {
        showError(input, "&#9888 cant be empty");
        flag = false;
      } else {
        showError(input, "");
      }
    }
  }

  if (flag) {
    return true;
  }
  return false;
}

//Change the to base64 and preview
let baseString = "";
function getBaseUrl(file: File) {
  let reader = new FileReader();
  reader.onloadend = function () {
    baseString = reader.result as string;
    setPreviewImage(baseString);
  };
  reader.readAsDataURL(file);
}

function setPreviewImage(url: string) {
  let imgPreview = document.getElementById(
    "profileImagePreview"
  ) as HTMLImageElement;
  imgPreview.src = url;
  imgPreview.style.scale = "1.2";
}

// Adding employee to the database
function addEmployee() {
  if (baseString != "") employeePicURL = baseString;

  roleId = roleService.generateRoleId(inputRoleName.value, inputLocation.value);

  let newEmployee: Employee = {
    empId: inputEmpNo.value,
    empProfilePic: employeePicURL,
    firstName: inputFirstName.value,
    lastName: inputLastName.value,
    email: inputEmail.value,
    dob: inputDOB.value,
    mobNumber: inputMobNo.value,
    managerName: inputManager.value,
    projectName: inputProject.value,
    status: "Active",
    joinDate: inputJoinDate.value,
    roleId: roleId,
  };

  //Adding employee to role
  roleService.addEmployeeToRole(inputEmpNo.value, roleId, rolesData);

  if (isEditEmployeeForm) {
    editEmployee(newEmployee, empId);
  } else addDataToStorage(newEmployee);
}

// Get employee object and update it
function editEmployee(newEmployee: Employee, empId: string) {
  let employeesData = JSON.parse(
    localStorage.getItem("employeesDetails") || "{}"
  );
  for (let emp of employeesData) {
    if (emp.empId == empId) {
      employeesData.splice(employeesData.indexOf(emp), 1);
      break;
    }
  }
  employeesData.push(newEmployee);
  localStorage.setItem("employeesDetails", JSON.stringify(employeesData));
  window.opener.location.reload();
  window.close();
}

//Add data to database
function addDataToStorage(newEmployee: Employee) {
  localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
  let existingEmployeesData = JSON.parse(
    localStorage.getItem("employeesDetails") || "{}"
  );
  existingEmployeesData.push(newEmployee);
  localStorage.setItem(
    "employeesDetails",
    JSON.stringify(existingEmployeesData)
  );
  window.opener.location.reload();
  alert("The employee has been added");
  window.close();
}

//Cancel add employee
function cancelAddEmployee() {
  window.close();
}

export { populateSelectDropDownData };

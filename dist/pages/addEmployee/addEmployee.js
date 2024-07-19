import { RoleService } from "../../services/roleService.js";
import { sidePanelToggle } from "../common/common.js";
const roleService = new RoleService();
const form = document.querySelector("#employeeForm");
const btn = document.querySelector("#submit-button");
let uploadPicture = document.getElementById("uploadPicture");
let rolesData = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
let employeesData = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
let inputEmpNo = document.getElementById("empNo");
let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputDOB = document.getElementById("dob");
let inputEmail = document.getElementById("email");
let inputMobNo = document.getElementById("mobNumber");
let inputJoinDate = document.getElementById("joinDate");
let inputLocation = document.getElementById("location");
let inputRoleName = document.getElementById("roleName");
let inputDepartment = document.getElementById("department");
let inputManager = document.getElementById("managerName");
let inputProject = document.getElementById("projectName");
let roles = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
let empId;
let roleId;
let employeeInfo;
let employeePicURL;
let userInputValid = false;
let isEditEmployeeForm = false;
let isViewEmployeeForm = false;
window.cancelAddEmployee = cancelAddEmployee;
window.manageSidePanelToggle = manageSidePanelToggle;
init();
function init() {
    let url = new URL(document.URL);
    let params = new URLSearchParams(url.search);
    if (params.get("action") != null) {
        if (params.get("action") == "viewemployee") {
            empId = params.get("id");
            isEditEmployeeForm = false;
            isViewEmployeeForm = true;
            for (let employee of employeesData) {
                if (employee.empId == empId) {
                    employeeInfo = employee;
                    setFormDataInfo(employeeInfo, employee.empId);
                    break;
                }
            }
        }
        else if (params.get("action") == "addemployee") {
            roleId = params.get("id");
            setFormDataRole(roleId, rolesData);
        }
        else if (params.get("action") == "editemployee") {
            empId = params.get("id");
            isEditEmployeeForm = true;
            for (let employee of employeesData) {
                if (employee.empId == empId) {
                    employeeInfo = employee;
                    setFormDataInfo(employeeInfo, employee.empId);
                    break;
                }
            }
        }
    }
    else {
        manageRoleChain();
    }
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (validateUserInput()) {
            addEmployee();
        }
    });
    uploadPicture.onchange = (evt) => {
        const file = uploadPicture.files[0];
        if (file) {
            getBaseUrl(file);
        }
    };
}
let isCollapsed = false;
function manageSidePanelToggle() {
    if (window.matchMedia("(max-width: 1200px)").matches) {
        sidePanelToggle(isCollapsed);
    }
    else {
        sidePanelToggle(isCollapsed);
        isCollapsed = !isCollapsed;
    }
}
function addTheSelectOption(selectInput, selectName, selectValue) {
    let newOption = document.createElement("option");
    newOption.value = selectValue;
    newOption.innerHTML = selectValue;
    selectInput.appendChild(newOption);
}
function setFormDataInfo(emp, empId) {
    roles = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
    let roleId = emp["roleId"];
    let empArr = roleService.getRolesDataById(roleId, "employees", rolesData);
    if (typeof empArr == "object") {
        empArr.splice(empArr.indexOf(empId), 1);
    }
    let formInputs = document.getElementsByClassName("add-employee-input");
    let selectInputs = document.getElementsByClassName("add-employee-select-inputs");
    let heading = document.querySelector(".add-employee-container h1");
    let uploadBtn = document.querySelector(".upload-profile-pic-btn");
    let profilePic = document.querySelector("#profileImagePreview");
    let addEmployeeBtn = document.querySelector("#submit-button");
    if (isViewEmployeeForm) {
        addEmployeeBtn.style.display = "none";
        uploadBtn.classList.add("hide");
        heading.innerHTML = "Employee Info";
    }
    else if (isEditEmployeeForm) {
        addEmployeeBtn.innerHTML = "Update Employee";
        heading.innerHTML = "Edit Employee";
        uploadBtn.innerHTML = "Edit Profile Picture";
        employeePicURL = emp["empProfilePic"];
    }
    profilePic.style.scale = "1.2";
    profilePic.src = emp["empProfilePic"];
    for (let input of formInputs) {
        let inputName = input.name;
        if (input.name == "empNo") {
            input.value = empId;
        }
        else if (input.name != "profileImage") {
            let p2 = inputName;
            input.value = emp[inputName];
        }
        if (!isEditEmployeeForm || input.name == "empNo")
            input.disabled = true;
    }
    for (let select of selectInputs) {
        let selectName = select.name;
        if (selectName == "managerName" || selectName == "projectName") {
            addTheSelectOption(select, selectName, emp[selectName]);
            select.value = emp[selectName];
        }
        else {
            if (select.name == "department") {
                manageRoleChain("department");
            }
            else if (select.name == "roleName") {
                manageRoleChain("roleName");
            }
            else if (select.name == "location") {
                manageRoleChain("location");
            }
            select.value = roleService.getRolesDataById(roleId, selectName, rolesData);
        }
        if (!isEditEmployeeForm)
            select.disabled = true;
        localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
    }
}
function setFormDataRole(roleId, rolesData) {
    let selectInputs = document.getElementsByClassName("add-employee-select-inputs");
    for (let select of selectInputs) {
        let selectName = select.name;
        if (selectName != "managerName" && selectName != "projectName") {
            if (select.name == "department") {
                manageRoleChain("department");
            }
            else if (select.name == "roleName") {
                manageRoleChain("roleName");
            }
            else if (select.name == "location") {
                manageRoleChain("location");
            }
            select.value = roleService.getRolesDataById(roleId, selectName, rolesData);
        }
        if (!isEditEmployeeForm)
            select.disabled = true;
    }
}
function manageRoleChain(checkParameter = "department") {
    if (checkParameter == "department") {
        inputLocation.disabled = true;
        inputRoleName.disabled = true;
        populateSelectDropDownData(checkParameter, inputDepartment, inputDepartment, roles);
    }
    else if (checkParameter == "roleName") {
        populateSelectDropDownData(checkParameter, inputDepartment, inputRoleName, roles);
    }
    else {
        populateSelectDropDownData(checkParameter, inputRoleName, inputLocation, roles);
    }
}
function populateSelectDropDownData(checkParameter, prevSelectElement, currSelectElement, roles) {
    let optionsUnderSelect = [];
    let tempRoles = roles.slice();
    roles.forEach((role) => {
        let currValue = role[checkParameter];
        if (checkParameter != "department") {
            let prevRoleDepartment = prevSelectElement.value;
            let currElementRoleDepartment = role[prevSelectElement.name];
            if (prevRoleDepartment != currElementRoleDepartment) {
                tempRoles.splice(tempRoles.indexOf(role), 1);
            }
            else {
                if (!optionsUnderSelect.includes(currValue)) {
                    optionsUnderSelect.push(currValue);
                }
            }
        }
        else if (!optionsUnderSelect.includes(currValue)) {
            optionsUnderSelect.push(currValue);
        }
    });
    roles = tempRoles.slice();
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
            }
            else {
                inputLocation.disabled = false;
                manageRoleChain("location");
            }
        };
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
function validateUserInput() {
    let formInputs = document.getElementsByClassName("add-employee-input");
    let selectInputs = document.getElementsByClassName("add-employee-select-inputs");
    let flag = true;
    for (let input of formInputs) {
        if (input.name == "dob" || input.name == "profileImage") {
            continue;
        }
        else {
            if (input.value == "") {
                showError(input, "&#9888 cant be empty");
                flag = false;
            }
            else {
                showError(input, "");
            }
            if (input.name == "mobNumber") {
                if (!/\d{10}/.test(input.value)) {
                    showError(input, "&#9888 enter valid phone number");
                    flag = false;
                }
                else {
                    showError(input, "");
                }
            }
            else if (input.name == "email") {
                if (!/^[\w-\.]+@([\w]+\.)+[\w]{2,4}$/.test(input.value)) {
                    showError(input, "&#9888 enter valid email");
                    flag = false;
                }
                else {
                    showError(input, "");
                }
            }
            else if (input.name == "empNo" && !isEditEmployeeForm) {
                let employees = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
                let existingEmpIds = [];
                employees.forEach((emp) => {
                    existingEmpIds.push(emp.empId);
                });
                if (existingEmpIds.includes(input.value)) {
                    showError(input, "&#9888 Id already exists");
                    flag = false;
                }
                else {
                    showError(input, "");
                }
            }
        }
    }
    for (let input of selectInputs) {
        if (input.name == "managerName" || input.name == "projectName") {
            continue;
        }
        else {
            if (input.value == "") {
                showError(input, "&#9888 cant be empty");
                flag = false;
            }
            else {
                showError(input, "");
            }
        }
    }
    if (flag) {
        return true;
    }
    return false;
}
let baseString = "";
function getBaseUrl(file) {
    let reader = new FileReader();
    reader.onloadend = function () {
        baseString = reader.result;
        setPreviewImage(baseString);
    };
    reader.readAsDataURL(file);
}
function setPreviewImage(url) {
    let imgPreview = document.getElementById("profileImagePreview");
    imgPreview.src = url;
    imgPreview.style.scale = "1.2";
}
function addEmployee() {
    if (baseString != "")
        employeePicURL = baseString;
    roleId = roleService.generateRoleId(inputRoleName.value, inputLocation.value);
    let newEmployee = {
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
    roleService.addEmployeeToRole(inputEmpNo.value, roleId, rolesData);
    if (isEditEmployeeForm) {
        editEmployee(newEmployee, empId);
    }
    else
        addDataToStorage(newEmployee);
}
function editEmployee(newEmployee, empId) {
    let employeesData = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
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
function addDataToStorage(newEmployee) {
    localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
    let existingEmployeesData = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
    existingEmployeesData.push(newEmployee);
    localStorage.setItem("employeesDetails", JSON.stringify(existingEmployeesData));
    window.opener.location.reload();
    alert("The employee has been added");
    window.close();
}
function cancelAddEmployee() {
    window.close();
}
export { populateSelectDropDownData };

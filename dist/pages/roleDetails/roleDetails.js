import { RoleService } from "../../services/roleService.js";
import { sidePanelToggle } from "../common/common.js";
const rolesCardSection = document.querySelector(".roles-card-section");
let roleId = document.URL.substring(document.URL.indexOf("?") + 1);
let employees = [];
let displayData = [];
let rolesData = [];
let roleService = new RoleService();
init();
function init() {
    window.viewEmployee = viewEmployee;
    window.manageSidePanelToggle = manageSidePanelToggle;
    window.handleAddEmployee = handleAddEmployee;
    if (localStorage.getItem("employeesDetails")) {
        employees = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
        rolesData = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
        employees.forEach((employee) => {
            if (employee.roleId == roleId) {
                displayData.push(employee);
            }
        });
        populateEmployeeCard(displayData);
    }
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
function populateEmployeeCard(employees) {
    employees.forEach((employee) => {
        let empRoleId = employee.roleId;
        if (empRoleId == roleId) {
            let employeeCard = document.createElement("div");
            let name = employee.firstName + " " + employee.lastName;
            employeeCard.innerHTML = `
            <div class="roles-card">
                <div class="roles-card-profile flex">
                  <img
                    src="${employee.empProfilePic}"
                    alt="profile-pic"
                    class="role-detail-profile-img"
                  />
    
                  <div>
                    <p class="profile-detail-name">${name}</p>
                    <p class="profile-detail-postion">Head of ${roleService.getRolesDataById(roleId, "department", rolesData)}</p>
                  </div>
                </div>
    
                <div class="role-profile-details">
                  <div class="role-profile-detail-row flex">
                    <img src="../../../../assets/inf-id.svg" alt="" />
                    <p>${employee.empId}</p>
                  </div>
                  <div class="role-profile-detail-row flex">
                    <img src="../../../../assets/email-logo.svg" alt="" />
                    <p>${employee.email}</p>
                  </div>
                  <div class="role-profile-detail-row flex">
                    <img src="../../../../assets/employees-icon.svg" alt="" />
                    <p>${roleService.getRolesDataById(roleId, "department", rolesData)}</p>
                  </div>
                  <div class="role-profile-detail-row flex">
                    <img src="../../../../assets/location-icon.svg" alt="" />
                    <p>${roleService.getRolesDataById(roleId, "location", rolesData)}</p>
                  </div>
                </div>
    
                <div class="roles-card-bottom flex">
                    <button onclick="viewEmployee('${employee.empId}')">View</button>
                    <img src="../../../../assets/right-arrow-icon.svg" alt="" />
                </div>
              </div>
            `;
            rolesCardSection.appendChild(employeeCard);
        }
    });
}
function handleAddEmployee() {
    let url = "../../pages/addEmployee/addemployee.html?" +
        "action=addemployee" +
        "&id=" +
        roleId;
    window.open(url, "_self");
}
function viewEmployee(empId) {
    let url = "../../pages/addEmployee/addemployee.html?" +
        "action=viewemployee" +
        "&id=" +
        empId;
    window.open(url);
}

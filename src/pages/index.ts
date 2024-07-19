import Employee from "../models/employee.js";
import Role from "../models/role.js";

import { EmployeeFilter } from "../models/employeeFilter.js";
import { CSVExportService } from "../services/csvExportService.js";
import { TableSortService } from "../services/tableSortService.js";
import { EmployeeService } from "../services/employeeService.js";
import { FilterService } from "../services/filterService.js";
import { RoleService } from "../services/roleService.js";
import { sidePanelToggle } from "./common/common.js";
import {
  toggleFilterApplyButtons,
  applyFilter,
  resetAlphabetFilter,
  resetFilter,
  collapseAllDropDowns,
} from "./common/common.js";


let employeesData: Employee[] = [];
let displayData: Employee[] = [];
let rolesData: Role[] = [];
let tableData: Employee[] = [];
let sortColumnName = "none";
let sortDirection = "none";

let employeeService = new EmployeeService();

let csvService = new CSVExportService();

let tableSortManager = new TableSortService();
let filterService = new FilterService();
let roleService = new RoleService();

declare global {
  interface Window {
    manageSidePanelToggle: Function;
    showEllipsisMenu: Function;
    searchEmployee: Function;
    exportToCSV: Function;
    handleAddEmployee: Function;
    editDetails: Function;
    manageEmployeeDeletion: Function;
    deleteAllEmployees: Function;
    deleteFromEllipsisMenu: Function;
    viewDetails: Function;
    manageTableSorting: Function;

    manageEmployeeFilter: Function;
    showFilterDropdown: Function;
    manageApplyFilterBtn: Function;
    manageResetFilterBtn: Function;
    manageResetAlphabetFilter: Function;
  }
}

init();

function init() {
  //Default data
  setEmployeeData();

  //Set the element to global space so that the function can be recognised
  window.manageSidePanelToggle = manageSidePanelToggle;
  window.showEllipsisMenu = showEllipsisMenu;
  window.deleteFromEllipsisMenu = deleteFromEllipsisMenu;
  window.searchEmployee = searchEmployee;
  window.exportToCSV = exportToCSV;
  window.handleAddEmployee = handleAddEmployee;
  window.editDetails = editDetails;
  window.manageEmployeeDeletion = manageEmployeeDeletion;
  window.deleteAllEmployees = deleteAllEmployees;
  window.viewDetails = viewDetails;
  window.manageTableSorting = manageTableSorting;

  window.manageEmployeeFilter = manageEmployeeFilter;
  window.showFilterDropdown = showFilterDropdown;
  window.manageApplyFilterBtn = manageApplyFilterBtn;
  window.manageResetFilterBtn = manageResetFilterBtn;
  window.manageResetAlphabetFilter = manageResetAlphabetFilter;

  //Rendering A to Z buttons
  for (let i = 1; i <= 26; i++) {
    const filterDiv = document.querySelector(
      ".filter-alphabets"
    ) as HTMLDivElement;
    const div = document.createElement("div");
    div.classList.add("filter-alphabets-div");
    div.classList.add("selectedAlphabets");
    const char = String.fromCharCode(64 + i);
    div.setAttribute("onclick", "manageEmployeeFilter(this)");
    div.innerHTML = `${char}`;
    filterDiv.appendChild(div);
  }

  // Detect the shortcut key press
  document.onkeydown = keydown;
  document.addEventListener("click", collapseAllDropDowns);
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

function setEmployeeData() {
  fetch("../../data/roles.json")
    .then((response) => response.json())
    .then((json) => {
      if (!localStorage.getItem("rolesDetails")) {
        localStorage.setItem("rolesDetails", JSON.stringify(json));
      }
      rolesData = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
    });

  //Get employees data
  fetch("../../data/employees.json")
    .then((response) => response.json())
    .then((json) => {
      if (!localStorage.getItem("employeesDetails")) {
        localStorage.setItem("employeesDetails", JSON.stringify(json));
      }
      employeesData = JSON.parse(
        localStorage.getItem("employeesDetails") || "{}"
      );
      displayData = employeesData.slice();

      populateTableData(displayData);
    });
}

function populateTableData(employeesData: Employee[]) {
  let rolesData: Role[] = JSON.parse(localStorage.getItem("rolesDetails")!);

  const tableBody = document.querySelector(
    ".employee-table-data"
  )! as HTMLTableSectionElement;

  employeesData.forEach((emp) => {
    rolesData = roleService.addEmployeeToRole(emp.empId, emp.roleId, rolesData);
    let activeClass = "";
    let roleId = emp.roleId;
    if (emp.status == "Inactive") {
      activeClass = "inactive";
    }
    let row = document.createElement("tr");
    row.classList.add("employee-table-row");
    row.innerHTML = `
          <td><label><input type="checkbox" name="check" id="check-box" class="row-checkbox" onchange ="manageEmployeeDeletion(this,'${
            emp.empId
          }')"/></label> </td>
          <td>
              <div class="table-user">
                <img
                  src="${emp.empProfilePic}"
                  alt="user-profile-pic"
                />
                <div>
                  <p class="user-profile-name">${
                    emp.firstName + " " + emp.lastName
                  }</p>
                  <p class="user-profile-email">${emp.email}</p>
                </div>
              </div>
          </td>
          <td>${roleService.getRolesDataById(
            roleId,
            "location",
            rolesData
          )}</td>
          <td>${roleService.getRolesDataById(
            roleId,
            "department",
            rolesData
          )}</td>
          <td>${roleService.getRolesDataById(
            roleId,
            "roleName",
            rolesData
          )}</td>
          <td>${emp.empId}</td>
          <td><div class="status-btn ${activeClass}">${emp.status}</div></td>
          <td>${emp.joinDate}</td>
          <td>
            <div class="ellipsis" onclick="showEllipsisMenu(this)">
              <div class="ellipsis-icon">
                <i class="fa-solid fa-ellipsis"></i>
              </div>
              <div class="ellipsis-menu">
                <div onclick="viewDetails('${emp.empId}')">View Details</div>
                <div onclick="editDetails('${emp.empId}')">Edit</div>
                <div onclick="deleteFromEllipsisMenu('${
                  emp.empId
                }')">Delete</div>
              </div>
            </div>
          </td>
          `;
    tableBody.appendChild(row);
  });
  localStorage.setItem("rolesDetails", JSON.stringify(rolesData));
}

// Unpopulate table data
function unpopulateTableData() {
  const tableBody = document.querySelector(
    ".employee-table-data"
  ) as HTMLTableSectionElement;
  //Delete all childs before
  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild!);
  }
}

// Ellipsis menu manage
function showEllipsisMenu(div: HTMLDivElement) {
  div.children[1].classList.toggle("active");
}

function keydown(evt: KeyboardEvent) {
  let searchbar = document.getElementById("searchbar")!;
  if (evt.ctrlKey && evt.keyCode == 191) {
    searchbar.focus();
  }
}

//Search header for employees
function searchEmployee() {
  let input: HTMLInputElement | string = document.getElementById(
    "searchbar"
  ) as HTMLInputElement;
  input = input.value;
  input = input.toLowerCase();
  let rows = document.getElementsByClassName(
    "employee-table-row"
  ) as HTMLCollectionOf<HTMLElement>;

  for (let i = 1; i < rows.length; i++) {
    let name: string =
      rows[
        i
      ].children[1].children[0].children[1].children[0].textContent!.toLowerCase();
    if (!name.includes(input)) {
      let currRow = rows[i];
      currRow.style.display = "none";
    } else {
      rows[i].style.display = "table-row";
    }
  }
}

//Table To CSV
let csvData = "";
function exportToCSV() {
  let employees: Employee[] = [];
  employees = employeesData.slice();
  csvData = csvService.extractHeadersForCSV(csvData, employees);
  csvData = csvService.extractEmployeeData(csvData, employees);
  csvService.generateCSVFile(csvData);
}

// Add Employee
function handleAddEmployee() {
  window.open("../pages/addEmployee/addEmployee.html");
}

// Edit of ellipsis menu
function editDetails(empId: string) {
  let url =
    "../pages/addEmployee/addEmployee.html?" +
    "action=editemployee" +
    "&id=" +
    empId;
  window.open(url);
}

// View details of ellipsis menu
function viewDetails(empId: string) {
  let url =
    "../pages/addEmployee/addEmployee.html?" +
    "action=viewemployee" +
    "&id=" +
    empId;
  window.open(url);
}

// Delete Selection
let empIdsToDel: string[] = [];

function manageEmployeeDeletion(checkBox: HTMLInputElement, empId: string) {
  const checkBoxes = document.getElementsByClassName(
    "row-checkbox"
  ) as HTMLCollectionOf<HTMLInputElement>;
  const firstCheckBox = document.querySelector(
    ".first-checkbox"
  ) as HTMLInputElement;
  const delBtn = document.querySelector(".btn-delete") as HTMLButtonElement;

  let countOfCheckBoxChecked = 0;
  for (let checkBox of checkBoxes) {
    if (checkBox.checked == true) {
      countOfCheckBoxChecked++;
    }
  }
  if (countOfCheckBoxChecked > 0) delBtn.style.display = "block";
  else delBtn.style.display = "none";
  empIdsToDel = employeeService.manageSelectedEmployees(
    checkBox,
    empId,
    empIdsToDel,
    displayData,
    checkBoxes,
    firstCheckBox,
    delBtn
  );
}

function deleteAllEmployees() {
  employeesData = employeeService.deleteEmployees(empIdsToDel, displayData);
  unpopulateTableData();
  populateTableData(employeesData);
  let firstCheckBox = document.querySelector(
    ".first-checkbox"
  ) as HTMLInputElement;
  firstCheckBox.checked = false;
}

function deleteFromEllipsisMenu(empId: string) {
  empIdsToDel.push(empId);
  deleteAllEmployees();
}

function manageTableSorting(columnName: string) {
  tableData = displayData.slice();
  [sortDirection, sortColumnName, tableData] =
    tableSortManager.handleColumnSort(
      columnName,
      sortColumnName,
      displayData,
      sortDirection,
      rolesData
    );

  unpopulateTableData();
  populateTableData(tableData);
}

// Filter
let selectedEmployeeFilter: EmployeeFilter = {
  selectedAlphabets: [],
  status: [],
  location: [],
  department: [],
};

//Show filter Dropdowns
function showFilterDropdown(currFilterOption: HTMLDivElement) {
  currFilterOption.nextElementSibling!.classList.toggle("active");
  const dropDownBtnIcon = currFilterOption.children[0].children[1];
  dropDownBtnIcon.classList.toggle("active");
  toggleFilterApplyButtons(selectedEmployeeFilter);
}

function manageEmployeeFilter(element: HTMLDivElement) {
  let criteria: string = element.classList[1];

  selectedEmployeeFilter = filterService.manageSelectedFilterOptions(
    element,
    selectedEmployeeFilter,
    criteria
  ) as EmployeeFilter;
  element.classList.toggle("active");

  if (criteria == "selectedAlphabets") {
    let removeFilterBtn = document.querySelector(
      ".remove-filter-btn"
    ) as HTMLImageElement;
    removeFilterBtn.src = "../../assets/interface/filter_red.svg";
    displayData = applyFilter(
      selectedEmployeeFilter,
      employeesData,
      displayData
    );
  } else {
    toggleFilterApplyButtons(selectedEmployeeFilter);
  }

  unpopulateTableData();
  populateTableData(displayData);
}

//Reset Alphabete filter
function manageResetAlphabetFilter() {
  displayData = resetAlphabetFilter(
    selectedEmployeeFilter,
    employeesData,
    displayData
  );
  unpopulateTableData();
  populateTableData(displayData);
}

//If not an alphabetic filter
function manageApplyFilterBtn() {
  displayData = applyFilter(selectedEmployeeFilter, employeesData, displayData);
  unpopulateTableData();
  populateTableData(displayData);
}

function manageResetFilterBtn() {
  displayData = resetFilter(selectedEmployeeFilter, employeesData, displayData);
  unpopulateTableData();
  populateTableData(displayData);
}

import Role from "../../models/role.js";
import { RoleFilter } from "../../models/roleFilter.js";
import { FilterService } from "../../services/filterService.js";
import { RoleService } from "../../services/roleService.js";
import { sidePanelToggle } from "../common/common.js";
import {
  toggleFilterApplyButtons,
  applyFilter,
  resetFilter,
  collapseAllDropDowns,
} from "../common/common.js";

const roleService = new RoleService();
const filterService = new FilterService();

let rolesData: Role[] = JSON.parse(localStorage.getItem("rolesDetails")!);
let displayData: Role[] = [];
let isCollapsed = false;

declare global {
  interface Window {
    manageSidePanelToggle: Function;
    handleAddRole: Function;
    viewAllEmployees: Function;
    showFilterDropdown: Function;
    manageRoleFilter: Function;
    manageApplyFilterBtn: Function;
    manageResetFilterBtn: Function;
    searchRole: Function;
  }
}

init();

function init() {
  populateRolesData(rolesData);
  document.addEventListener("click", collapseAllDropDowns);
  document.onkeydown = keydown;

  window.manageSidePanelToggle = manageSidePanelToggle;
  window.handleAddRole = handleAddRole;
  window.viewAllEmployees = viewAllEmployees;
  window.showFilterDropdown = showFilterDropdown;
  window.searchRole = searchRole;
  window.manageRoleFilter = manageRoleFilter;
  window.manageApplyFilterBtn = manageApplyFilterBtn;
  window.manageResetFilterBtn = manageResetFilterBtn;
}

function manageSidePanelToggle() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    sidePanelToggle(isCollapsed);
  } else {
    sidePanelToggle(isCollapsed);
    isCollapsed = !isCollapsed;
  }
}

function populateRolesData(rolesData: Role[]) {
  const rolesCardSection = document.querySelector(
    ".roles-card-section"
  )! as HTMLDivElement;

  rolesData.forEach((role) => {
    let roleCard = document.createElement("div");
    roleCard.innerHTML = `
              <div class="roles-card-header flex">
                <p class="roles-card-header-title">${role.roleName}</p>
                
              </div>
  
              <div class="roles-card-content">
                <div class="roles-card-content-div flex">
                  <div class="flex">
                    <img src="../../../assets/employees-icon.svg" alt="" />
                    <p>Department</p>
                  </div>
  
                <div>
                  <p class="department">${role.department}</p>
                </div>
              </div>
              <div class="roles-card-content-div flex">
                  <div class="flex">
                    <img src="../../../assets/location-icon.svg" alt="" />
                    <p>Location</p>
                  </div>
  
                  <div>
                    <p class="location">${role.location}</p>
                  </div>
              </div>
              <div class="roles-card-content-div flex">
                  <div class="flex">
                    <p>Total Employees</p>
                  </div>
                  <div class="roles-card-total-employees-card ${role.roleId}">

                  </div>
                </div>
              </div>
  
              <div class="roles-card-bottom flex">
                <button class="flex" onclick="viewAllEmployees('${role.roleId}')">
                  <p>View all Employees</p>
                  <img src="../../../assets/right-arrow-icon.svg" alt="" />
                </button>
              </div>
      `;
    roleCard.classList.add("roles-card");
    rolesCardSection.appendChild(roleCard);

    //Adding the images dynamically
    let imgContainers = document.querySelectorAll(
      ".roles-card-total-employees-card"
    );
    for (let imgContainer of imgContainers) {
      if (imgContainer.classList[1] == role.roleId) {
        let imagesLinks: string[] = [];
        imagesLinks = roleService.addImages(role.employees, imgContainer);
        populateImagesInRolesCard(imagesLinks, imgContainer);
      }
    }
  });
}

function populateImagesInRolesCard(
  imagesLinks: string[],
  imgContainer: Element
) {
  for (let i = 0; i < imagesLinks.length; i++) {
    if (i == 4) {
      let countContainer = document.createElement("div");
      countContainer.classList.add("profile-remaining-count");
      countContainer.classList.add("flex");
      countContainer.innerHTML = `+ ${imagesLinks.length - i}`;
      imgContainer.appendChild(countContainer);
      break;
    }
    let img = document.createElement("img");
    img.src = imagesLinks[i];
    img.classList.add("profile-img");
    let className = "profile-img-" + (i + 1);
    img.classList.add(className);
    imgContainer.appendChild(img);
  }
}

function unpopulateData() {
  const rolesCardSection = document.querySelector(".roles-card-section")!;

  //Delete all childs before
  while (rolesCardSection.hasChildNodes()) {
    rolesCardSection.removeChild(rolesCardSection.firstChild!);
  }
}

let selectedRolesFilter: RoleFilter = {
  location: [],
  department: [],
};

//Searching role functionality

function keydown(evt: KeyboardEvent) {
  let searchbar = document.getElementById("searchbar")!;
  if (evt.ctrlKey && evt.keyCode == 191) {
    searchbar.focus();
  }
}

//Search header for employees
function searchRole() {
  let input: HTMLInputElement | string = document.getElementById(
    "searchbar"
  ) as HTMLInputElement;
  input = input.value;
  input = input.toLowerCase();
  let cards = document.getElementsByClassName(
    "roles-card"
  ) as HTMLCollectionOf<HTMLElement>;
  let roleNames = document.getElementsByClassName(
    "roles-card-header-title"
  )! as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < cards.length; i++) {
    let name = roleNames[i].textContent!.toLowerCase();
    console.log(name);
    if (!name.includes(input)) {
      let currCard = cards[i];
      currCard.style.display = "none";
    } else {
      cards[i].style.display = "block";
    }
  }
}

function showFilterDropdown(currFilterOption: HTMLDivElement) {
  currFilterOption.nextElementSibling!.classList.toggle("active");
  const dropDownBtnIcon = currFilterOption.children[0].children[1];
  dropDownBtnIcon.classList.toggle("active");
  toggleFilterApplyButtons(selectedRolesFilter);
}

function manageRoleFilter(element: HTMLDivElement) {
  let criteria: string = element.classList[1];

  selectedRolesFilter = filterService.manageSelectedFilterOptions(
    element,
    selectedRolesFilter,
    criteria
  );
  element.classList.toggle("active");

  toggleFilterApplyButtons(selectedRolesFilter);
}

function manageApplyFilterBtn() {
  displayData = applyFilter(selectedRolesFilter, rolesData, displayData);
  unpopulateData();
  populateRolesData(displayData);
}

function manageResetFilterBtn() {
  displayData = resetFilter(selectedRolesFilter, rolesData, displayData);
  unpopulateData();
  populateRolesData(displayData);
}

//View All Employees
function viewAllEmployees(roleId: string) {
  let url = "../roleDetails/roledetails.html?" + roleId;
  window.open(url, "_self");
}

function handleAddRole() {
  const employeeHeader = document.querySelector(".page-header")!;
  const filter = document.querySelector(".filter-options")!;
  const rolesCardSection = document.querySelector(".roles-card-section")!;
  const addRolePage = document.querySelector(".add-role-page")!;
  employeeHeader.classList.toggle("hide");
  filter.classList.toggle("hide");
  rolesCardSection.classList.toggle("hide");
  addRolePage.classList.toggle("hide");
  window.addEventListener("message", (event) => {
    if (event.data != "cancelled" || event.data != "added") {
      employeeHeader.classList.toggle("hide");
      filter.classList.toggle("hide");
      rolesCardSection.classList.toggle("hide");
      addRolePage.classList.toggle("hide");
      window.location.reload();
    }
  });
}

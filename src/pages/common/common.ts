import Employee from "../../models/employee.js";
import { EmployeeFilter } from "../../models/employeeFilter.js";
import { FilterService } from "../../services/filterService.js";

// Toggle Filter Apply buttons
export function toggleFilterApplyButtons(selectedFilter: any) {
  let isOptionFilterApplied = false;
  Object.keys(selectedFilter).forEach((type) => {
    if (
      type != "selectedAlphabets" &&
      selectedFilter[type as keyof EmployeeFilter].length > 0
    ) {
      isOptionFilterApplied = true;
    }
  });
  const btnReset = document.querySelector(
    ".filter-options-reset"
  ) as HTMLButtonElement;
  const btnApply = document.querySelector(
    ".filter-options-apply"
  ) as HTMLButtonElement;
  let show = "inline-block";
  let hide = "none";
  if (isOptionFilterApplied) {
    btnReset.style.display = show;
    btnApply.style.display = show;
  }
}

// Apply Filter
export function applyFilter(selectedFilter: any, data: any, displayData: any) {
  let filterService = new FilterService();
  let filterLabels = document.querySelectorAll(".filter-options-btn p");
  displayData = data.slice();
  type selectedFilterType = keyof typeof selectedFilter;

  Object.keys(selectedFilter).forEach((type) => {
    let filterOptions = selectedFilter[type as selectedFilterType];
    for (let label of filterLabels) {
      if (filterOptions.length > 0) {
        if (label.classList[0].toLowerCase() == type) {
          label.textContent = filterOptions.length + " selected";
        }
        if (Object.keys(selectedFilter).length == 4) {
          displayData = filterService.removeUnfilteredEmployees(
            displayData,
            type,
            filterOptions
          );
        } else {
          displayData = filterService.removeUnfilteredRoles(
            displayData,
            type,
            filterOptions
          );
        }
      } else {
        if (label.classList[0].toLowerCase() == type) {
          label.textContent = filterService.capitalizeFirstLetter(type);
        }
      }
    }
  });
  return displayData;
}

//Reset Filter
export function resetFilter(selectedFilter: any, data: any, displayData: any) {
  selectedFilter.status = [];
  selectedFilter.location = [];
  selectedFilter.department = [];
  let filterBtn = document.querySelectorAll(".drop-down-menu");
  let filterLabels = document.querySelectorAll(".filter-options-btn p");
  let applyBtn = document.querySelector(
    ".filter-options-apply"
  ) as HTMLButtonElement;
  let resetBtn = document.querySelector(
    ".filter-options-reset"
  ) as HTMLButtonElement;
  for (let fName of filterLabels) {
    let name = fName.classList[0];
    if (name == "status") {
      fName.textContent = "Status";
    } else if (name == "location") {
      fName.textContent = "Location";
    } else {
      fName.textContent = "Department";
    }
  }

  displayData = applyFilter(selectedFilter, data, displayData);
  toggleFilterApplyButtons(selectedFilter);
  filterBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
  resetBtn.style.display = "none";
  applyBtn.style.display = "none";
  return displayData;
}

//Reset Alphabet filter
export function resetAlphabetFilter(
  selectedFilter: EmployeeFilter,
  employeesData: Employee[],
  displayData: Employee[]
) {
  const resetFilterBtn = document.querySelector(
    ".remove-filter-btn"
  ) as HTMLImageElement;
  if (selectedFilter.selectedAlphabets.length > 0) {
    selectedFilter.selectedAlphabets = [];
  }
  const alphabetDivs = document.querySelectorAll(".filter-alphabets div");
  for (let element of alphabetDivs) {
    element.classList.remove("active");
  }
  resetFilterBtn.src = "../../../assets/interface/filter.svg";
  displayData = applyFilter(selectedFilter, employeesData, employeesData);
  return displayData;
}

export function collapseAllDropDowns(event: Event) {
  const filterContainers = document.querySelectorAll(
    ".filter-option-container"
  );
  for (let fc of filterContainers) {
    if (!fc.contains(event.target as Node)) {
      fc.children[1].classList.remove("active");
      fc.children[0].children[0].children[1].classList.remove("active");
    }
  }
}

//Toggle side panel collapse
export function sidePanelToggle(isCollapsed: boolean) {

  const collapseBtn = document.querySelector(".side-panel-collapse-btn")!;
  const mainContainer = document.querySelector(".main-container")!;
  const logoImage = document.querySelector(".logo-img") as HTMLImageElement;
  const selectorTitles = document.querySelectorAll(".side-panel-title")!;
  const rightLogos = document.querySelectorAll(".side-panel-logo-right")!;
  const updateBox = document.querySelector(".side-panel-update-box")!;
  const sidePanelHeadings = document.querySelectorAll(".side-panel-heading")!;
  const headerContainer = document.querySelectorAll(
    ".side-panel-header-container"
  )!;
  const pseudoSideBar = document.querySelector(".pseudo-side-bar")!;

  mainContainer.classList.toggle("collapsed");
  updateBox.classList.toggle("hide");
  pseudoSideBar.classList.toggle("hide");

  if (isCollapsed == false) {
    logoImage.src = "../../../assets/tezo-logo-icon.svg";
  } else {
    logoImage.src = "../../../assets/tezo-logo.svg";
  }

  for (let i = 0; i < selectorTitles.length; i++) {
    headerContainer[i].classList.toggle("collapsed");
    selectorTitles[i].classList.toggle("hide");
  }

  for (let heading of sidePanelHeadings) {
    heading.classList.toggle("hide");
  }

  for (let rightLogo of rightLogos) {
    rightLogo.classList.toggle("hide");
  }

  collapseBtn.classList.toggle("collapsed");
  isCollapsed = !isCollapsed;
}
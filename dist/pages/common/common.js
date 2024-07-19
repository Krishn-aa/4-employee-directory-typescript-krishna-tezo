import { FilterService } from "../../services/filterService.js";
export function toggleFilterApplyButtons(selectedFilter) {
    let isOptionFilterApplied = false;
    Object.keys(selectedFilter).forEach((type) => {
        if (type != "selectedAlphabets" &&
            selectedFilter[type].length > 0) {
            isOptionFilterApplied = true;
        }
    });
    const btnReset = document.querySelector(".filter-options-reset");
    const btnApply = document.querySelector(".filter-options-apply");
    let show = "inline-block";
    let hide = "none";
    if (isOptionFilterApplied) {
        btnReset.style.display = show;
        btnApply.style.display = show;
    }
}
export function applyFilter(selectedFilter, data, displayData) {
    let filterService = new FilterService();
    let filterLabels = document.querySelectorAll(".filter-options-btn p");
    displayData = data.slice();
    Object.keys(selectedFilter).forEach((type) => {
        let filterOptions = selectedFilter[type];
        for (let label of filterLabels) {
            if (filterOptions.length > 0) {
                if (label.classList[0].toLowerCase() == type) {
                    label.textContent = filterOptions.length + " selected";
                }
                if (Object.keys(selectedFilter).length == 4) {
                    displayData = filterService.removeUnfilteredEmployees(displayData, type, filterOptions);
                }
                else {
                    displayData = filterService.removeUnfilteredRoles(displayData, type, filterOptions);
                }
            }
            else {
                if (label.classList[0].toLowerCase() == type) {
                    label.textContent = filterService.capitalizeFirstLetter(type);
                }
            }
        }
    });
    return displayData;
}
export function resetFilter(selectedFilter, data, displayData) {
    selectedFilter.status = [];
    selectedFilter.location = [];
    selectedFilter.department = [];
    let filterBtn = document.querySelectorAll(".drop-down-menu");
    let filterLabels = document.querySelectorAll(".filter-options-btn p");
    let applyBtn = document.querySelector(".filter-options-apply");
    let resetBtn = document.querySelector(".filter-options-reset");
    for (let fName of filterLabels) {
        let name = fName.classList[0];
        if (name == "status") {
            fName.textContent = "Status";
        }
        else if (name == "location") {
            fName.textContent = "Location";
        }
        else {
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
export function resetAlphabetFilter(selectedFilter, employeesData, displayData) {
    const resetFilterBtn = document.querySelector(".remove-filter-btn");
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
export function collapseAllDropDowns(event) {
    const filterContainers = document.querySelectorAll(".filter-option-container");
    for (let fc of filterContainers) {
        if (!fc.contains(event.target)) {
            fc.children[1].classList.remove("active");
            fc.children[0].children[0].children[1].classList.remove("active");
        }
    }
}
export function sidePanelToggle(isCollapsed) {
    const collapseBtn = document.querySelector(".side-panel-collapse-btn");
    const mainContainer = document.querySelector(".main-container");
    const logoImage = document.querySelector(".logo-img");
    const selectorTitles = document.querySelectorAll(".side-panel-title");
    const rightLogos = document.querySelectorAll(".side-panel-logo-right");
    const updateBox = document.querySelector(".side-panel-update-box");
    const sidePanelHeadings = document.querySelectorAll(".side-panel-heading");
    const headerContainer = document.querySelectorAll(".side-panel-header-container");
    const pseudoSideBar = document.querySelector(".pseudo-side-bar");
    mainContainer.classList.toggle("collapsed");
    updateBox.classList.toggle("hide");
    pseudoSideBar.classList.toggle("hide");
    if (isCollapsed == false) {
        logoImage.src = "../../../assets/tezo-logo-icon.svg";
    }
    else {
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

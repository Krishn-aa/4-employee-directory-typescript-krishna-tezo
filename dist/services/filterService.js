import { RoleService } from "./roleService.js";
let roleService = new RoleService();
export class FilterService {
    manageSelectedFilterOptions(element, selectedFilter, criteria) {
        let filterName = element.textContent;
        let selectedFilterOptions = selectedFilter[criteria];
        if (!selectedFilterOptions.includes(filterName)) {
            selectedFilterOptions.push(filterName);
        }
        else {
            selectedFilterOptions.splice(selectedFilterOptions.indexOf(filterName), 1);
        }
        return selectedFilter;
    }
    removeUnfilteredEmployees(displayData, type, filterOptions) {
        let tempData = [];
        let rolesData = JSON.parse(localStorage.getItem("rolesDetails") || "{}");
        tempData = displayData.slice();
        let valueToCompare = undefined;
        displayData.forEach((emp) => {
            let roleId = emp.roleId;
            switch (type) {
                case "selectedAlphabets":
                    valueToCompare = emp.firstName[0];
                    break;
                case "location":
                    valueToCompare = roleService.getRolesDataById(roleId, "location", rolesData);
                    break;
                case "department":
                    valueToCompare = roleService.getRolesDataById(roleId, "department", rolesData);
                    break;
                default:
                    valueToCompare = emp.status;
                    break;
            }
            let isMatched = false;
            for (let filterOption of filterOptions) {
                if (valueToCompare == filterOption) {
                    isMatched = true;
                }
            }
            if (!isMatched) {
                tempData.splice(tempData.indexOf(emp), 1);
            }
        });
        displayData = tempData.slice();
        return displayData;
    }
    removeUnfilteredRoles(displayData, type, filterOptions) {
        let tempData = displayData.slice();
        let valueToCompare = undefined;
        displayData.forEach((role) => {
            if (type == "department") {
                valueToCompare = role.department;
            }
            else {
                valueToCompare = role.location;
            }
            let isMatched = false;
            for (let filterOption of filterOptions) {
                if (valueToCompare == filterOption) {
                    isMatched = true;
                }
            }
            if (!isMatched) {
                tempData.splice(tempData.indexOf(role), 1);
            }
        });
        displayData = tempData.slice();
        return displayData;
    }
    capitalizeFirstLetter(word) {
        let result = word.charAt(0).toUpperCase() + word.slice(1);
        return result;
    }
}

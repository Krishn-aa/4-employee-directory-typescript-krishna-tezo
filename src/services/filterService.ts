import Employee from "../models/employee";
import { EmployeeFilter } from "../models/employeeFilter";
import Role from "../models/role";
import { RoleService } from "./roleService.js";
import { toggleFilterApplyButtons } from "../pages/common/common.js";
import { applyFilter } from "../pages/common/common.js";

let roleService = new RoleService();

//Filter
export class FilterService {
    // Manage filter selection
    manageSelectedFilterOptions(
      element: HTMLDivElement,
      selectedFilter: any,
      criteria: string
    ) {
      let filterName = element.textContent!;
  
      let selectedFilterOptions: string[] = selectedFilter[criteria];
  
      if (!selectedFilterOptions.includes(filterName)) {
        selectedFilterOptions.push(filterName);
      } else {
        selectedFilterOptions.splice(
          selectedFilterOptions.indexOf(filterName),
          1
        );
      }
      return selectedFilter;
    }
  
    
  
    
  
    //Employe Filter
    removeUnfilteredEmployees(displayData: Employee[], type: String, filterOptions: String[]) {
      let tempData: Employee[] = [];
      let rolesData: Role[] = JSON.parse(
        localStorage.getItem("rolesDetails") || "{}"
      );
      tempData = displayData.slice();
      let valueToCompare = undefined;
        
      displayData.forEach((emp)=>{
        let roleId =emp.roleId;
        switch (type) {
          case "selectedAlphabets":
            valueToCompare = emp.firstName[0];
            break;
          case "location":
            valueToCompare = roleService.getRolesDataById(roleId,"location",rolesData);
            break;
          case "department":
            valueToCompare = roleService.getRolesDataById(roleId,"department",rolesData);
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
          tempData.splice(tempData.indexOf(emp),1);
        }
      })
      displayData = tempData.slice();
      return displayData;
    }
  
    removeUnfilteredRoles(displayData: Role[], type: String, filterOptions: String[]){
      let tempData:Role[] = displayData.slice();
      let valueToCompare = undefined;
  
      displayData.forEach((role)=>{
        if (type == "department") {
          valueToCompare = role.department;
        } else {
          valueToCompare = role.location;
        }
    
        let isMatched = false;
        for (let filterOption of filterOptions) {
          // Current value to the role matches to any of the option filters selected
          if (valueToCompare == filterOption) {
            isMatched = true;
          }
        }
        if (!isMatched) {
          tempData.splice(tempData.indexOf(role),1);
        }
      })
      displayData = tempData.slice();
      return displayData;
    }
  
    //Capitalize first letter to display
    capitalizeFirstLetter(word: string) {
      let result = word.charAt(0).toUpperCase() + word.slice(1);
      return result;
    }
  
  
    
  }
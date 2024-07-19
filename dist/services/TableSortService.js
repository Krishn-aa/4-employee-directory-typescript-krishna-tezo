import { EmployeeService } from "./employeeService.js";
import { RoleService } from "./roleService.js";
export class TableSortService {
    handleColumnSort(columnName, sortColumnName, displayData, sortDirection, rolesData) {
        let tableData = [];
        tableData = displayData.slice();
        let employeeService = new EmployeeService();
        if (sortDirection == "DESC") {
            sortDirection = "none";
            return [sortDirection, sortColumnName, tableData];
        }
        else if (sortColumnName == "none" || sortColumnName != columnName) {
            sortDirection = "ASC";
            sortColumnName = columnName;
        }
        else {
            sortColumnName = columnName;
            if (sortDirection == "ASC")
                sortDirection = "DESC";
            else if (sortDirection == "DESC")
                sortDirection = "none";
            else if (sortDirection == "none")
                sortDirection = "ASC";
        }
        tableData = this.sortColumn(sortDirection, columnName, tableData, rolesData);
        return [sortDirection, sortColumnName, tableData];
    }
    getEmployeeValueByColumnName(emp, columnName, rolesData) {
        let roleService = new RoleService();
        let value = "";
        let roleId = emp.roleId;
        switch (columnName) {
            case "user":
                value = emp.firstName;
                break;
            case "location":
                value = roleService.getRolesDataById(emp.roleId, "location", rolesData);
                break;
            case "department":
                value = roleService.getRolesDataById(emp.roleId, "department", rolesData);
                break;
            case "role":
                value = roleService.getRolesDataById(emp.roleId, "roleName", rolesData);
                break;
            case "emp-no":
                value = emp.empId;
                break;
            case "status":
                value = emp.status;
                break;
            case "join-date":
                value = emp.joinDate;
                break;
            default:
                break;
        }
        return value;
    }
    sortColumn(order, columnName, tableData, rolesData) {
        let returnValue = 1;
        if (order == "ASC" || order == "none") {
            returnValue = -returnValue;
        }
        tableData.sort((employee1, employee2) => {
            let employee1Value = this.getEmployeeValueByColumnName(employee1, columnName, rolesData);
            let employee2Value = this.getEmployeeValueByColumnName(employee2, columnName, rolesData);
            if (employee1Value < employee2Value) {
                return returnValue;
            }
            if (employee1Value > employee2Value) {
                return -returnValue;
            }
            return 0;
        });
        return tableData;
    }
}

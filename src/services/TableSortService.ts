import Employee from "../models/employee.js";
import Role from "../models/role.js";
import { EmployeeService } from "./employeeService.js";
import { RoleService } from "./roleService.js";

//Table Sort
export class TableSortService {
  //Table Sort
  handleColumnSort(
    columnName: string,
    sortColumnName: string,
    displayData: Employee[],
    sortDirection: string,
    rolesData: Role[]
  ):[string , string , Employee[]] {
    let tableData: Employee[] = [];
    tableData = displayData.slice();
    let employeeService = new EmployeeService();
    if (sortDirection == "DESC") {
      sortDirection = "none";
      return [sortDirection,sortColumnName,tableData];
    } else if (sortColumnName == "none" || sortColumnName != columnName) {
      sortDirection = "ASC";
      sortColumnName = columnName;
    } else {
      sortColumnName = columnName;
      if (sortDirection == "ASC") sortDirection = "DESC";
      else if (sortDirection == "DESC") sortDirection = "none";
      else if (sortDirection == "none") sortDirection = "ASC";
    }
    tableData = this.sortColumn(
      sortDirection,
      columnName,
      tableData,
      rolesData
    );
    return [sortDirection, sortColumnName, tableData];
  }

  getEmployeeValueByColumnName(
    emp: Employee,
    columnName: string,
    rolesData: Role[]
  ) {
    let roleService = new RoleService();
    let value: string = "";
    let roleId = emp.roleId;
    switch (columnName) {
      case "user":
        value = emp.firstName;
        break;
      case "location":
        value = roleService.getRolesDataById(
          emp.roleId,
          "location",
          rolesData
        ) as string;
        break;
      case "department":
        value = roleService.getRolesDataById(
          emp.roleId,
          "department",
          rolesData
        ) as string;
        break;
      case "role":
        value = roleService.getRolesDataById(
          emp.roleId,
          "roleName",
          rolesData
        ) as string;
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

  sortColumn(
    order: string,
    columnName: string,
    tableData: Employee[],
    rolesData: Role[]
  ) {
    let returnValue = 1;
    if (order == "ASC" || order == "none") {
      returnValue = -returnValue;
    }

    tableData.sort((employee1, employee2) => {
      let employee1Value = this.getEmployeeValueByColumnName(
        employee1,
        columnName,
        rolesData
      );
      let employee2Value = this.getEmployeeValueByColumnName(
        employee2,
        columnName,
        rolesData
      );
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

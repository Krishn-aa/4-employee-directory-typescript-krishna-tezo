import Employee from "../models/employee";
import Role from "../models/role";


export class RoleService {

  //Add image cards
  addImages(employeeIds: string[], imgContainer: Element) {
    let count = 0;
    let imagesLinks: string[] = [];
    let employees: Employee[] = JSON.parse(
      localStorage.getItem("employeesDetails") || "{}"
    );

    employees.forEach((employee) => {
      if (employeeIds.includes(employee.empId))
        imagesLinks.push(employee.empProfilePic);
    });

    return imagesLinks;
  }

  addEmployeeToRole(empId: string, roleId: string, rolesData: Role[]) {
    rolesData.forEach((role) => {
      if (role.roleId == roleId) {
        if (!role.employees.includes(empId)) {
          role.employees.push(empId);
        }
      }
    });
    return rolesData;
  }

  removeEmployeeFromRole(
    empId: string,
    oldRoleId: string,
    newRoleId: string,
    rolesData: Role[]
  ) {
    rolesData.forEach((role) => {
      if (role.roleId == oldRoleId) {
        if (role.employees.includes(empId)) {
          role.employees.splice(role.employees.indexOf(empId));
        }
        if (role.roleId == newRoleId) {
          role.employees.push(empId);
        }
      }
    });
    return rolesData
  }

  generateRoleId(roleName: string, location: string) {
    let roleId = roleName.substring(0, 3) + location.substring(0, 3);
    return roleId;
  }

  getRolesDataById(roleId: string, roleProperty: string, rolesData: Role[]) {
    for (let role of rolesData) {
      if (role.roleId == roleId) {
        return role[roleProperty as keyof Role];
      }
    }
    return "";
  }
}

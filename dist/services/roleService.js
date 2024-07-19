export class RoleService {
    addImages(employeeIds, imgContainer) {
        let count = 0;
        let imagesLinks = [];
        let employees = JSON.parse(localStorage.getItem("employeesDetails") || "{}");
        employees.forEach((employee) => {
            if (employeeIds.includes(employee.empId))
                imagesLinks.push(employee.empProfilePic);
        });
        return imagesLinks;
    }
    addEmployeeToRole(empId, roleId, rolesData) {
        rolesData.forEach((role) => {
            if (role.roleId == roleId) {
                if (!role.employees.includes(empId)) {
                    role.employees.push(empId);
                }
            }
        });
        return rolesData;
    }
    removeEmployeeFromRole(empId, oldRoleId, newRoleId, rolesData) {
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
        return rolesData;
    }
    generateRoleId(roleName, location) {
        let roleId = roleName.substring(0, 3) + location.substring(0, 3);
        return roleId;
    }
    getRolesDataById(roleId, roleProperty, rolesData) {
        for (let role of rolesData) {
            if (role.roleId == roleId) {
                return role[roleProperty];
            }
        }
        return "";
    }
}

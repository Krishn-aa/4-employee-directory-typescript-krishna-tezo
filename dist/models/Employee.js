export default class Employee {
    constructor(empId, empProfilePic, firstName, lastName, email, dob, mobNumber, managerName, projectName, status, joinDate, roleId) {
        this.empId = empId;
        this.empProfilePic = empProfilePic;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.mobNumber = mobNumber;
        this.managerName = managerName;
        this.projectName = projectName;
        this.status = status;
        this.joinDate = joinDate;
        this.roleId = roleId;
    }
}

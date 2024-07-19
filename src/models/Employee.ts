export default class Employee {
  public empId: string;
  public empProfilePic: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public dob: string;
  public mobNumber: string;
  public managerName: string;
  public projectName: string;
  public status: string;
  public joinDate: string;
  public roleId: string;

  constructor(
    empId: string,
    empProfilePic: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    mobNumber: string,
    managerName: string,
    projectName: string,
    status: string,
    joinDate: string,
    roleId: string
  ) {
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
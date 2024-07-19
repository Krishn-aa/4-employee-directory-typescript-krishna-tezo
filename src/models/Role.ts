export default class Role {
  public roleId: string;
  public roleName: string;
  public department: string;
  public roleDesc: string;
  public employees: string[];
  public location: string;

  constructor(
    roleId: string,
    roleName: string,
    department: string,
    roleDesc: string,
    employees: string[],
    location: string
  ) {
    this.roleId = roleId;
    this.roleName = roleName;
    this.department = department;
    this.roleDesc = roleDesc;
    this.employees = employees;
    this.location = location;
  }
}
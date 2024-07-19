export class RoleFilter {
  public location: string[];
  public department: string[];

  constructor(location: string[], department: string[]) {
    this.location = location;
    this.department = department;
  }
}

export class EmployeeFilter {
  public selectedAlphabets: string[];
  public status: string[];
  public location: string[];
  public department: string[];

  constructor(
    selectedAlphabets: string[],
    status: string[],
    location: string[],
    department: string[]
  ) {
    this.selectedAlphabets = selectedAlphabets;
    this.status = status;
    this.location = location;
    this.department = department;
  }
}

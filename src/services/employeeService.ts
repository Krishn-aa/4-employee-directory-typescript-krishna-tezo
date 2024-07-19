import Employee from "../models/employee";

export class EmployeeService {
  //Manage deletion of Employee
  manageSelectedEmployees(
    checkBox: HTMLInputElement,
    empId: string,
    empIdsToDel: string[],
    displayData: Employee[],
    checkBoxes: HTMLCollectionOf<HTMLInputElement>,
    firstCheckBox: HTMLInputElement,
    delBtn: HTMLButtonElement
  ) {
    let countOfCheckBoxChecked = 0;
    let totalEmployeeCount = Object.keys(displayData).length;

    if (empId == undefined) {
      if (checkBox.checked == true) {
        for (let cb of checkBoxes) {
          cb.checked = true;
          countOfCheckBoxChecked++;
        }
        empIdsToDel = this.selectAllEmployees(empIdsToDel, displayData);
      } else {
        for (let cb of checkBoxes) {
          cb.checked = false;
        }
        empIdsToDel = [];
      }
    } else {
      for (let cb of checkBoxes) {
        if (cb.checked == true) countOfCheckBoxChecked++;
      }
      if (countOfCheckBoxChecked - 1 == totalEmployeeCount) {
        firstCheckBox.checked = true;
      } else {
        firstCheckBox.checked = false;
      }

      if (empIdsToDel.includes(empId))
        empIdsToDel.splice(empIdsToDel.indexOf(empId), 1);
      else empIdsToDel.push(empId);
    }

    
    return empIdsToDel;
  }

  selectAllEmployees(empIdsToDel: string[], displayData: Employee[]) {
    empIdsToDel = [];
    displayData.forEach((emp)=>{
      empIdsToDel.push(emp.empId);
    })
    return empIdsToDel;
  }

  deleteEmployees(empIdsToDel: string[], employeesData: Employee[]) {
    let tempEmployees: Employee[] = [];
    tempEmployees = employeesData.slice();
    employeesData.forEach((emp) => {
      if (empIdsToDel.includes(emp.empId)) {
        tempEmployees.splice(tempEmployees.indexOf(emp), 1);
      }
    });
    employeesData = tempEmployees.slice();
    return tempEmployees;
  }
}

export class EmployeeService {
    manageSelectedEmployees(checkBox, empId, empIdsToDel, displayData, checkBoxes, firstCheckBox, delBtn) {
        let countOfCheckBoxChecked = 0;
        let totalEmployeeCount = Object.keys(displayData).length;
        if (empId == undefined) {
            if (checkBox.checked == true) {
                for (let cb of checkBoxes) {
                    cb.checked = true;
                    countOfCheckBoxChecked++;
                }
                empIdsToDel = this.selectAllEmployees(empIdsToDel, displayData);
            }
            else {
                for (let cb of checkBoxes) {
                    cb.checked = false;
                }
                empIdsToDel = [];
            }
        }
        else {
            for (let cb of checkBoxes) {
                if (cb.checked == true)
                    countOfCheckBoxChecked++;
            }
            if (countOfCheckBoxChecked - 1 == totalEmployeeCount) {
                firstCheckBox.checked = true;
            }
            else {
                firstCheckBox.checked = false;
            }
            if (empIdsToDel.includes(empId))
                empIdsToDel.splice(empIdsToDel.indexOf(empId), 1);
            else
                empIdsToDel.push(empId);
        }
        return empIdsToDel;
    }
    selectAllEmployees(empIdsToDel, displayData) {
        empIdsToDel = [];
        displayData.forEach((emp) => {
            empIdsToDel.push(emp.empId);
        });
        return empIdsToDel;
    }
    deleteEmployees(empIdsToDel, employeesData) {
        let tempEmployees = [];
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

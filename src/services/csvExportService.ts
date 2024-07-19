import Employee from "../models/employee";

//CSV
export class CSVExportService {
    //Manage export to csv
    extractHeadersForCSV(csvData: string, employees: Employee[]) {
      // let headers = Object.keys(employees[Object.keys(employee)[0]]);
      let headers = Object.keys(employees[0]);
      headers.forEach((item) => {
        if (item != "empProfilePic") csvData += item + ", ";
      });
      csvData += "\n";
      return csvData;
    }
  
    extractEmployeeData(csvData: string, employees: Employee[]) {
      employees.forEach((emp)=>{
        Object.keys(emp).forEach((empKey) => {
          if (empKey != "empProfilePic") {
            csvData += emp[empKey as keyof Employee] + ", ";
          }
        });
        csvData += "\n";
      })

      return csvData;
    }
  
    generateCSVFile(csvData: string) {
      var blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      var link = document.createElement("a");
      var url = URL.createObjectURL(blob);
  
      link.setAttribute("href", url);
      link.setAttribute("download", "employees.csv");
      link.style.visibility = "hidden";
      link.click();
    }
  }
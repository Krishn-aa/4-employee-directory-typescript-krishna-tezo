export class CSVExportService {
    extractHeadersForCSV(csvData, employees) {
        let headers = Object.keys(employees[0]);
        headers.forEach((item) => {
            if (item != "empProfilePic")
                csvData += item + ", ";
        });
        csvData += "\n";
        return csvData;
    }
    extractEmployeeData(csvData, employees) {
        employees.forEach((emp) => {
            Object.keys(emp).forEach((empKey) => {
                if (empKey != "empProfilePic") {
                    csvData += emp[empKey] + ", ";
                }
            });
            csvData += "\n";
        });
        return csvData;
    }
    generateCSVFile(csvData) {
        var blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "employees.csv");
        link.style.visibility = "hidden";
        link.click();
    }
}

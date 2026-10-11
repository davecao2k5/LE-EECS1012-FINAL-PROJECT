/*
 * populateData: Populates the table with pre-defined patient info.
 *               Only displays the full name & date in the table, While everything
 *               else is waiting to be called when the patient is clicked.
 *               from the populateForm function.             
 */

function populateData(){
    let patientBody = document.getElementById("patientDataTable");

    // Sends a GET requst to retrieve the pre-defined patient data in server.js
    fetch('/api/patientData')
        .then(response => response.json())
        .then(patientData => {
             // Iterates over the patient array from fetch
            for(let patient of patientData) {
                // Creates the row nad populates with name and date in correct cells
                let patientRow = document.createElement("tr");
                
                let nameCell = document.createElement("td");
                nameCell.textContent = `${patient.firstName} ${patient.lastName}`;
             
                let dateCell = document.createElement("td");
                dateCell.textContent = patient.dateTime;
        
                // Adds Name & Date, Then adds the next row for patient insertion
                patientRow.appendChild(nameCell);
                patientRow.appendChild(dateCell);

                patientBody.appendChild(patientRow)
        
                // When the specified row is selected the populateForm function is called and the patients information populates the fields
                // The patient is fetched again so the form shows changes saved after the table was loaded
                // (otherwise saving a second time would put the old values back)
                patientRow.addEventListener("click" , function() {
                    fetch('/api/patientData')
                        .then(response => response.json())
                        .then(latestPatientData => {
                            let latestPatient = latestPatientData[patientRow.rowIndex - 1];

                            // Skips if the row was deleted while the data was loading
                            if (latestPatient) {
                                populateForm(latestPatient);
                            }
                        });
                });
            };
        })
        .catch(error => {
            console.log('Patient was fetched incorrectly', error);
        });
}

/*
 * populateForm: Fills the form with the patient data when the row with
 *               the patient name is clicked. The || '' is for the fields
 *               that are empty, Mainly not required fields.    
 */

function populateForm(patient){
    document.getElementById("firstName").value = patient.firstName;
    document.getElementById("lastName").value = patient.lastName;
    document.getElementById("phoneNum").value = patient.phoneNum;
    document.getElementById("address").value = patient.address;
    document.getElementById("zipCode").value = patient.zipCode;
    document.getElementById("insuranceName").value = patient.insuranceName || "";
    document.getElementById("billing").value = patient.billing;
    document.getElementById("payMethod").value = patient.payMethod;
    document.getElementById("cardNum").value = patient.cardNum;
    document.getElementById("creditCardHolder").value = patient.creditCardHolder;
    document.getElementById("cardNum").value = patient.cardNum;
    document.getElementById("cvv").value = patient.cvv;

    // Date is handled manually to accomodate for Time
    // Time Zone Specific, Set to Ontario time zone in localDate (GMT-4)
    let formattedDate = new Date(patient.dateTime);
    // First step: Converts passed Date/Time to timestamp
    // Second step: TimezoneOffset is used to adjust the local timezone, UTC to GMT-4
    let localDate = new Date(formattedDate.getTime() - formattedDate.getTimezoneOffset() * 60000);
    // Last step: Converts localDate to an ISO 8601 string which extracts
    // the date format need to correct display the date in the input field (YYYY-MM-DDTHH:mm)
    let formattedDateTime = localDate.toISOString().slice(0, 16);

    console.log(formattedDate); // Console test for start date/time

    document.getElementById("dateTime").value = formattedDateTime;
    document.getElementById("appointmentType").value = patient.appointmentType;
    document.getElementById("preDentist").value = patient.preDentist || "";
    document.getElementById("allergies").value = patient.allergies || "";
    document.getElementById("curMed").value = patient.curMed || "";
    document.getElementById("medCond").value = patient.medCond || "";
    document.getElementById("additionalInfo").value = patient.additionalInfo || "";
}

// Loads the patients dynamically using the defer attribute in the html file
populateData();
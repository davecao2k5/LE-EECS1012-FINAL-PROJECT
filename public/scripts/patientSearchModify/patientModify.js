import { formValidation } from "../patientForm/formValidation.js";

// This is used to fix the bug related to 
// Uncaught ReferenceError: subSaveClick is not defined
window.subSaveClick = subSaveClick;

// Function used to set the index of the table when the row is clicked on
function choosenRow(event){
    if(event.target && event.target.nodeName === 'TD') {
        let row = event.target.parentNode;
        
        // Starts at 0 with -1
        let rowIndex = row.rowIndex - 1;

        // Gets the row index by clicking on the table
        window.selectedRowIndex = rowIndex;
    }
}      

// Used for clearing the forms to empty fields
function resetFormFields() {

// Resets the select row
window.selectedRowIndex = null;

document.getElementById("firstName").value = '';
document.getElementById("lastName").value = '';
document.getElementById("phoneNum").value = '';
document.getElementById("address").value = '';
document.getElementById("zipCode").value = '';
document.getElementById("insuranceName").value = '';
document.getElementById("billing").value = '';
document.getElementById("payMethod").value = '';
document.getElementById("cardNum").value = '';
document.getElementById("creditCardHolder").value = '';
document.getElementById("cvv").value = '';
document.getElementById("dateTime").value = '';
document.getElementById("appointmentType").value = '';
document.getElementById("preDentist").value = '';
document.getElementById("allergies").value = '';
document.getElementById("curMed").value = '';
document.getElementById("medCond").value = '';
document.getElementById("additionalInfo").value = '';
}

/*
 * subSaveClick: Grabs the values based on the row that was clicked,
 *               Then the rows get updated when changes are made.
 */

function subSaveClick() {

    // Empty array for patient data
    let patientData;
    let rowIndex = window.selectedRowIndex;

    // Nothing to save until a patient has been clicked in the table
    if (rowIndex === null || rowIndex === undefined) {
        return;
    }

    // Gets the patientData and updates the patient at the specified index with new values
    // and returns it as a POST request
    fetch('/api/patientData')
        .then(response => {
            return response.json()
        })
        .then(data => {
            patientData = data;
            console.log(patientData);
        
            if (!formValidation()) {
                return;
            }
        
            // Grabs all the values realted to the patient
            let firstName = document.getElementById('firstName').value;
            let lastName = document.getElementById('lastName').value;
            let dateTime = document.getElementById('dateTime').value;
            let phoneNum = document.getElementById("phoneNum").value;
            let address = document.getElementById("address").value;
            let zipCode = document.getElementById("zipCode").value;
            let insuranceName = document.getElementById("insuranceName").value;
            let billing = document.getElementById("billing").value;
            let payMethod = document.getElementById("payMethod").value;
            let cardNum = document.getElementById("cardNum").value;
            let creditCardHolder = document.getElementById("creditCardHolder").value;
            let cvv = document.getElementById("cvv").value;
            let appointmentType = document.getElementById("appointmentType").value;
            let preDentist = document.getElementById("preDentist").value;
            let allergies = document.getElementById("allergies").value;
            let curMed = document.getElementById("curMed").value;
            let medCond = document.getElementById("medCond").value;
            let additionalInfo = document.getElementById("additionalInfo").value;
        
            // Finds the row that is being selected. Uses window to select the row
            
            let table = document.getElementById('patientDataTable');
            let row = table.rows[rowIndex];

            console.log("Selected Row Index:", rowIndex);
            console.log("Total Table Rows:", table.rows.length);

            // Updates the row with the name & date. 
            // Reflects name and date within the table if those fieldls are updated
            row.cells[0].textContent = firstName + ' ' + lastName; 
            row.cells[1].textContent = dateTime; 
        
            let updatedPatient = patientData[rowIndex];

            console.log("Updating patient at index:", rowIndex, updatedPatient); // Logs the row at which the patient was being updated

            // Updates the patient with new form values 
            updatedPatient.firstName = firstName;
            updatedPatient.lastName = lastName;
            updatedPatient.dateTime = dateTime;
            updatedPatient.phoneNum = phoneNum;
            updatedPatient.address = address;
            updatedPatient.zipCode = zipCode;
            updatedPatient.insuranceName = insuranceName;
            updatedPatient.billing = billing;
            updatedPatient.payMethod = payMethod;
            updatedPatient.cardNum = cardNum;
            updatedPatient.creditCardHolder = creditCardHolder;
            updatedPatient.cvv = cvv;
            updatedPatient.appointmentType = appointmentType;
            updatedPatient.preDentist = preDentist;
            updatedPatient.allergies = allergies;
            updatedPatient.curMed = curMed;
            updatedPatient.medCond = medCond;
            updatedPatient.additionalInfo = additionalInfo;
        
            console.log(patientData); // Checks for the updated patientData

            // Clears input by calling the function
            resetFormFields();

            // Sends the updated patient data back to the array using the POST request
           return fetch('api/savePatientData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(patientData)
            })
            .then(response => {
                return response.json()
            })
        }); 
}

// Waiting to click the choosen row within the table
document.getElementById('patientDataTable').addEventListener('click', choosenRow);

// Prevents the immediate submission of the data and then calls the subSaveClick
document.getElementById('subSaveAlert').addEventListener('click', function(event) {
    event.preventDefault(); 
    subSaveClick();
});
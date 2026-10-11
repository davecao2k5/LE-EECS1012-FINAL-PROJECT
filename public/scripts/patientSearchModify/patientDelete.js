// Row and Name stored in global scope
let selectedRowIndex = null; 
let selectedPatientName = "";

// This is used to fix the bug related to 
// Uncaught ReferenceError: subDeleteClick is not defined
window.subDeleteClick = subDeleteClick;

// Function used to set the index of the table when the row is clicked on
// Similar to patientModify choosenRow function
function choosenRow(event){
    if(event.target && event.target.nodeName === 'TD'){
        let row = event.target.parentNode;
        
        // Starts at 0 with -1
        selectedRowIndex = row.rowIndex - 1;
        
        // Gets the name of the patient
        selectedPatientName = row.cells[0].textContent;

        console.log("Patient selected: ", selectedPatientName) // Check what patient has been selected
    }       
}

// Used for clearing the forms to empty fields
function resetFormFields() {
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
 * subDeleteClick: Warns the user about deleting the patient. When the patient is deleted
 *                 it is removed from the patient from the array.
 */

function subDeleteClick() {
    let warnPopup = document.getElementById('alertMsgWarn');
    let deletePopup = document.getElementById('alertMsgDelete');

    // Used to prevent the delete pop-up when no patient is selected
    if (!selectedPatientName) { 
        return;
    }

    // Shows the patient name for the pop-up when the patient is going to be deleted
    if (selectedPatientName) {
        document.getElementById('subInfoWarn').textContent = `Are you sure you want to delete ${selectedPatientName} from the schedule?`;
    }

    // Set the warning to visible intitialy
    warnPopup.style.display = 'block';

    // Message disappears if the no button is clicked on
    document.getElementById('btnCloseNo').onclick = function() {
        warnPopup.style.display = 'none';
    };

    // Deletes the patient and shows the deleted message when the confimation is yes
    // onclick (not addEventListener) so clicking Delete again doesn't stack up extra handlers
    document.getElementById('btnCloseYes').onclick = function() {
        warnPopup.style.display = 'none';
        deletePatient(selectedRowIndex);
        deletePopup.style.display = 'block'; 
    };

    // Closes button to confirm deletion
    document.getElementById('btnClose').onclick = function() {
        deletePopup.style.display = 'none'; 
    };

    // Closes popup for corner click
    document.getElementById('cornerCloseWarn').onclick = function() {
        warnPopup.style.display = 'none';
    };

    // Closes popup for corner click
    document.getElementById('cornerCloseDelete').onclick = function() {
        deletePopup.style.display = 'none'; 
    };
}

/*
 * deletePatient: Removes the patient from the table and from the server's patient array,
 *                so the appointment also disappears from the calendar.
 */

function deletePatient(rowIndex) {
    // Remove the patient from the table by row (not by name, two patients can share a name)
    document.getElementById('patientDataTable').deleteRow(rowIndex);

    // Resets the global variables and form fields
    // window.selectedRowIndex is the row patientModify would save to, so it is cleared too
    selectedRowIndex = null;
    selectedPatientName = "";
    window.selectedRowIndex = null;
    resetFormFields();

    // The table is filled in the same order as the server array, so the row index is the patient index
    fetch('/api/patientData')
        .then(response => response.json())
        .then(patientData => {
            patientData.splice(rowIndex, 1);

            // Sends the patient data without the deleted patient back to the server
            return fetch('/api/savePatientData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
        })
        .catch(error => {
            console.log('Patient was not deleted from the server', error);
        });
}

// Waiting to click the choosen row within the table
document.getElementById('patientDataTable').addEventListener('click', choosenRow);

// Prevents the immediate submission of the data and then calls the subDeleteClick
document.getElementById('subDeleteAlert').addEventListener('click', function(event) {
    event.preventDefault(); 
    subDeleteClick();
});
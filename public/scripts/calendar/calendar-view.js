/**
Watches for "view-change" and "date-change" events.

Loads either the month or week calendar accordingly.

Uses initMonthCalendar() and initWeekCalendar() to render.
 */
import { today } from "./date.js";
import { initMonthCalendar } from "./month-calendar.js";
import { initWeekCalendar } from "./week-calendar.js";



export function initCalendar(){                                                 
    const calendarElement=document.querySelector("[data-calendar]");
    let selectedView="month-selector";
    let selectedDate=today();
    let patientData=[];

    // Gets the latest patients from the server, then redraws the calendar with them
    function loadPatientData(){
        fetch("/api/patientData")
        .then(res=>res.json())
        .then(data=>{
            patientData=data;
            refreshCalendar();
        })
        .catch(err=>console.error("Error fetching patient data",err));
    }

    function refreshCalendar(){
        calendarElement.replaceChildren();
        if(selectedView==="month-selector"){
            initMonthCalendar(calendarElement,selectedDate, patientData);    //display calendar month when it gotta selected
        }else if(selectedView==="week-selector"){
            initWeekCalendar(calendarElement,selectedDate, patientData);
        }else{

        }
    }
    document.addEventListener("view-change",
        (event)=>{
            selectedView=event.detail.view;
            refreshCalendar()
            
        }
    );
    document.addEventListener("date-change", (event)=>{
        selectedDate=event.detail.date;
        refreshCalendar();
    })
    // Coming back with the browser's Back button can show a cached copy of the page,
    // so reload the patients to pick up any adds, edits or deletes made on the other pages
    window.addEventListener("pageshow", (event)=>{
        if(event.persisted){
            loadPatientData();
        }
    });
    refreshCalendar();
    loadPatientData();
}
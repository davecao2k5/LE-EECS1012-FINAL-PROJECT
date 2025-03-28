import { generateWeekDays, isTheSameDay, today } from "./date.js";


const calendarTemplateElement=document.querySelector("[data-template='week-calendar']");
const calendarDayOfWeekTemplateElement=document.querySelector("[data-template='week-calendar-day-of-week']");
const calendarAllDayListItemTemplateElement= document.querySelector("[data-template='week-calendar-day-list-item']");
const calendarColumnTemplateElement=document.querySelector("[data-template='week-calendar-column']");
const dateFormatter= new Intl.DateTimeFormat("en-US",{
    weekday:'short'
});

export function initWeekCalendar(parent, selectedDate, eventStore){

    const calendarContent=calendarTemplateElement.content.cloneNode(true);
    const calendarElement= calendarContent.querySelector("[data-week-calendar]");
    const calendarDayOfWeekListElement = calendarElement.querySelector("[data-week-calendar-day-of-week-list]");
    const calendarAllDayListElement= calendarElement.querySelector("data-week-calendar-all-day-list");
    const calendarColumnsElement=calendarElement.querySelector("[data-week-calendar-columns]");


    const weekDays= generateWeekDays(selectedDate);
    for(const weekDay of weekDays){


        initDayOfWeek(calendarDayOfWeekListElement,selectedDate, weekDay);
        initColumn(calendarColumnsElement,weekDay);
    }
    parent.appendChild(calendarElement);
}
function initDayOfWeek(parent,selectedDate,weekDay){
    const calendarDayOfWeekContent= calendarDayOfWeekTemplateElement.content.cloneNode(true);
    const calendarDayOfWeekElement=calendarDayOfWeekContent.querySelector("[data-week-calendar-day-of-week]");
    const calendarDayOfWeekButtonElement= calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-button]");
    const calendarDayOfWeekDayElement= calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-day]");
    const calendarDayOfWeekNumberElement=calendarDayOfWeekElement.querySelector("[data-week-calendar-day-of-week-number]");



    calendarDayOfWeekNumberElement.textContent= weekDay.getDate();
    calendarDayOfWeekDayElement.textContent= dateFormatter.format(weekDay);

    if(isTheSameDay(weekDay, today())){
        calendarDayOfWeekButtonElement.classList.add("week-calendar__day-of-week-button--highlight");
    }

    parent.appendChild(calendarDayOfWeekElement);
}


function initColumn(parent,weekDay){
    const calendarColumnContent= calendarColumnTemplateElement.content.cloneNode(true);
    const calendarColumnElement= calendarColumnContent.querySelector("[data-week-calendar-column]");
    const calendarColumnCellElements= calendarColumnElement.querySelectorAll("[data-week-calendar-cell]");

    parent.appendChild(calendarColumnElement);
}
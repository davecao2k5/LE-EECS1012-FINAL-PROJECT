import { generateWeekDays, isTheSameDay, today } from "./date.js";


const calendarTemplateElement=document.querySelector("[data-template='week-calendar']");
const calendarDayOfWeekTemplateElement=document.querySelector("[data-template='week-calendar-day-of-week']");
const calendarAllDayListItemTemplateElement= document.querySelector("[data-template='week-calendar-day-list-item']");
const calendarColumnTemplateElement=document.querySelector("[data-template='week-calendar-column']");
const dateFormatter= new Intl.DateTimeFormat("en-US",{
    weekday:'short'
});

export function initWeekCalendar(parent, selectedDate, eventData=[]){

    const calendarContent=calendarTemplateElement.content.cloneNode(true);
    const calendarElement= calendarContent.querySelector("[data-week-calendar]");
    const calendarDayOfWeekListElement = calendarElement.querySelector("[data-week-calendar-day-of-week-list]");
    const calendarAllDayListElement= calendarElement.querySelector("[data-week-calendar-all-day-list]");
    const calendarColumnsElement=calendarElement.querySelector("[data-week-calendar-columns]");


    const weekDays= generateWeekDays(selectedDate);
    for(const weekDay of weekDays){


        initDayOfWeek(calendarDayOfWeekListElement,selectedDate, weekDay);
        initColumn(calendarColumnsElement,weekDay, eventData);
    }
    parent.appendChild(calendarElement);

    // Opens the week at the start of office hours (8:00 AM) instead of midnight
    const calendarContentInnerElement=calendarElement.querySelector(".week-calendar__content-inner");
    const openingHourElement=calendarElement.querySelectorAll(".week-calendar__time-item")[8];
    calendarContentInnerElement.scrollTop=openingHourElement.offsetTop;
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


function initColumn(parent,weekDay,eventData){
    const calendarColumnContent= calendarColumnTemplateElement.content.cloneNode(true);
    const calendarColumnElement= calendarColumnContent.querySelector("[data-week-calendar-column]");
    const calendarColumnCellElements= calendarColumnElement.querySelectorAll("[data-week-calendar-cell]");
    const eventList = calendarColumnElement.querySelector("[data-event-list]");
    const dayEvents = eventData.filter(event => 
        isTheSameDay(new Date(event.dateTime.replace(",", "")), weekDay)
    );

    for (const event of dayEvents) {
        const start = new Date(event.dateTime);
        const end = event.endTime ? new Date(event.endTime) : new Date(start.getTime() + 60 * 60 * 1000); // default +1 hour if patient dont have end time
    
        const startHour = start.getHours();
        const startMinutes = start.getMinutes();
        const durationMinutes = (end - start) / (1000 * 60); // convert ms to minutes
    
        const eventBlock = document.createElement("div");
        eventBlock.classList.add("event");
        const startTime=start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime=end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        eventBlock.textContent = `${event.firstName} \n${startTime}-${endTime}`;
        eventBlock.style.position = "absolute";
        eventBlock.style.top = `${(startMinutes / 60) * 100}%`;
        eventBlock.style.height = `${(durationMinutes / 60) * 100}%`;
        const targetCell = calendarColumnCellElements[startHour];
        if (targetCell) {
            targetCell.style.position = "relative"; 
            targetCell.appendChild(eventBlock);
        }
    }

    parent.appendChild(calendarColumnElement);
}
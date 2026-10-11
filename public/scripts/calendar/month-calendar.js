import { generateMonthCalendarDays, today,isTheSameDay } from "./date.js";

const calendarTemplateElement= document.querySelector("[data-template='month-calendar']");
const calendarDayTemplateElement=document.querySelector("[data-template='month-calendar-day']");
const calendarWeekClasses={
    4:"month-calendar--four-week",
    5:"month-calendar--five-week",
    6:"month-calendar--six-week"
}

export function initMonthCalendar(parent, selectedDate, eventData){
    const calendarContent= calendarTemplateElement.content.cloneNode(true); //clone the template
    const calendarElement=calendarContent.querySelector("[data-month-calendar]");
    const calendarDayListElement= calendarElement.querySelector("[data-month-calendar-day-list]");
    
    const calendarDays=generateMonthCalendarDays(selectedDate);
    const calendarWeeks= calendarDays.length /7;

    const calendarWeekClass= calendarWeekClasses[calendarWeeks];
    calendarElement.classList.add(calendarWeekClass);

    for(const calendarDay of calendarDays){
        initCalendarDay(calendarDayListElement, calendarDay,eventData);
    }

    parent.appendChild(calendarElement);

    function initCalendarDay(parent, calendarDay, eventData=[]){
        const calendarDayContent= calendarDayTemplateElement.content.cloneNode(true);
        const calendarDayElement=calendarDayContent.querySelector("[data-month-calendar-day]");
        const calendarDayLabelElemenent=calendarDayContent.querySelector("[data-month-calendar-day-lable]");
        const dayEvents=eventData.filter(event=>
            isTheSameDay(calendarDay, new Date(event.dateTime.replace(",","")))
        );
        const eventList = calendarDayElement.querySelector("[data-event-list]");
    for (const event of dayEvents) {
        const eventItem = document.createElement("li");
        eventItem.classList.add("event-list__item");

        const eventButton = document.createElement("button");
        eventButton.classList.add("month-event-button");
        eventButton.textContent = `${event.firstName} ${event.lastName}`;
        eventItem.appendChild(eventButton);
        eventList.appendChild(eventItem);
}

        if(isTheSameDay(today(),calendarDay)){
            calendarDayElement.classList.add("month-calendar__day--highlight");
        }


        calendarDayLabelElemenent.textContent= calendarDay.getDate();
        parent.appendChild(calendarDayElement);
    }

}
/**
 * this is a main function
 */
import {initViewSelect} from "./viewselect.js"; //Handles switching between "month" and "week" view.
import {initCalendar} from  "./calendar-view.js"; //Sets up the calendar display and loads the patients from the server.
import { startLiveTime } from "./live-time.js";  //Displays real-time clock in the header.
import { initFuncButton } from "./function-box.js"; //Sets up navigation buttons (today, next, previous).
initCalendar();
initViewSelect();
startLiveTime();
initFuncButton();
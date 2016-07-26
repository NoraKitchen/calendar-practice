angular.module("calendar-test")
    .component("editShiftsComponent", {
        templateUrl: "test-scripts/edit-shifts.html",
        controller: EditShiftsController
    })

function EditShiftsController(uiCalendarConfig) {

    //^%$#%$ DAY IS NOT BEING REST as you probably intended at the beginning of each loop, thats probably your prob

    //dow to current display day not working---THINK (need to test more) is working for singles, but something gets off in loop maybe?
    //re-load after add two shifts might not be working right, but dont' troubleshoot till first prob done

    //expand button reloads old data?

    //think here will have an obj/array of shift data set to either the loaded shift data or empty
    //let them edit the obj, then if they click save the edits are finalized and sent to db

    // DO NEXT DO NEXT DO NEXT
    //finish special shift req


    var esc = this;
    //need to replace dummyshiftrequirements with the actual shift requirements from db
    esc.dummyShiftRequirements = ["Must have eyeballs", "Be cool", "be awesome"]
    esc.tempRequirements = [{ requirement: "", numberOfStaff: "" }]
    esc.tempShifts = {
        shifts: [],
        displayHours: {
            minTime: "",
            maxTime: ""
        }
    };
    esc.displayEvents = {
        events: []
    }

    esc.toggleCalendar = function () {
        if (esc.calendarExpanded) {
            esc.uiConfig.calendar.height = 300;
            esc.calendarExpanded = false;
        }
        else {
            esc.uiConfig.calendar.height = "auto";
            esc.calendarExpanded = true;
        }
    }


    //adds another 'special staff requirement' input every time "add more requirements" button is clicked
    esc.addReqField = function () {
        esc.tempRequirements.push({ requirement: "", numberOfStaff: "" });
    }

    esc.removeRequirement = function (requirement) {
        var index = esc.tempRequirements.indexOf(requirement);
        esc.tempRequirements.splice(index, 1)
    }


    esc.cleanTempReqs = function () {
        for (var i = 0; i < esc.tempRequirements.length; i++) {
            var currentReq = esc.tempRequirements[i];
            currentReq.incomplete = false;
            if (currentReq["numberOfStaff"] == null && currentReq["requirement"] == "") {
                esc.removeRequirement(currentReq);
                i -= 1;
            }
            else if (currentReq["numberOfStaff"] == null || currentReq["requirement"] == "") {
                currentReq.incomplete = true;
            }
        }
        //check if any requirments incomplete
        for (var i = 0; i < esc.tempRequirements.length; i++) {
            var currentReq = esc.tempRequirements[i];
            if (currentReq.incomplete) {
                sweetAlert("Incomplete Special Staff Requirement", "One of your special staff requirements is incomlete. Please see Special Staff Requirements section to remove or complete your requirements.", "error");
                return false
            }
        }
        return true;
    }

    esc.checkReqDupes = function () {
        var reqsUsed = [];
        //add all requirements used to reqsUsed, set hasDuplicate to false till proven otherwise
        for (var i = 0; i < esc.tempRequirements.length; i++) {
            var currentReq = esc.tempRequirements[i];
            currentReq.hasDuplicate = false;
            reqsUsed.push(currentReq.requirement);
        }
        //if a req is used more than once, note it hasDuplicate
        for (var i = 0; i < reqsUsed.length; i++) {
            var currentReqUsed = reqsUsed[i];
            for (var j = 0; j < reqsUsed.length; j++) {
                var compareReqUsed = reqsUsed[j];
                if (i != j && currentReqUsed == compareReqUsed) {
                    esc.tempRequirements[i].hasDuplicate = true;
                }
            }
        }
        //check if anything has duplicates
        for (var i = 0; i < esc.tempRequirements.length; i++) {
            var currentReq = esc.tempRequirements[i];
            if (currentReq.hasDuplicate == true) {
                sweetAlert("Duplicate Special Staff Requirements", "You've listed a special requirement more than once. Please see the Special Staff Requirements section to remove one of your duplicates.", "error");
                return false
            }
        }
        return true
    }

    esc.addShift = function (newShift) {
        var tempReqsClean = esc.cleanTempReqs();
        var noReqDupes = esc.checkReqDupes();
        if (tempReqsClean && noReqDupes) {
            //delete validation properties from special requirements
            for (var i = 0; i < esc.tempRequirements.length; i++) {
                var currentReq = esc.tempRequirements[i];
                delete currentReq.incomplete;
                delete currentReq.hasDuplicate
            }
            newShift.specialStaffRequirements = esc.tempRequirements;
            esc.tempShifts.shifts.push(newShift);
            console.log(esc.tempShifts);
            esc.newShift = {};
            $("#day-select option:selected").removeAttr("selected");
            esc.tempRequirements = [{ requirement: "", numberOfStaff: "" }]
        }
    }

    esc.displayShifts = function () {
        esc.displayEvents.events = [];

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        if (m < 10) { m = "0" + m }
        var y = date.getFullYear();
        var dow = date.getDay();
        //takes loaded 'temp shifts' and transforms them into format readable by fullcalendar, then writes to events dispayed by fullcalendar
        for (var i = 0; i < esc.tempShifts.shifts.length; i++) {
            var currentShift = esc.tempShifts.shifts[i];
            for (var j = 0; j < currentShift.dow.length; j++) {
                var currentShiftDay = currentShift.dow[j];
                var newShiftDay = {}
                newShiftDay.allDay = false;
                newShiftDay.color = currentShift.color;
                newShiftDay.title = currentShift.title;

                //calc date 
                var dowMap = {
                    Sunday: 0,
                    Monday: 1,
                    Tuesday: 2,
                    Wednesday: 3,
                    Thursday: 4,
                    Friday: 5,
                    Saturday: 6
                }
                var diff = dowMap[currentShiftDay] - dow;
                d = d+ diff;
                //wow! moment is smart, knows if you go out of bounds on date to switch to right month

                //calc hours
                function convertTime(timeString) {
                    var convertedTimes = {};
                    var splitH = timeString.split(":")
                    convertedTimes.h = splitH[0]
                    var splitM = splitH[1].split(" ");
                    convertedTimes.m = splitM[0]
                    if (splitM[1] == "PM" && convertedTimes.h != "12") {
                        convertedTimes.h = 12 + parseInt(convertedTimes.h);
                    }
                    else if (splitM[1] == "AM" && convertedTimes.h == "12") {
                        convertedTimes.h = "00"
                    }
                    return convertedTimes
                }

                var startTimes = convertTime(currentShift.startTime);
                var endTimes = convertTime(currentShift.endTime);
                console.log("test: " +y+"-"+m+"-"+d+" "+endTimes.h+":"+endTimes.m)
                newShiftDay.start = moment(new Date(y, m, d, startTimes.h, startTimes.m))
                newShiftDay.end = moment(new Date(y, m, d, endTimes.h, endTimes.m))
                //may need to add all other info about shift onto it, but not for now, just get it working

                esc.displayEvents.events.push(newShiftDay)
            }
        }
        uiCalendarConfig.calendars.addShiftCalendar.fullCalendar('removeEventSource', esc.testCalendar.events);
        esc.testToggleCalEvents();
        uiCalendarConfig.calendars.addShiftCalendar.fullCalendar('addEventSource', esc.testCalendar.events);
    }

    $(document).ready(function () {
        $('.time-picker').timepicker({ defaultTime: false });
        $('.calendar-time-picker').timepicker({ defaultTime: false, interval: 60, timeFormat: 'HH:mm:ss' });
        $("#day-select").multiselect();

        //Add smooth scroll for "Add staff requirements" link
        $("#add-req-link").click(function () {
            var id = $(this).attr("href");
            $("body").animate({ scrollTop: $(id).offset().top }, "slow");
            return false;
        });
    });

    esc.uiConfig = {
        calendar: {
            minTime: "07:00:00",
            maxTime: "21:00:00",
            height: 300,
            editable: false,
            header: {
                //theses don't seem to be showing up anywhere. not working?
                left: "",
                center: "title",
                right: ""
            },
            titleFormat: {
                week: '[Your Shifts]',
                day: 'dddd d/M'
            },
            columnFormat: 'ddd',
            // dayClick: mc.dayClick,
            eventDrop: function (arg1, arg2, arg3) {

                console.log(arg3);
            },
            defaultView: "agendaWeek"
        }
    }


    esc.testCalendar = {
        scheduleId: "bleh",
        events: [{
            id: "DayShift",
            title: "Day Shift: ",
            start: moment('2016-06-20 09:00:00'),
            end: moment('2016-06-20 15:00:00'),
            allDay: false,
            staff: [],
        },
            {
                id: "NightShift",
                title: "Night Shift: ",
                start: moment('2016-06-20 15:00'),
                end: moment('2016-06-20 21:00'),
                color: "#95C9FF",
                allDay: false,
                staff: [],
            },
            {
                id: "WeekendShift",
                start: moment('2016-06-20 13:00:00'),
                end: moment('2016-06-20 18:00:00'),
                allDay: false,
            },
        ]
    }

    esc.testToggleCalEvents = function () {
        esc.testCalendar = esc.displayEvents;
        console.log(esc.testCalendar);
    }


};
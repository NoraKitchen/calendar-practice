angular.module("calendar-test")
    .component("mainComponent", {
        templateUrl: "main-component.html",
        controller: MainController
    })

function MainController(uiCalendarConfig) {

    //can't get shift colors to show up (or maybe even work?) in basic week view like the jsfiddle here http://stackoverflow.com/questions/30308737/mutliple-business-hours-in-full-calendar-with-two-shifts-each-day?rq=1

    var mc = this;
    mc.test = "Hi from the test"
    mc.testArray = ["one", "two"]

    // this code works fine but mayb below is better?
    // $("#employeeCol").on("DOMNodeInserted", ".employee", function () {
    //     $(this).draggable({
    //         revert: true,
    //         revertDuration: 500
    //     });
    // });

    document.addEventListener("DOMNodeInserted", function () {
        $('.employee').draggable({
            revert: true,
            revertDuration: 500
        })
    });


    // //remove staff from shift when x clicked
    // $("#calendar").on("click", ".remove-staff-button", function (event) {
    //     event.preventDefault();
    //     var staffMember = $(this).siblings("span")[0].textContent;


    // })



    mc.fakeEmployeeList = [
        {
            id: 1,
            name: "Joey Jones"
        },
        {
            id: 2,
            name: "Penny Pinkerton"
        }
    ]



    mc.stuffs = {
        scheduleId: "bleh",
        events: [{
            //     title: 'Event1',
            //     start: new Date(2016, 4, 04)
            // },
            //     {
            //         title: 'Event2',
            //         start: new Date(2016, 4, 28)
            //     },
            //   {
            id: "DayShift",
            title: "Day Shift: ",
            // start: '9:00',
            // end: '15:00',
            start: moment('2016-05-30 09:00:00'),
            end: moment('2016-05-30 15:00:00'),
            // rendering: "background",
            color: "#ff9f89",
            allDay: false,
            staff: [],
        },
            {
                id: "NightShift",
                start: moment('2016-05-30 15:00:00'),
                end: moment('2016-05-30 21:00:00'),
                //dow: [1, 2, 3, 4, 5],
                // rendering: "background",
                color: "blue",
                allDay: false,
                staff: [],
            },
            {
                id: "WeekendShift",
                start: '10:00',
                end: '19:00',
                dow: [0, 6],
                rendering: "background",
                color: "gray",
                allDay: false,
            }]
    }



    mc.dayClick = function () {
        console.log("You clicked a day. Good job.");
    }

    mc.eventDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        //Event is the event ojb that hold's event info (date, title, etc). 
        //call hasTime on event's start/end to see if it has been dropped in a timed or all-da area
        var eventObj = event;
        //delta is a Duration Object that represents the amount of time the event was moved by
        console.log(event.start) //this appears to have info on when dropped, but a day off???
        console.log(event.title + "was dropped on " + event.start.format()) //but this works. format() is from moment.js I think and is a way of displaying moments, like a filter. no idea why the date stored and date filtered are diff though.
        var duration = delta;
        //the revert function, if called, reverts event's start/end to before drag. useful if ajax call fails
        var rollback = revertFunc;
        //the event holds the native js event with low-level info like mouse coordiantes
        var event = jsEvent;
        //ui is an empty object, before version 2.1 it was the jquery ui object
        var emptyObj = ui;
        //view holds the current view object. is this what you want?
        var here = view;
        ////////




        // console.log("You dropped an event. you changed days " + arg2._days);
        // var startingDate = arg.start._d.getDate();
        // console.log(startingDate);
        // var newDate = startingDate + arg2._days;
        // console.log("changed to day " + newDate)
        // //works up to here, but still not 'saving' 
        // arg.start._d = new Date(2016, 4, newDate)
        // console.log(mc.stuffs.events);

        //arg3 - {o.undo(),s.reportEventChange()}



    }

    mc.eventResize = function () {
        console.log("you rezied an event. so skillful.");
    }


    mc.uiConfig = {
        calendar: {
            //height: 600,
            droppable: true,
            minTime: '08:00',
            //editable: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultView: 'agendaWeek', //had basicWeek before
            eventRender: function (event, element, view) {
                // .html("{{$ctrl.test}}") --didn't work
                if (event.staff) {
                    var listHtml = "<ul class='list-unstyled scheduled-staff'>"
                    for (var i = 0; i < event.staff.length; i++) {
                        var currentPerson = event.staff[i]
                        listHtml += "<li><span>" + currentPerson + "</span> <a href='#' class='remove-staff-button'>X</a></li>"
                    }
                    listHtml += "</ul>"
                    element.find(".fc-title").html(listHtml);
                }


                // element.qtip({
                //     content: event.description
                // });
            },
            eventClick: function (event, jsEvent, view) {
                var xButtonClicked = jsEvent.toElement;
                var staffMember = $(xButtonClicked).siblings("span")[0].textContent;
                var memberIndex = event.staff.indexOf(staffMember);
                event.staff.splice(memberIndex, 1)
                console.log(event.staff)
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEventSource', mc.stuffs.events);
                uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', mc.stuffs.events);
            },
            drop: function (date, jsEvent, ui, resourceID) {
                console.log(this.innerHTML + " dropped on " + date.format())
                //this holds the dom element dropped
                for (var i = 0; i < mc.stuffs.events.length; i++) {
                    var currentShift = mc.stuffs.events[i]
                    if (date.isBetween(currentShift.start, currentShift.end)) {
                        console.log(this.innerHTML + " assigned to " + currentShift.id)
                        //have various check functions here, if employee available, if over hours, 
                        //also function that runs when 'fully staffed' 
                        currentShift.staff.push(this.innerHTML) //would really find staff obj and their id, probably
                        //would need to stop them from double-adding someone
                        //NEED A WAY TO UPDATE SHIFT TEXT ON CALENDAR--TITLE IS UPDATING BUT NOT SHOWING
                        // resourceID.calendar.fullCalendar('rerenderEvents') //will this update title? - nope refetch not work either
                        //mc.stuffs.events.splice(i, 1, currentShift); //tried seeing if it wouldwatch/uppdate when the array item was removed and put back in
                        //gonna try to repop the whole events array---didn't work
                        // var savingEventData = mc.stuffs.events;
                        // mc.stuffs.events.slice(0, mc.stuffs.events.length);
                        // for (var j = 0; j < 3; j++){
                        //     mc.stuffs.events.push(savingEventData[j]);
                        // }
                        //another suggestion...
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEventSource', mc.stuffs.events);
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', mc.stuffs.events);
                        //uiCalendarConfig.calendars.myCalendar.fullCalendar('refetchEvents');
                        return;
                    }
                }
                console.log("that was not a shift!")
            }
            // dayClick: mc.dayClick,
            // eventDrop: mc.eventDrop,
            // eventResize: mc.eventResize
            //     timeFormat: 'H:mm',
            //     shifts: [{
            //         //you can make things you drag on abide by these time slots, i believe
            //             //little unclear on how to make these an actua constraint, pass in somehow on drag????
            //actually maybe you really do have to label the prop 'businessHours' and then it works
            //         //however, it may be better to simply have business hours here, if any
            //         //and use background events as your shift? - http://stackoverflow.com/questions/27688279/full-calendar-business-hours
            //         //seems to be normal event, with an id like 'shift1' and rendering: 'background'
            //         //then when you make your shift event, it migh thave its own id plus constraint: 'shift1'
            //         //i think after that you can make the shift 'selectable' and then drag onto it

            //         //monday through friday morning shift
            //         start: '9:00',
            //         end: '15:00',
            //         dow: [1, 2, 3, 4, 5]
            //     },
            //     {
            //         //monday through friday night shift
            //         start: '15:00',
            //         end: '21:00',
            //         dow: [1, 2, 3, 4, 5]
            //     },
            //     {
            //         //weekend shift, full day cause i'm lazy
            //         start: '10:00',
            //         end: '19:00',
            //         dow: [0, 6]
            //     }]

        }

    }


}
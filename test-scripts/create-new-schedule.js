angular.module("calendar-test")
    .component("createNewScheduleComponent", {
        templateUrl: "test-scripts/create-new-schedule.html",
        controller: CreateNewScheduleController
    })

    function CreateNewScheduleController(){

        //needs a shiftData bool/var---on true will hide prompt to setup shifts
        //the button on that shift setup prompt (as well as the edit shifts button) needs to route to editshifts route--don't need book like thought cause you can just check there if there is shift data

    };
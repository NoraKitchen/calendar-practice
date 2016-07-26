(function () {
    angular.module('calendar-test')
        .component('managerDashboardComponent', {
            templateUrl: 'test-scripts/manager-dashboard-component.html',
            controller: managerDashboardController,
        })

    function managerDashboardController() {
        var mdc = this;
        
        //once routes set up, need to give buttons ui-sref

        //need to figure out real info object schema(update in alert view too), but till then....
        mdc.alerts = [
            //dummy data
            {
                body: "You have no bananas",
                resolved: false
            },
            {
                body: "You must do all the things",
                resolved: true
            },
            {
                body: "You have no bananas",
                //strike out on true is not working
                resolved: true
            },
            {
                body: "You must do all the things",
                resolved: false
            },
            {
                body: "You have no bananas",
                resolved: false
            },
            {
                body: "You must do all the things",
                resolved: false
            }
        ]

        mdc.testCalendar = {
            events: [{
                title: 'Event1',
                start: new Date(2016, 4, 04)
            },
                {
                    title: 'Event2',
                    start: new Date(2016, 4, 28)
                }]
        }


        mdc.uiConfig = {
            calendar: {
                // height: 300,
                editable: true,
                header: {
                    //theses don't seem to be showing up anywhere. not working?
                    left: "left stuffs",
                    center: "title",
                    right: "right stuffs"
                },
                // dayClick: mc.dayClick,
                 eventDrop: function(arg1, arg2, arg3){
                     
                     console.log(arg3);
                 }
                // eventResize: mc.eventResize
                // eventDragStart: function (event, jsEvent, ui, view) {
                //     console.log(event);
                //     console.log(jsEvent);
                //     console.log(ui);
                //     console.log(view);
            }




        }
    }
} ())
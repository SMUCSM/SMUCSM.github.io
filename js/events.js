// Global strings that we are searching for / removing to parse the type of event
var TMHT  = '[TMHT]';  // Teach Me How To
var TMHTC = '[TMHTC]'; // Teach Me How To Challenge Night
var HS    = '[HS]';    // Help Session
var SE    = '[SE]';    // Special Event

//Get the events from google calendar API
$.get("https://www.googleapis.com/calendar/v3/calendars/smu.csm%40gmail.com/events", {
    fields: "items(description,status,summary,location,start,end)",
    key: "AIzaSyDHzhC_rt5PQDwJvpS2-QkfMfogDaHhFdc"
}).done(function(data)
{

    console.log('the data', data.items);

    // Get events that are in the future or half day old
    var upcomingEvents = [];
    _.each(data.items, function(evt){
        //TODO: Add more robust checking for cancelled / malformed events
        if (evt && evt.status != "cancelled"){
            if (new Date(evt.start.dateTime).getTime() >= new Date().getTime() - 43200) upcomingEvents.push(evt);
        }
        else {
            console.log('oh noes cancelled or bad event!', evt);
        }
    });

    //Sort events by date
    upcomingEvents = _.sortBy(upcomingEvents, function(evt){ return evt.start.dateTime; });

    console.log('new events', upcomingEvents);

    // if any upcoming events
    if (upcomingEvents.length){
        // For each upcoming event
        _.each(upcomingEvents.slice(0,6), function(evt, i, list){
            // Parse type of event, remove from description, set proper color
            var eventColor;
            var isTMHT = evt.description.indexOf(TMHT) > -1;
            var isChallengeNight = evt.description.indexOf(TMHTC) > -1;
            var isHelpSession = evt.description.indexOf(HS) > -1;
            var isSpecialEvent = evt.description.indexOf(SE) > -1;

            if (isTMHT)
            {
                evt.description = evt.description.replace(TMHT, '');
                eventColor = "red";
            }
            else if (isChallengeNight)
            {
                evt.description = evt.description.replace(TMHTC, '');
                eventColor = "green";
            }
            else if (isHelpSession)
            {
                evt.description = evt.description.replace(HS, '');
                eventColor = "blue";
            }
            else if (isSpecialEvent)
            {
                evt.description = evt.description.replace(SE, '');
                eventColor = "orange";
            }
            else eventColor = "teal";

            // Insert event into document
            var lastCircle = (i == list.length - 1) ? ' last-circle' : ''; //This can be done better by fixing the CSS, I couldn't get it
            $('.event-list').append(
                '<div class="section__circle-container'+ lastCircle +' mdl-cell mdl-cell--1-col mdl-cell--1-col-phone">'+
                '    <div class="section__circle-container__circle mdl-color--'+eventColor+'"></div>'+
                '</div>'+
                '<div class="section__text mdl-cell mdl-cell--11-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone event-description">'+
                '    <h5>'+evt.summary+'</h5>'+
                '    <h5>'+moment(evt.start.dateTime).format('LLLL')+' to '+moment(evt.end.dateTime).format('h:mm A')+' - '+evt.location+'</h5>'+
                     evt.description+
                '</div>'
            ); //$('.event-list').append
        }); //_.each(upcomingEvents)
        $('.event-description').linkify({ target: "_blank" });
    } // if upcomingEvents.length
    else
    {
        $('.event-list').append(
            '<div class="section__circle-container last-circle mdl-cell mdl-cell--1-col mdl-cell--1-col-phone">'+
            '    <div class="section__circle-container__circle mdl-color--yellow"></div>'+
            '</div>'+
            '<div class="section__text mdl-cell mdl-cell--11-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone">'+
            '    <h5>No upcoming events found</h5>'+
            '    If you have an idea for one please <a href="mailto:smu.csm@gmail.com">request it!</a>'+
            '</div>'
        ); //$('.event-list').append
    } // else if upcoming events

}).fail(function(data)
{
	console.log('fail', data);
    $('.event-list').append(
        '<div class="section__circle-container last-circle mdl-cell mdl-cell--1-col mdl-cell--1-col-phone">'+
        '    <div class="section__circle-container__circle mdl-color--yellow"></div>'+
        '</div>'+
        '<div class="section__text mdl-cell mdl-cell--11-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone">'+
        '    <h5>No events found</h5>'+
        '    Please take a moment to <a href="https://www.github.com/smucsm/smucsm.github.io/issues">file an issue</a>'+
        '</div>'
    ); //$('.event-list').append
}); //$.get()

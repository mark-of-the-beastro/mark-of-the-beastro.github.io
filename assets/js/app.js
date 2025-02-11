const renderCalendar = ({ events }) => {
  const calendarElement = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarElement, {
    initialView: "listMonth",
    headerToolbar: {
      left: "today",
      center: "title",
      right: "prev,next",
    },
    footerToolbar: {
      center: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    slotMinTime: "10:00",
    nowIndicator: true,
    eventDisplay: "block",
    height: "auto",
    eventClick: (info) => {
      const dialog = document.getElementById(info.event.id);
      dialog.showModal();
      dialog
        .querySelector("button")
        .addEventListener("click", () => dialog.close());
    },
    events,
  });
  calendar.render();
  return calendar;
};

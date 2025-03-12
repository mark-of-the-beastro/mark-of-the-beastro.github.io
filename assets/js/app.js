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

const renderHours = (days) => {
  const element = document.getElementById("todays-hours");
  const dayOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][new Date().getDay()];
  const hours = days[dayOfWeek];
  const dayElement = document.createElement("small");
  dayElement.innerHTML = dayOfWeek;
  element.appendChild(dayElement);
  const hoursElement = document.createElement("small");
  hoursElement.innerHTML = `${hours.start}&ndash;${hours.end}`;
  element.appendChild(hoursElement);
};

let currentDate = new Date();

const renderCalendar = ({ events }) => {
  const calendarElement = document.getElementById("calendar");
  if (calendarElement === null) {
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarElement, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "today",
      center: "title",
      right: "prev,next",
    },
    footerToolbar: {
      center: "dayGridMonth,timeGridDay",
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

const getDate = (dateTime) => {
  const eventDate = new Date(dateTime);
  return new Date(eventDate.toDateString());
};

const offsetDate = (date, days) => {
  const copy = new Date(date.valueOf());
  copy.setDate(date.getDate() + days);
  return getDate(copy);
};

const formatTime = (time) =>
  time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const formatDate = (date) =>
  date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getTime = (event) => {
  const startTime = new Date(event.start);
  if (event.end) {
    const endTime = new Date(event.end);
    return formatTime(startTime) + " &ndash; " + formatTime(endTime);
  }
  return formatTime(startTime);
};

const filterEvents = (events, start, end) =>
  events.filter((event) => {
    const eventDate = getDate(event.start);
    return getDate(start) <= eventDate && eventDate <= getDate(end);
  });

const getDayEvents = (events, date) => filterEvents(events, date, date);

const sortEvents = (events) =>
  events.sort((a, b) => new Date(b.start) - new Date(a.start));

const createEventDialog = (event) => {
  const dialog = document.createElement("dialog");
  dialog.id = `dialog-${event.id}`;
  dialog.className = "event";

  const dialogButton = document.createElement("button");
  dialogButton.autofocus = true;
  dialogButton.innerHTML = "X";
  dialog.appendChild(dialogButton);

  const dialogTitle = document.createElement("h3");
  dialogTitle.innerHTML = event.title;
  dialog.appendChild(dialogTitle);

  if (event.description) {
    const dialogDesc = document.createElement("p");
    dialogDesc.innerHTML = event.description;
    dialog.appendChild(dialogDesc);
  }

  dialogButton.addEventListener("click", () => {
    dialog.close();
  });

  return dialog;
};

const createEventElement = (event) => {
  const eventElement = document.createElement("button");
  eventElement.className = "event-list-item";

  const timeSpan = document.createElement("span");
  timeSpan.className = "event-time";
  timeSpan.innerHTML = getTime(event).toLowerCase();
  eventElement.appendChild(timeSpan);

  const titleSpan = document.createElement("span");
  titleSpan.innerHTML = event.title;
  eventElement.appendChild(titleSpan);

  let dialog = document.getElementById(`dialog-${event.id}`);
  if (dialog === null) {
    dialog = createEventDialog(event);
    document.getElementById("content").appendChild(dialog);
  }

  eventElement.addEventListener("click", () => dialog.showModal());

  return eventElement;
};

const emptyEventElement = () => {
  const eventElement = document.createElement("section");
  eventElement.className = "empty-event-list-item";

  const titleSpan = document.createElement("span");
  titleSpan.innerHTML = "No Events";
  eventElement.appendChild(titleSpan);

  return eventElement;
};

const createDateElement = (events, date) => {
  const dateContainer = document.createElement("div");
  dateContainer.className = "event-list-date-container";

  const dateElement = document.createElement("section");
  dateElement.id = `date-${date.valueOf()}`;
  dateElement.className = "event-list-date";

  const dateSpan = document.createElement("span");
  dateSpan.className = "date-date";
  dateSpan.innerHTML = formatDate(date);

  const daySpan = document.createElement("span");
  daySpan.className = "date-day";
  daySpan.innerHTML = date.toLocaleDateString("en-US", { weekday: "long" });

  dateElement.appendChild(dateSpan);
  dateElement.appendChild(daySpan);
  dateContainer.appendChild(dateElement);

  const dayEvents = getDayEvents(events, date);
  if (dayEvents.length > 0) {
    dayEvents.forEach((event) => {
      dateContainer.appendChild(createEventElement(event));
    });
  } else {
    dateContainer.appendChild(emptyEventElement());
  }

  return dateContainer;
};

const renderEventList = ({ events, start, end }) => {
  const eventListElement = document.getElementById("event-list");

  if (eventListElement === null) {
    return;
  }

  if (!start) {
    start = getDate(currentDate);
  } else {
    currentDate = getDate(start);
  }
  if (!end) {
    end = offsetDate(start, 7);
  }

  const dateRangeElement = document.getElementById("date-range");
  dateRangeElement.innerHTML = `${formatDate(start)} &ndash; ${formatDate(end)}`;

  const filteredEvents = sortEvents(filterEvents(events, start, end));
  const dates = [0, 1, 2, 3, 4, 5, 6].map((offset) =>
    offsetDate(start, offset),
  );
  const dateElements = dates.map((date) =>
    createDateElement(filteredEvents, date),
  );

  eventListElement.replaceChildren(...dateElements);
};

const moveEventListForward = ({ events }) => {
  renderEventList({ events, start: offsetDate(currentDate, 7) });
};

const moveEventListBackward = ({ events }) => {
  renderEventList({ events, start: offsetDate(currentDate, -7) });
};

const resetEventList = ({ events }) => {
  renderEventList({ events, start: new Date() });
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

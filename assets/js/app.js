// -----------------
//  date helpers
// -----------------

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
  time
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase();

const strRange = (...items) => items.join(" &ndash; ");

const timeRange = (start, end) => strRange(...[start, end].map(formatTime));

const dateRange = (start, end) => strRange(...[start, end].map(formatDate));

const formatDate = (date, { includeYear } = { includeYear: false }) => {
  const options = {
    month: "long",
    day: "numeric",
  };
  if (includeYear) {
    options.year = "numeric";
  }
  return date.toLocaleString("en-US", options);
};

const getDayOfWeek = () =>
  new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();

// -----------------
// dom helpers
// -----------------

const createElement = (tag, { id, className, role, innerHTML, children }) => {
  const element = document.createElement(tag);
  if (id) {
    element.id = id;
  }
  if (className) {
    element.className = className;
  }
  if (role) {
    element.role = role;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  if (children) {
    children.forEach((child) => child && element.appendChild(child));
  }
  return element;
};

const createOrUpdateElement = (tag, id, options, { update }) => {
  let element = document.getElementById(id);
  if (element && !update) {
    return element;
  }
  if (element && update) {
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    if (options.children) {
      element.replaceChildren(options.children.filter((c) => c));
    }
    return element;
  }
  return createElement(tag, { id, ...options });
};

const upsertElement = (tag, id, options) =>
  createOrUpdateElement(tag, id, options, { update: false });

const updateElement = (tag, id, options) =>
  createOrUpdateElement(tag, id, options, { update: true });

// -----------------
// events
// -----------------

let currentDate = new Date();

const getTime = (event) => {
  const startTime = new Date(event.start);
  if (event.end) {
    const endTime = new Date(event.end);
    return timeRange(startTime, endTime);
  }
  return formatTime(startTime);
};

const filterEvents = (events, start, end) =>
  events.filter((event) => {
    const eventDate = getDate(event.start);
    return getDate(start) <= eventDate && eventDate <= getDate(end);
  });

const sortEvents = (events) =>
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

const dialogId = (event) => `dialog-${event.id}`;

const upsertEventListDateRange = (start, end) =>
  updateElement("h2", "event-list-date-range", {
    innerHTML: dateRange(start, end),
  });

const todayButton = () =>
  upsertElement("button", "event-list-today", {
    innerHTML: "today",
  });

const eventListNavigation = () =>
  upsertElement("section", "event-list-navigation", {
    children: [
      upsertElement("button", "event-list-backward", {
        children: [
          createElement("span", {
            className: "fc-icon fc-icon-chevron-left",
            role: "img",
          }),
        ],
      }),
      upsertElement("button", "event-list-forward", {
        children: [
          createElement("span", {
            className: "fc-icon fc-icon-chevron-right",
            role: "img",
          }),
        ],
      }),
    ],
  });

const eventListHeader = (start, end) =>
  upsertElement("section", "event-list-header", {
    children: [
      todayButton(),
      upsertEventListDateRange(start, end),
      eventListNavigation(),
    ],
  });

const eventDialog = (event) => {
  let dialog = document.getElementById(dialogId(event));
  if (dialog) {
    return dialog;
  }

  dialog = upsertElement("dialog", dialogId(event), {
    className: "event",
    children: [
      createElement("button", {
        autofocus: true,
        innerHTML: "X",
      }),
      createElement("h2", { innerHTML: event.title }),
      createElement("p", {
        className: "dialog-event-time",
        innerHTML: getTime(event),
      }),
      event.description
        ? createElement("p", {
            className: "dialog-event-desc",
            innerHTML: event.description,
          })
        : null,
    ],
  });

  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
  });

  document.getElementById("content").appendChild(dialog);

  return dialog;
};

const eventElement = (event) => {
  const eventElement = createElement("button", {
    className: "event-list-item",
    children: [
      createElement("span", {
        className: "event-time",
        innerHTML: getTime(event),
      }),
      createElement("span", { innerHTML: event.title }),
    ],
  });

  const dialog = eventDialog(event);
  eventElement.addEventListener("click", () => dialog.showModal());

  return eventElement;
};

const dayEvents = (events, date) => {
  const dayEvents = sortEvents(filterEvents(events, date, date));
  if (dayEvents.length > 0) {
    return dayEvents.map((event) => eventElement(event));
  } else {
    return [
      createElement("section", {
        className: "empty-event-list-item",
        children: [createElement("span", { innerHTML: "No Events" })],
      }),
    ];
  }
};

const dateElement = (events, date) =>
  createElement("div", {
    className: "event-list-date-container",
    children: [
      createElement("section", {
        id: `date-${date.valueOf()}`,
        className: "event-list-date",
        children: [
          createElement("span", {
            className: "date-date",
            innerHTML: formatDate(date, { includeYear: true }),
          }),
          createElement("span", {
            className: "date-day",
            innerHTML: date.toLocaleDateString("en-US", { weekday: "long" }),
          }),
        ],
      }),
      ...dayEvents(events, date),
    ],
  });

// -----------------
// event listeners
// -----------------

const addEventListNavigationListeners = ({ events }) => {
  if (document.getElementById("event-list")) {
    document
      .getElementById("event-list-backward")
      .addEventListener("click", () => moveEventListBackward(events));

    document
      .getElementById("event-list-forward")
      .addEventListener("click", () => moveEventListForward(events));

    document
      .getElementById("event-list-today")
      .addEventListener("click", () => resetEventList(events));
  }
};

const moveEventListForward = (events) => {
  renderEventList({ events, start: offsetDate(currentDate, 7) });
};

const moveEventListBackward = (events) => {
  renderEventList({ events, start: offsetDate(currentDate, -7) });
};

const resetEventList = (events) => {
  renderEventList({ events, start: new Date() });
};

// -----------------
// components
// -----------------

const renderHours = (days) => {
  const footer = document.querySelector("footer");
  const dayOfWeek = getDayOfWeek();
  const { start, end } = days[dayOfWeek];
  footer.appendChild(
    createElement("section", {
      children: [
        createElement("strong", { innerHTML: dayOfWeek + " hours" }),
        createElement("span", { innerHTML: strRange(start, end) }),
      ],
    }),
  );
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
    end = offsetDate(start, 6);
  }

  let header = document.getElementById("event-list-header");
  if (header) {
    upsertEventListDateRange(start, end);
  } else {
    header = eventListHeader(start, end);
  }

  const filteredEvents = filterEvents(events, start, end);
  const dateElements = [0, 1, 2, 3, 4, 5, 6]
    .map((offset) => offsetDate(start, offset))
    .map((date) => dateElement(filteredEvents, date));

  eventListElement.replaceChildren(header, ...dateElements);
};

const renderCalendar = ({ events }) => {
  const calendarElement = document.getElementById("calendar");
  if (calendarElement === null) {
    return;
  }

  events.forEach((event) => eventDialog(event));

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
      const dialog = document.getElementById(`dialog-${info.event.id}`);
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

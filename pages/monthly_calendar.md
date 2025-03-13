---
layout: calendar
permalink: /calendar/monthly
---

<section id="calendar"></section>

{% for event in site.data.events %}
{% include event_dialog.html event=event index=forloop.index0 %}
{% endfor %}

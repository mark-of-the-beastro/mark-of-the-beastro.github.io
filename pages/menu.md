---
layout: menu
permalink: /menu
---

<section id="beelzegrub" class="menu-section">

  <h2>Beelzegrub</h2>

  <ul class="menu-list">

    {% for item in site.data.menu.beelzegrub %}
    {% include menu_item.html item=item %}
    {% endfor %}

  </ul>

</section>

<section id="temptations" class="menu-section">

  <h2>Temptations</h2>

  <ul class="menu-list">

    {% for item in site.data.menu.temptations %}
    {% include menu_item.html item=item %}
    {% endfor %}

  </ul>

</section>

<section id="weekend-brunch" class="menu-section">

  <h2>
    Weekend Brunch
    <small><em>(Sat/Sun til 4pm)</em></small>
  </h2>

  <ul class="menu-list">

    {% for item in site.data.menu.weekend_brunch %}
    {% include menu_item.html item=item %}
    {% endfor %}

  </ul>

</section>

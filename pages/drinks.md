---
layout: menu
permalink: /menu/drinks
---

<section id="beverages" class="menu-section">

  <h2>Coffee &Vert; Tea &Vert; Specialty Drinks</h2>

  <ul class="menu-list">

    {% for item in site.data.menu.drinks %}
      {% include drink_item.html item=item %}
    {% endfor %}

  </ul>

</section>

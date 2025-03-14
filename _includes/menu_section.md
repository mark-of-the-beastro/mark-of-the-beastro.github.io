<section id="{{ include.id }}" class="menu-section">
  <h2>{{ include.title }}</h2>

  <ul class="menu-list">

    {% for item in include.data %}
      {% include menu_item.html item=item %}
    {% endfor %}

  </ul>
</section>

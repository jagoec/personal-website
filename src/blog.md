---
title: Blog
layout: layout.njk
---

# Blog

{% if collections.posts | length > 0 %}

{% for post in collections.posts %}
<article>
  <h3><a href="{{ post.url }}">{{ post.data.title }}</a></h3>
  <p class="date">{{ post.data.date | readableDate }}{% if post.data.tags %} — {% for tag in post.data.tags %}<span class="tag">{{ tag }}</span>{% if not loop.last %} {% endif %}{% endfor %}{% endif %}</p>
  {{ post.data.excerpt | markdown | safe }}
  <p><a class="read-more" href="{{ post.url }}">Read more...</a></p>
</article>
{% endfor %}

{% else %}
No posts yet. Check back soon!
{% endif %}

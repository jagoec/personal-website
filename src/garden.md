---
title: Garden
layout: layout.njk
---

# Garden

Welcome to my garden journal. Here I document the weekly progress of my backyard garden.

{% if collections.garden | length > 0 %}
{% set latest = collections.garden | reverse | first %}

## Latest Post

### {{ latest.data.title }}
{{ latest.data.date | readableDate }}

{{ latest.data.excerpt | markdown | safe }}

[Read more...]({{ latest.url }})

## All Posts

{% for post in collections.garden | reverse %}
- [{{ post.data.title }}]({{ post.url }}) - {{ post.data.date | readableDate }}
{% endfor %}
{% else %}
No garden posts yet. Check back soon!
{% endif %}
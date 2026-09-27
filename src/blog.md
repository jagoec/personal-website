---
title: Blog
layout: layout.njk
---

# Blog

<link href="/pagefind/pagefind-component-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-component-ui.js" type="module"></script>

<div class="blog-search">
<pagefind-input placeholder="Search posts..."></pagefind-input>
<pagefind-filter-dropdown filter="tags" label="Tag"></pagefind-filter-dropdown>
<pagefind-summary></pagefind-summary>
<pagefind-results></pagefind-results>
</div>

{% if collections.posts | length > 0 %}

## All Posts

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

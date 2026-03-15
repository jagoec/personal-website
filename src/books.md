---
title: Books
layout: layout.njk
---

# Books I've Read
Currently on: _Democracy in America_ by Alexis de Tocqueville
{% set currentYear = "" %}

{% for book in books|reverse %}

{% set year = book.Finished.slice(0,4) %}

{% if year != currentYear %}
{% set currentYear = year %}

## {{ year }}

{% endif %}

<div class="book">
  <span class="title">{{ book.Title }}</span>
  <span class="author">{{ book.Author }}</span>
</div>


{% endfor %}

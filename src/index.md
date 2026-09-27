---
title: Home
layout: layout.njk
---

# Christopher Jagoe

It's been a goal of mine to create a personal website. My goals are to learn something about technology and to create a space for documenting and reflecting on some of my projects.  
\
You can find me on:
- [Strava](https://www.strava.com/athletes/61524373)
- [eBird](https://ebird.org/profile/MTgwNzM0MQ/world)
- [GitHub](https://github.com/jagoec)

{% if quotes | length > 0 %}
<figure class="quote-of-the-day" data-drag>
  <blockquote id="qotd-text">{{ quotes[0].text }}</blockquote>
  <figcaption id="qotd-author">{{ quotes[0].author }}</figcaption>
</figure>
<script>
  (function () {
    var quotes = {{ quotes | dump | safe }};
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var day = Math.floor((now - start) / 86400000);
    var q = quotes[day % quotes.length];
    document.getElementById("qotd-text").textContent = q.text;
    document.getElementById("qotd-author").textContent = q.author;
  })();
</script>
<script>
  (function () {
    var el = document.querySelector("[data-drag]");
    if (!el) return;
    var startX = 0, startY = 0, dragging = false;
    el.addEventListener("pointerdown", function (e) {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.classList.add("dragging");
    });
    el.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      el.style.transform = "translate(" + (e.clientX - startX) + "px," + (e.clientY - startY) + "px)";
    });
    function release(e) {
      if (!dragging) return;
      dragging = false;
      if (e && e.pointerId !== undefined && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      el.classList.remove("dragging");
      requestAnimationFrame(function () {
        el.style.transform = "";
      });
    }
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  })();
</script>
{% endif %}

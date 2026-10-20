---
title: "SAI Lab"
permalink: /
excerpt: "SAI Lab (Signal Augmented Intelligence) at Hanshin University."
---
{% assign lab = site.data.lab %}
<p class="lab-intro">{{ lab.name }} ({{ lab.full_name }}) is a research group at {{ lab.institution }}, led by {{ lab.advisor }}. Recent work at the lab covers Korean speech recognition, acoustic signal processing for robots, and language models for question answering.</p>

<section id="research">
  <h2>Research</h2>
  <hr>
  <ul>
  {% for theme in site.data.research %}<li><a href="{{ '/research/' | relative_url }}#{{ theme.slug }}">{{ theme.title }}</a></li>
  {% endfor %}</ul>
</section>

<section id="news">
  <h2>News</h2>
  <hr>
  {% include news-list.html limit=3 %}
  <p><a href="{{ '/news/' | relative_url }}">All news</a></p>
</section>

<section id="recent-publications">
  <h2>Recent Publications</h2>
  <hr>
  {% assign recent = site.publications | sort: 'pub_date' | reverse %}
  <ol class="publication-list">
  {% for pub in recent limit: 3 %}{% include publication-entry.html pub=pub %}{% endfor %}
  </ol>
  <p><a href="{{ '/publications/' | relative_url }}">All publications</a></p>
</section>
{% if lab.email != "" or lab.location != "" %}
<section id="contact">
  <h2>Contact</h2>
  <hr>
  <p>{% if lab.location != "" %}{{ lab.location }}{% endif %}{% if lab.email != "" and lab.location != "" %}<br>{% endif %}{% if lab.email != "" %}<a href="mailto:{{ lab.email }}">{{ lab.email }}</a>{% endif %}</p>
</section>
{% endif %}

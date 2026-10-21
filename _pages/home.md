---
title: "SAI Lab"
permalink: /
excerpt: "SAI Lab (Signal Augmented Intelligence) at Hanshin University."
---
{% assign lab = site.data.lab %}
<!-- 소개 문구: 교수님 확정 전 임시 문구 -->
<p class="lab-intro">{{ lab.name }} ({{ lab.full_name }}) is a research group at {{ lab.institution }}, led by {{ lab.advisor }}. The lab works on learning-based processing of speech and acoustic signals, from enhancement and denoising to speech recognition, for wearable and robotic devices.</p>

{% assign highlights = site.data.seminars | where: 'highlight', true | sort: 'date' | reverse %}
{% assign shown = 0 %}{% for s in highlights %}{% if s.file and s.file != "" %}{% assign shown = shown | plus: 1 %}{% endif %}{% endfor %}
{% if shown > 0 %}
<section id="highlights">
  <div class="section-head"><h2>Highlights</h2><a href="{{ '/seminars/' | relative_url }}">View all →</a></div>
  <hr>
  <ol class="seminar-list">
  {% assign count = 0 %}{% for s in highlights %}{% if s.file and s.file != "" and count < 5 %}{% assign count = count | plus: 1 %}{% capture term %}{% include seminar-term.html s=s %}{% endcapture %}{% include seminar-entry.html s=s term=term %}{% endif %}{% endfor %}
  </ol>
</section>
{% endif %}

<section id="research">
  <div class="section-head"><h2>Research Areas</h2><a href="{{ '/research/' | relative_url }}">View all →</a></div>
  <hr>
  <ul class="area-list area-list--compact">
  {% assign areas = site.research | sort: 'order' %}{% for area in areas %}
    <li><a href="{{ area.url | relative_url }}">{{ area.title }}</a></li>
  {% endfor %}</ul>
</section>

<section id="recent-publications">
  <div class="section-head"><h2>Recent Publications</h2><a href="{{ '/research/publications/' | relative_url }}">View all →</a></div>
  <hr>
  {% assign recent = site.publications | sort: 'pub_date' | reverse %}
  <ol class="publication-list">
  {% for pub in recent limit: 3 %}{% include publication-entry.html pub=pub %}{% endfor %}
  </ol>
</section>

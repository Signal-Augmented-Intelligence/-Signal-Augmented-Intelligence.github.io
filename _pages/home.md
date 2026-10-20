---
title: "SAI Lab"
permalink: /
excerpt: "SAI Lab (Signal Augmented Intelligence) at Hanshin University. Research on speech recognition, acoustic signal processing, and language-model applications."
---
SAI Lab (Signal Augmented Intelligence) is a research group at {{ site.lab.institution }}, led by {{ site.lab.advisor }}. Recent work at the lab covers Korean speech recognition, acoustic signal processing for robots, and language models for question answering.

## Research

<ul>
{% for theme in site.data.research %}<li><a href="{{ '/research/' | relative_url }}#{{ theme.slug }}">{{ theme.title }}</a></li>
{% endfor %}</ul>

## News

{% include news-list.html limit=3 %}

[All news]({{ '/news/' | relative_url }})

## Recent publications

{% assign recent = site.publications | sort: 'sort_order' | reverse %}
<ol class="publication-list">
{% for pub in recent limit: 3 %}{% include publication-entry.html pub=pub %}{% endfor %}
</ol>

[All publications]({{ '/publications/' | relative_url }})

---
layout: default
permalink: /blog/
title: blog
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 10
  sort_field: date
  sort_reverse: true
---

<div class="post">

{% if site.display_tags.size > 0 or site.display_categories.size > 0 %}
  <div class="tag-category-list" style="margin-bottom: 0.25rem; font-size: 0.8rem;">
    <ul class="p-0 m-0" style="display: flex; flex-wrap: wrap; list-style: none; gap: 8px;">
      {% for tag in site.display_tags %}
        <li><a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">#{{ tag }}</a></li>
      {% endfor %}
    </ul>
  </div>
{% endif %}

{% assign featured_posts = site.posts | where: "featured", "true" %}
{% if featured_posts.size > 0 %}
<div class="featured-posts mb-2">
  <div class="row row-cols-2 g-1"> {% for post in featured_posts %}
    <div class="col">
      <a href="{{ post.url | relative_url }}" class="text-decoration-none">
        <div class="card hoverable" style="border: 1px solid #eee;">
          <div class="card-body p-1 px-2">
            <h6 class="card-title m-0" style="font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <i class="fa-solid fa-thumbtack fa-xs"></i> {{ post.title }}
            </h6>
          </div>
        </div>
      </a>
    </div>
  {% endfor %}
  </div>
</div>
<hr class="my-1">
{% endif %}

  <ul class="post-list" style="padding-left: 0; list-style: none;">
    {% assign postlist = paginator.posts | default: site.posts %}
    {% assign grouped_posts = postlist | group_by: "series" %}

    {% for group in grouped_posts %}
      {% if group.name and group.name != "" %}
        <li class="series-group mt-1">
          <small class="text-uppercase" style="font-weight: bold; color: #888;">{{ group.name }}</small>
          <ul class="post-list m-0 p-0" style="list-style: none; border-left: 1px solid #eee; padding-left: 10px !important;">
      {% endif %}

      {% for post in group.items %}
        <li class="py-1" style="border-bottom: 1px solid #fafafa;">
          <div class="d-flex justify-content-between align-items-center">
            <div style="flex: 1; min-width: 0;">
              <a class="post-title" href="{{ post.url | relative_url }}" style="font-size: 0.95rem; font-weight: 500;">{{ post.title }}</a>
              <span class="d-none d-md-inline" style="font-size: 0.75rem; color: #aaa; margin-left: 8px;">
                {% for tag in post.tags limit:2 %}#{{ tag }} {% endfor %}
              </span>
            </div>
            <span class="post-meta" style="font-size: 0.8rem; color: #828282; font-family: monospace;">
              {{ post.date | date: '%y.%m.%d' }}
            </span>
          </div>
        </li>
      {% endfor %}

      {% if group.name and group.name != "" %}
          </ul>
        </li>
      {% endif %}
    {% endfor %}
  </ul>

{% if page.pagination.enabled %}
  <div class="py-1">
    {% include pagination.liquid %}
  </div>
{% endif %}

</div>
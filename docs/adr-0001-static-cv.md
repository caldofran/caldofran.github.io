# ADR 0001: Static YAML-driven CV

## Status

Accepted.

## Context

The CV must be public, cheap to host, easy to edit, and available as both HTML
and PDF. GitHub Pages is already available through `caldofran.github.io`.

## Decision

Use Astro static output with strict TypeScript. Store the editable CV in
`src/content/cv.en.yaml`, validate it with Zod, infer `CvData` from that schema,
and render both HTML and PDF from the same parsed object.

The site uses no client JavaScript, no backend, no analytics, no cookies, no CMS,
and no external fonts.

## Consequences

Valid YAML changes update the web page and PDF together. Invalid YAML blocks CI
with field-level errors such as `experience[2].url: invalid URL`.

Adding Spanish later should be a content and label-routing change, not a
framework migration.

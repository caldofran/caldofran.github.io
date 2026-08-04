# Ruben Mendez CV

Static CV site for `https://caldofran.github.io`.

The public CV is generated from `src/content/cv.en.yaml`. The same data feeds the
HTML page and the downloadable PDF.

## Local development

Use Node 24 LTS.

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run validate:content
npm run format:check
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run ci
```

## Editing the CV

Open `src/content/cv.en.yaml`, create a branch, edit the YAML, and open a pull
request. Valid changes regenerate the website and the PDF from the same source.

See `docs/editing-and-rollback.md` for the full GitHub web editing flow.

## Launch status

The production switch from legacy `master` Pages to GitHub Actions must wait
until the final CV content has been imported and approved.

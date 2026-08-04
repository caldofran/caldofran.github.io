# Editing and rollback

## Edit from GitHub

1. Open `src/content/cv.en.yaml` in GitHub.
2. Press the edit button.
3. Choose "Create a new branch for this commit and start a pull request".
4. Add or update an item in the right section.
5. Open the pull request.
6. Wait for checks to finish.
7. Download the `dist` and PDF artifacts from the workflow run.
8. Review the web build and PDF.
9. Squash merge when the content is correct.
10. Confirm the deployment after merge.

## Add experience

```yaml
experience:
  - company: Company name
    role: Staff Software Engineer
    location: Madrid, Spain
    start: Jan 2024
    end: Present
    summary: Short description of scope and ownership.
    highlights:
      - Delivered a measurable result.
      - Improved reliability, cost, speed, or user outcome.
    url: https://example.com
```

## Hide an item

```yaml
visible: false
```

Hidden items remain in the YAML but are not rendered in the web page or PDF.

## Common errors

| Error                            | Meaning                             | Fix                                    |
| -------------------------------- | ----------------------------------- | -------------------------------------- |
| `profile.email: invalid email`   | The email is not valid.             | Use a complete email address.          |
| `experience[2].url: invalid URL` | The third experience has a bad URL. | Use `https://...` or remove the field. |
| `summary must not contain HTML`  | The YAML contains `<` or `>`.       | Use plain text only.                   |
| `pdfFilename must end with .pdf` | The PDF filename is invalid.        | Rename it to `something.pdf`.          |

## Rollback

Find the squash commit that introduced the bad content and revert it:

```sh
git revert <commit-sha>
git push
```

The deployment workflow will rebuild the previous valid CV automatically.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseCvData } from '../src/lib/cv';

describe('cv content schema', () => {
  it('parses valid YAML and strips hidden entries', () => {
    const cv = parseCvData(readFileSync('tests/fixtures/valid-cv.yaml', 'utf8'));
    expect(cv.profile.email).toBe('example@example.com');
    expect(cv.experience).toHaveLength(1);
    expect(cv.skills[0].items).toContain('TypeScript');
  });

  it('reports actionable field paths for invalid YAML', () => {
    expect(() => parseCvData(readFileSync('tests/fixtures/invalid-cv.yaml', 'utf8'))).toThrow(
      /profile.email: invalid email/,
    );
    expect(() => parseCvData(readFileSync('tests/fixtures/invalid-cv.yaml', 'utf8'))).toThrow(
      /experience\[0\].url: invalid URL/,
    );
  });

  it('defaults visible to true and removes visible false entries', () => {
    const cv = parseCvData(`
meta:
  locale: en
  updatedAt: "2026-08-04"
  pdfFilename: test.pdf
profile:
  name: Example Person
  headline: Engineer
  location: Madrid
  email: example@example.com
  summary: Summary text.
  links:
    - label: Hidden
      url: https://example.com
      visible: false
experience:
  - company: Hidden Co
    role: Engineer
    start: "2020"
    end: "2021"
    visible: false
projects: []
education: []
skills: []
languages: []
publications: []
certifications: []
`);

    expect(cv.profile.links).toHaveLength(0);
    expect(cv.experience).toHaveLength(0);
  });
});

import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { cvSchema, formatZodError, type CvData } from './cvSchema';

export async function loadCvData(pathname = 'src/content/cv.en.yaml'): Promise<CvData> {
  const source = await readFile(pathname, 'utf8');
  return parseCvData(source);
}

export function parseCvData(source: string): CvData {
  const parsed = parse(source);
  const result = cvSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return stripHidden(result.data);
}

function stripHidden(data: CvData): CvData {
  return {
    ...data,
    profile: {
      ...data.profile,
      links: data.profile.links.filter((item) => item.visible),
    },
    experience: data.experience.filter((item) => item.visible),
    projects: data.projects.filter((item) => item.visible),
    education: data.education.filter((item) => item.visible),
    skills: data.skills.filter((item) => item.visible),
    languages: data.languages.filter((item) => item.visible),
    publications: data.publications.filter((item) => item.visible),
    certifications: data.certifications.filter((item) => item.visible),
  };
}

import { z } from 'zod';

const plainText = (label: string) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => !/[<>]/.test(value), `${label} must not contain HTML`);

const optionalPlainText = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => !/[<>]/.test(value), `${label} must not contain HTML`)
    .optional();

const url = z.string().trim().url('invalid URL');

const visibleSchema = z.boolean().default(true);

const linkSchema = z.object({
  label: plainText('label'),
  url,
  visible: visibleSchema,
});

const datedItemSchema = z.object({
  start: plainText('start'),
  end: plainText('end'),
});

const highlightItemSchema = z
  .string()
  .trim()
  .min(1, 'highlight is required')
  .refine((value) => !/[<>]/.test(value), 'highlight must not contain HTML');

const experienceSchema = z
  .object({
    company: plainText('company'),
    role: plainText('role'),
    location: optionalPlainText('location'),
    summary: optionalPlainText('summary'),
    highlights: z.array(highlightItemSchema).default([]),
    url: url.optional(),
    visible: visibleSchema,
  })
  .merge(datedItemSchema);

const projectSchema = z.object({
  name: plainText('name'),
  role: optionalPlainText('role'),
  summary: optionalPlainText('summary'),
  highlights: z.array(highlightItemSchema).default([]),
  url: url.optional(),
  visible: visibleSchema,
});

const educationSchema = z
  .object({
    institution: plainText('institution'),
    degree: plainText('degree'),
    location: optionalPlainText('location'),
    summary: optionalPlainText('summary'),
    visible: visibleSchema,
  })
  .merge(datedItemSchema);

const skillGroupSchema = z.object({
  label: plainText('label'),
  items: z.array(plainText('skill')).min(1, 'items must contain at least one skill'),
  visible: visibleSchema,
});

const languageSchema = z.object({
  language: plainText('language'),
  fluency: optionalPlainText('fluency'),
  visible: visibleSchema,
});

const publicationSchema = z.object({
  title: plainText('title'),
  publisher: optionalPlainText('publisher'),
  date: optionalPlainText('date'),
  url: url.optional(),
  visible: visibleSchema,
});

const certificationSchema = z.object({
  title: plainText('title'),
  issuer: optionalPlainText('issuer'),
  date: optionalPlainText('date'),
  url: url.optional(),
  visible: visibleSchema,
});

export const cvSchema = z.object({
  meta: z.object({
    locale: z.literal('en'),
    updatedAt: plainText('updatedAt'),
    pdfFilename: plainText('pdfFilename').refine((value) => value.endsWith('.pdf'), {
      message: 'pdfFilename must end with .pdf',
    }),
    status: z.enum(['draft', 'approved']).default('draft'),
  }),
  profile: z.object({
    name: plainText('name'),
    headline: plainText('headline'),
    location: plainText('location'),
    email: z.string().trim().email('invalid email'),
    summary: plainText('summary'),
    links: z.array(linkSchema).default([]),
  }),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  languages: z.array(languageSchema).default([]),
  publications: z.array(publicationSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
});

export type CvData = z.infer<typeof cvSchema>;

export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path
        .map((part) => (typeof part === 'number' ? `[${part}]` : part))
        .join('.')
        .replace(/\.\[/g, '[');
      return `${path || 'root'}: ${issue.message}`;
    })
    .join('\n');
}

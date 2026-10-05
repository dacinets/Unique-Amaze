import { z } from 'zod';

/**
 * Zod schema for ContactView consultation inquiry form
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Your full name is required' })
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required to dispatch brief' })
    .email({ message: 'Please enter a valid work or personal email (e.g. name@company.com)' }),
  business: z
    .string()
    .trim()
    .min(1, { message: 'Business or project name is required' })
    .min(2, { message: 'Business name must be at least 2 characters' }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[\d\s()+-]{7,25}$/.test(val), {
      message: 'Please enter a valid phone number (e.g. +1 403-555-0192)',
    }),
  market: z
    .enum(['Canada', 'Malawi', 'International'], {
      message: 'Please select a valid region',
    })
    .default('Canada'),
  timeline: z
    .string()
    .min(1, { message: 'Please select a target timeline' })
    .default('2–4 weeks'),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Project description is required' })
    .min(10, { message: 'Please provide a brief description (minimum 10 characters)' }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Zod schema for PlannerView client brief handoff form
 */
export const plannerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Name must be at least 2 characters' }),
  business: z
    .string()
    .trim()
    .min(1, { message: 'Business or project name is required' })
    .min(2, { message: 'Business name must be at least 2 characters' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required to prepare brief' })
    .email({ message: 'Please provide a valid email address (e.g. name@company.com)' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Phone or WhatsApp number is required' })
    .refine((val) => /^[\d\s()+-]{7,25}$/.test(val), {
      message: 'Please enter a valid phone or WhatsApp number (minimum 7 digits)',
    }),
  website: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Accept with or without protocol
        const toTest = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
        try {
          new URL(toTest);
          return val.includes('.');
        } catch {
          return false;
        }
      },
      { message: 'Please enter a valid website URL (e.g. https://yourcompany.com)' }
    ),
  preferredContact: z
    .enum(['Email', 'Phone Call', 'WhatsApp', 'Google Meet'])
    .default('Email'),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Please confirm consent so we can reply to your inquiry',
    }),
});

export type PlannerFormData = z.infer<typeof plannerFormSchema>;

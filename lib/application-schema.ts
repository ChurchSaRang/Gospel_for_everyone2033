import { Country, State } from 'country-state-city';
import { z } from 'zod';

const applicationFields = z.object({
    firstName: z.string().trim().min(1, 'First name is required.'),
    middleName: z.string().trim(),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    preferredName: z.string().trim(),
    dob: z.string().min(1, 'Date of birth is required.'),
    gender: z.enum(['MALE', 'FEMALE']),
    nationalityCode: z.string().length(2).refine((value) => Boolean(Country.getCountryByCode(value)), 'Select a valid nationality.'),
    residenceCountryCode: z.string().length(2).refine((value) => Boolean(Country.getCountryByCode(value)), 'Select a valid country of residence.'),
    residenceCity: z.string().trim().min(1, 'Current city is required.'),
    residenceRegionCode: z.string(),
    phone: z.string().trim().min(7, 'WhatsApp phone number is required.'),
    email: z.string().trim().email('Please provide a valid email address.'),
    passportStatus: z.enum(['YES', 'PROCESSING', 'APPLY_IF_SELECTED']),
    passportNumber: z.string().trim(),
    passportExpiry: z.string(),
    visaDenied: z.enum(['NO', 'YES']),
    visaDenialExplanation: z.string().trim(),
    churchName: z.string().trim().min(2, 'Church or ministry name is required.'),
    churchCity: z.string().trim().min(1, 'Church city is required.'),
    churchCountryCode: z.string().length(2).refine((value) => Boolean(Country.getCountryByCode(value)), 'Select a valid church country.'),
    pastorName: z.string().trim().min(2, 'Pastor or ministry leader name is required.'),
    pastorRole: z.string().trim(),
    pastorPhone: z.string().trim().min(7, 'Pastor phone number is required.'),
    pastorEmail: z.string().trim().email('Please provide a valid pastor email.'),
    faithJourney: z.string().trim().min(1, 'Please describe your faith journey and church involvement.'),
    tiktok: z.string().trim(),
    instagram: z.string().trim(),
    youtube: z.string().trim(),
    xAccount: z.string().trim(),
    facebook: z.string().trim(),
    discord: z.string().trim(),
    frequentlyUsedPlatforms: z.array(z.enum(['TIKTOK', 'INSTAGRAM_REELS', 'YOUTUBE', 'X', 'DISCORD', 'TWITCH', 'FACEBOOK', 'WHATSAPP', 'TELEGRAM', 'OTHER'])).max(3, 'Select no more than three platforms.'),
    digitalTools: z.array(z.enum(['VIDEO_EDITING', 'DESIGN', 'ADOBE', 'LIVE_STREAMING', 'WRITING_AI', 'AUDIO_EDITING', 'NONE'])).min(1, 'Select at least one option.'),
    portfolioLink: z.string().trim(),
    motivation: z.string().trim().min(20, 'Please explain why you want to join the programme.'),
    postTrainingVision: z.string().trim().min(1, 'Please describe how you will use digital tools to share the Gospel.'),
    commit30Days: z.enum(['YES', 'NO']),
    preferredBatch: z.enum(['BATCH_A', 'BATCH_B', 'BATCH_C']),
    trainOthers: z.enum(['YES', 'UNSURE']),
    declarationAccurate: z.boolean().refine((value) => value, 'Please confirm your declaration.'),
    typedSignature: z.string().trim().min(2, 'Type your full name as your signature.'),
    declarationDate: z.string().min(1, 'Declaration date is required.'),
    termsAccepted: z.boolean().refine((value) => value, 'You must accept the terms and conditions.'),
});

function countWords(value: string) {
    return value.trim().split(/\s+/).filter(Boolean).length;
}

export const applicationSchema = applicationFields.superRefine((value, context) => {
    const regionList = State.getStatesOfCountry(value.residenceCountryCode);
    if (regionList.length > 0 && !regionList.some((region) => region.isoCode === value.residenceRegionCode)) {
        context.addIssue({ code: 'custom', path: ['residenceRegionCode'], message: 'Select a valid state or province for your country.' });
    }

    if (value.faithJourney && (countWords(value.faithJourney) < 20 || countWords(value.faithJourney) > 200)) {
        context.addIssue({ code: 'custom', path: ['faithJourney'], message: 'Please use 20-200 words.' });
    }

    if (value.motivation && (countWords(value.motivation) < 20 || countWords(value.motivation) > 200)) {
        context.addIssue({ code: 'custom', path: ['motivation'], message: 'Please use 20-200 words.' });
    }

    if (value.postTrainingVision && (countWords(value.postTrainingVision) < 20 || countWords(value.postTrainingVision) > 200)) {
        context.addIssue({ code: 'custom', path: ['postTrainingVision'], message: 'Please use 20-200 words.' });
    }

    if (value.visaDenied === 'YES' && (countWords(value.visaDenialExplanation) < 20 || countWords(value.visaDenialExplanation) > 200)) {
        context.addIssue({ code: 'custom', path: ['visaDenialExplanation'], message: 'Please use 20-200 words.' });
    }
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function calculateAge(dob: string) {
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }

    return age;
}

export function isEligibleAge(dob: string) {
    const age = calculateAge(dob);
    return typeof age === 'number' && age >= 20 && age <= 55;
}

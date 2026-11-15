export const publicDocuments = [
    {
        slug: 'application-form',
        title: 'Korea Training Application Form',
        titleKo: '한국 연수 프로그램 지원서',
        description: 'Bilingual English and Korean application form for the 30-day digital evangelism training programme.',
        fileName: 'Application Form.docx',
        category: 'Application',
    },
    {
        slug: 'training-terms',
        title: 'Training Terms and Conditions',
        titleKo: '연수 이용약관',
        description: 'Full English and Korean terms for the programme, including eligibility, fees, refunds, travel and participant responsibilities.',
        fileName: 'Training Terms and Condition.docx',
        category: 'Programme policy',
    },
    {
        slug: 'training-manual',
        title: 'Training Manual',
        titleKo: '연수 매뉴얼',
        description: 'Reference manual for the Korea digital evangelism training programme.',
        fileName: 'Training Manual.docx',
        category: 'Training',
    },
] as const;

export function getPublicDocument(slug: string) {
    return publicDocuments.find((document) => document.slug === slug);
}
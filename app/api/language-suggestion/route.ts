import { NextResponse } from 'next/server';
import translationLanguages from '@/lib/translation-languages.json';

export const dynamic = 'force-dynamic';

const languageByCode = new Map(
    translationLanguages.map((language) => [language.code.toLowerCase(), language]),
);

const countryLanguages: Record<string, readonly string[]> = {
    AD: ['ca'],
    AE: ['ar'],
    AF: ['fa-AF', 'fa'],
    AL: ['sq'],
    AM: ['hy'],
    AO: ['pt'],
    AR: ['es'],
    AT: ['de'],
    AU: ['en'],
    AZ: ['az'],
    BA: ['bs'],
    BD: ['bn'],
    BE: ['nl', 'fr', 'de'],
    BF: ['fr'],
    BG: ['bg'],
    BH: ['ar'],
    BI: ['fr', 'rw'],
    BJ: ['fr'],
    BN: ['ms'],
    BO: ['es'],
    BR: ['pt'],
    BS: ['en'],
    BT: ['dz'],
    BW: ['en'],
    BY: ['be', 'ru'],
    BZ: ['en'],
    CA: ['en', 'fr-CA'],
    CD: ['fr'],
    CF: ['fr'],
    CG: ['fr'],
    CH: ['de', 'fr', 'it'],
    CI: ['fr'],
    CL: ['es'],
    CM: ['fr', 'en'],
    CN: ['zh-CN'],
    CO: ['es'],
    CR: ['es'],
    CU: ['es'],
    CY: ['el'],
    CZ: ['cs'],
    DE: ['de'],
    DJ: ['fr', 'ar'],
    DK: ['da'],
    DO: ['es'],
    DZ: ['ar'],
    EC: ['es'],
    EE: ['et'],
    EG: ['ar'],
    ES: ['es', 'ca', 'eu', 'gl'],
    ET: ['am'],
    FI: ['fi'],
    FJ: ['en', 'fj'],
    FR: ['fr'],
    GA: ['fr'],
    GB: ['en'],
    GE: ['ka'],
    GH: ['en', 'ak'],
    GR: ['el'],
    GT: ['es'],
    HK: ['zh-TW'],
    HN: ['es'],
    HR: ['hr'],
    HU: ['hu'],
    ID: ['id'],
    IE: ['en', 'ga'],
    IL: ['iw'],
    IN: ['hi', 'bn', 'ta', 'te', 'gu', 'mr', 'kn', 'ml', 'pa', 'ur', 'en'],
    IQ: ['ar'],
    IR: ['fa'],
    IS: ['is'],
    IT: ['it'],
    JM: ['en', 'jam'],
    JP: ['ja'],
    JO: ['ar'],
    KE: ['sw', 'en'],
    KG: ['ky', 'ru'],
    KH: ['km'],
    KR: ['ko'],
    KW: ['ar'],
    KZ: ['kk', 'ru'],
    LA: ['lo'],
    LB: ['ar'],
    LK: ['si', 'ta'],
    LT: ['lt'],
    LU: ['lb', 'fr', 'de'],
    LV: ['lv'],
    LY: ['ar'],
    MA: ['ar'],
    MD: ['ro'],
    MG: ['mg', 'fr'],
    MK: ['mk'],
    ML: ['fr'],
    MM: ['my'],
    MN: ['mn'],
    MT: ['mt'],
    MU: ['mfe', 'fr'],
    MX: ['es'],
    MY: ['ms', 'en'],
    MZ: ['pt'],
    NA: ['en'],
    NE: ['fr'],
    NG: ['en', 'ha', 'ig', 'yo'],
    NL: ['nl'],
    NO: ['no'],
    NP: ['ne'],
    NZ: ['en', 'mi'],
    OM: ['ar'],
    PA: ['es'],
    PE: ['es'],
    PH: ['tl', 'en'],
    PK: ['ur', 'pa', 'sd'],
    PL: ['pl'],
    PR: ['es'],
    PT: ['pt-PT', 'pt'],
    QA: ['ar'],
    RO: ['ro'],
    RS: ['sr'],
    RU: ['ru'],
    RW: ['rw', 'fr'],
    SA: ['ar'],
    SE: ['sv'],
    SG: ['en', 'zh-CN', 'ms', 'ta'],
    SI: ['sl'],
    SK: ['sk'],
    SN: ['fr', 'wo'],
    SO: ['so'],
    TH: ['th'],
    TJ: ['tg'],
    TN: ['ar'],
    TR: ['tr'],
    TW: ['zh-TW'],
    TZ: ['sw'],
    UA: ['uk'],
    UG: ['en', 'sw'],
    US: ['en', 'es'],
    UY: ['es'],
    UZ: ['uz'],
    VE: ['es'],
    VN: ['vi'],
    YE: ['ar'],
    ZA: ['en', 'zu', 'xh', 'af'],
    ZM: ['en'],
    ZW: ['en', 'sn'],
};

const languageAliases: Record<string, string> = {
    'zh-hans': 'zh-cn',
    'zh-hant': 'zh-tw',
    'pt-br': 'pt',
    fil: 'tl',
    iw: 'he',
    jv: 'jw',
    nb: 'no',
};

function getSupportedLanguage(tag: string) {
    const normalized = tag.trim().replaceAll('_', '-').toLowerCase();
    const normalizedCode = languageAliases[normalized] ?? normalized;
    const exact = languageByCode.get(normalizedCode);
    if (exact) return exact;

    const baseCode = normalized.split('-')[0];
    return languageByCode.get(languageAliases[baseCode] ?? baseCode) ?? null;
}

function getBrowserLanguages(request: Request) {
    const header = request.headers.get('accept-language') ?? '';
    return header
        .split(',')
        .map((entry) => {
            const [tag, quality] = entry.trim().split(';q=');
            return { tag, quality: quality ? Number(quality) : 1 };
        })
        .filter(({ tag, quality }) => tag && tag !== '*' && Number.isFinite(quality))
        .sort((left, right) => right.quality - left.quality)
        .map(({ tag }) => getSupportedLanguage(tag))
        .filter((language): language is (typeof translationLanguages)[number] => language !== null);
}

function chooseCountryLanguage(country: string, browserLanguages: (typeof translationLanguages)[number][]) {
    const preferences = countryLanguages[country];
    if (!preferences) return browserLanguages[0] ?? null;

    const browserMatch = browserLanguages.find((language) =>
        preferences.some((code) => code.toLowerCase() === language.code.toLowerCase()),
    );
    if (browserMatch) return browserMatch;

    for (const code of preferences) {
        const language = getSupportedLanguage(code);
        if (language) return language;
    }

    return browserLanguages[0] ?? null;
}

export function GET(request: Request) {
    const country = request.headers.get('x-vercel-ip-country')?.trim().toUpperCase() ?? '';
    const suggestion = chooseCountryLanguage(country, getBrowserLanguages(request));
    const code = suggestion?.code === 'en' ? null : suggestion?.code ?? null;

    return NextResponse.json(
        { languageCode: code },
        { headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
    );
}

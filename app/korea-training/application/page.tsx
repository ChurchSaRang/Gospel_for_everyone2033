'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { applicationSchema, calculateAge } from '@/lib/application-schema';

type LocationOption = { code: string; name: string };

const initialState = {
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    dob: '',
    gender: '',
    nationalityCode: '',
    residenceCountryCode: '',
    residenceCity: '',
    residenceRegionCode: '',
    churchCountryCode: '',
    churchCity: '',
    email: '',
    phone: '',
    churchName: '',
    pastorName: '',
    pastorRole: '',
    pastorEmail: '',
    pastorPhone: '',
    faithJourney: '',
    passportStatus: 'YES',
    passportNumber: '',
    passportExpiry: '',
    visaDenied: 'NO',
    visaDenialExplanation: '',
    tiktok: '',
    instagram: '',
    youtube: '',
    xAccount: '',
    facebook: '',
    discord: '',
    frequentlyUsedPlatforms: [] as string[],
    digitalTools: [] as string[],
    portfolioLink: '',
    motivation: '',
    postTrainingVision: '',
    commit30Days: 'YES',
    preferredBatch: 'BATCH_A',
    trainOthers: 'YES',
    declarationAccurate: false,
    typedSignature: '',
    declarationDate: new Date().toISOString().slice(0, 10),
    termsAccepted: false,
};

export default function ApplicationPage() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [countries, setCountries] = useState<LocationOption[]>([]);
    const [regions, setRegions] = useState<LocationOption[]>([]);
    const [locationError, setLocationError] = useState('');

    const age = useMemo(() => calculateAge(form.dob), [form.dob]);

    useEffect(() => {
        fetch('/api/location/countries')
            .then((response) => response.json())
            .then((payload) => setCountries(payload.data ?? []))
            .catch(() => setLocationError('Country options could not be loaded. Refresh and try again.'));
    }, []);

    useEffect(() => {
        if (!form.residenceCountryCode) return;

        fetch(`/api/location/regions?country=${encodeURIComponent(form.residenceCountryCode)}`)
            .then((response) => response.json())
            .then((payload) => {
                const nextRegions: LocationOption[] = payload.data ?? [];
                setRegions(nextRegions);
                setForm((current) => ({
                    ...current,
                    residenceRegionCode: nextRegions.some((region) => region.code === current.residenceRegionCode)
                        ? current.residenceRegionCode
                        : nextRegions.length === 0 ? 'N/A' : '',
                }));
            })
            .catch(() => setLocationError('State or province options could not be loaded.'));
    }, [form.residenceCountryCode]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;
        if (name === 'residenceCountryCode') setRegions([]);
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'residenceCountryCode' ? { residenceRegionCode: '' } : {}),
        }));
    };

    const handleMultiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;
        setForm((current) => {
            const selected = current[name as 'frequentlyUsedPlatforms' | 'digitalTools'];
            if (name === 'frequentlyUsedPlatforms' && checked && selected.length >= 3) return current;
            return {
                ...current,
                [name]: checked ? [...selected, value] : selected.filter((item) => item !== value),
            };
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus(null);

        const parsed = applicationSchema.safeParse(form);
        if (!parsed.success) {
            const nextErrors: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0] as string;
                nextErrors[key] = issue.message;
            }
            setErrors(nextErrors);
            setSubmitting(false);
            return;
        }

        const response = await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
        });

        const payload = await response.json();
        if (!response.ok) {
            setErrors(payload.errors || { form: payload.message || 'Submission failed.' });
            setSubmitting(false);
            return;
        }

        const successMessage = 'Your application has been successfully submitted. Keep an eye on your email.';
        console.log(successMessage);
        setStatus(`${successMessage} Reference: ${payload.data.reference}`);
        setForm(initialState);
        setErrors({});
        setSubmitting(false);
    };

    return (
        <div className="container-shell py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#075b8f]">Gospel for Everyone Digital Evangelism | 모두를 위한 복음: 디지털 전도</p>
            <h1 className="section-title mt-3">Korea Training Program | 한국 연수 프로그램</h1>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-[#526977]">A planned month of learning in South Korea for Christians who want to share the hope of Jesus with wisdom in digital spaces. The programme aims to equip 1,000 participants across three cohorts; dates, travel and support details remain subject to official confirmation.</p>
            <p className="mt-2 text-sm text-[#526977]">대한민국 현지에서 진행되는 1개월 집중 연수입니다. 여행 관련 공식 서류에 기재된 정보와 정확히 일치하도록 작성해 주세요.</p>

            <div className="mt-6 flex flex-wrap gap-3">
                <a className="btn-secondary" href="/public%20docs/Application%20Form.docx" download>Download bilingual form</a>
                <Link className="btn-secondary" href="/documents">Programme documents</Link>
            </div>

            {locationError && <p role="alert" className="mt-4 text-sm text-red-700">{locationError}</p>}

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <div className="card-surface">
                    <h2 className="text-2xl font-bold">1. Personal &amp; contact information | 개인 및 연락처 정보</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <TextField label="First name | 이름" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                        <TextField label="Middle name (optional) | 미들네임 (선택)" name="middleName" value={form.middleName} onChange={handleChange} />
                        <TextField label="Last name | 성" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
                        <TextField label="Preferred name / alias | 선호하는 이름 / 별칭" name="preferredName" value={form.preferredName} onChange={handleChange} />
                        <TextField label="Date of birth | 생년월일" type="date" name="dob" value={form.dob} onChange={handleChange} error={errors.dob} required />
                        <SelectField label="Gender | 성별" name="gender" value={form.gender} onChange={handleChange} options={[['MALE', 'Male | 남성'], ['FEMALE', 'Female | 여성']]} placeholder="Select gender" required />
                        <p className="rounded-xl border border-[#b8cbd7] bg-[#f7fafb] p-3 text-sm text-[#526977]">Calculated age: <strong>{age ?? '—'}</strong></p>
                        <SelectField label="Nationality | 국적" name="nationalityCode" value={form.nationalityCode} onChange={handleChange} options={countries.map((country) => [country.code, country.name])} placeholder="Select nationality" error={errors.nationalityCode} required />
                        <SelectField label="Country of residence | 거주 국가" name="residenceCountryCode" value={form.residenceCountryCode} onChange={handleChange} options={countries.map((country) => [country.code, country.name])} placeholder="Select country" error={errors.residenceCountryCode} required />
                        <TextField label="Current city | 현재 거주 도시" name="residenceCity" value={form.residenceCity} onChange={handleChange} error={errors.residenceCity} required />
                        <SelectField label="State / Province | 주 / 도" name="residenceRegionCode" value={form.residenceRegionCode} onChange={handleChange} options={regions.map((region) => [region.code, region.name])} placeholder={regions.length ? 'Select state or province' : 'Select a country first'} disabled={!form.residenceCountryCode || regions.length === 0} error={errors.residenceRegionCode} required={regions.length > 0} />
                        <TextField label="WhatsApp phone number (include country code) | WhatsApp 전화번호 (국가번호 포함)" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
                        <TextField label="Primary email address | 주 이메일 주소" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} required />
                    </div>
                </div>

                <div className="card-surface">
                    <h2 className="text-2xl font-bold">2. International travel &amp; passport readiness | 해외여행 및 여권 준비 상태</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <SelectField label="Do you hold a valid international passport? | 유효한 국제 여권을 소지하고 있습니까?" name="passportStatus" value={form.passportStatus} onChange={handleChange} options={[['YES', 'Yes | 예'], ['PROCESSING', 'No, currently processing | 아니요, 발급 절차 진행 중'], ['APPLY_IF_SELECTED', 'No, will apply if selected | 선발되면 신청']]} required />
                        <TextField label="Passport number (optional) | 여권 번호 (선택)" name="passportNumber" value={form.passportNumber} onChange={handleChange} />
                        <TextField label="Passport expiration date | 여권 만료일" type="date" name="passportExpiry" value={form.passportExpiry} onChange={handleChange} />
                        <SelectField label="Have you ever been denied a visa? | 비자 발급이 거부된 적이 있습니까?" name="visaDenied" value={form.visaDenied} onChange={handleChange} options={[['NO', 'No | 아니요'], ['YES', 'Yes | 예']]} required />
                        {form.visaDenied === 'YES' && <TextAreaField label="If yes, explain (20-200 words) | 예라고 답한 경우 설명 (20-200단어)" name="visaDenialExplanation" value={form.visaDenialExplanation} onChange={handleChange} error={errors.visaDenialExplanation} required />}
                    </div>
                </div>

                <div className="card-surface">
                    <h2 className="text-2xl font-bold">3. Faith, church &amp; community affiliation | 신앙, 교회 및 지역사회 소속</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <TextField label="Current local church / ministry name | 현재 출석 교회 / 사역 단체명" name="churchName" value={form.churchName} onChange={handleChange} error={errors.churchName} required />
                        <TextField label="Church city | 교회 소재 도시" name="churchCity" value={form.churchCity} onChange={handleChange} error={errors.churchCity} required />
                        <SelectField label="Church country | 교회 소재 국가" name="churchCountryCode" value={form.churchCountryCode} onChange={handleChange} options={countries.map((country) => [country.code, country.name])} placeholder="Select country" error={errors.churchCountryCode} required />
                        <TextField label="Pastor / ministry leader name | 담임목사 / 사역 책임자 성명" name="pastorName" value={form.pastorName} onChange={handleChange} error={errors.pastorName} required />
                        <TextField label="Pastor's title / role (optional) | 목회자 직책 / 역할 (선택)" name="pastorRole" value={form.pastorRole} onChange={handleChange} />
                        <TextField label="Pastor's phone number | 목회자 전화번호" name="pastorPhone" value={form.pastorPhone} onChange={handleChange} error={errors.pastorPhone} required />
                        <TextField label="Pastor's email address | 목회자 이메일 주소" type="email" name="pastorEmail" value={form.pastorEmail} onChange={handleChange} error={errors.pastorEmail} required />
                        <TextAreaField label="Briefly describe your personal faith journey and involvement in your local church (20-200 words) | 개인적인 신앙 여정과 지역 교회 활동 (20-200단어)" name="faithJourney" value={form.faithJourney} onChange={handleChange} error={errors.faithJourney} required />
                    </div>
                </div>

                <div className="card-surface">
                    <h2 className="text-2xl font-bold">4. Digital skills &amp; social media presence | 디지털 역량 및 소셜 미디어 활동</h2>
                    <p className="mt-2 text-sm text-[#526977]">Share active accounts and links. If a platform does not apply, write N/A. | 현재 사용 중인 계정과 링크를 기재해 주세요.</p>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <TextField label="TikTok handle / link (optional)" name="tiktok" value={form.tiktok} onChange={handleChange} />
                        <TextField label="Instagram handle / link (optional)" name="instagram" value={form.instagram} onChange={handleChange} />
                        <TextField label="YouTube channel link / handle (optional)" name="youtube" value={form.youtube} onChange={handleChange} />
                        <TextField label="X (Twitter) handle / link (optional)" name="xAccount" value={form.xAccount} onChange={handleChange} />
                        <TextField label="Facebook profile / page link (optional)" name="facebook" value={form.facebook} onChange={handleChange} />
                        <TextField label="Discord tag / other platform (optional)" name="discord" value={form.discord} onChange={handleChange} />
                        <CheckboxGroup label="Platforms used most frequently (select up to 3) | 가장 자주 사용하는 플랫폼 (최대 3개)" name="frequentlyUsedPlatforms" values={form.frequentlyUsedPlatforms} onChange={handleMultiChange} error={errors.frequentlyUsedPlatforms} options={[['TIKTOK', 'TikTok'], ['INSTAGRAM_REELS', 'Instagram Reels'], ['YOUTUBE', 'YouTube / Shorts'], ['X', 'X (Twitter)'], ['DISCORD', 'Discord'], ['TWITCH', 'Twitch'], ['FACEBOOK', 'Facebook'], ['WHATSAPP', 'WhatsApp'], ['TELEGRAM', 'Telegram'], ['OTHER', 'Other']]} />
                        <CheckboxGroup label="Digital creation tools / apps used | 사용하는 디지털 콘텐츠 제작 도구" name="digitalTools" values={form.digitalTools} onChange={handleMultiChange} error={errors.digitalTools} options={[['VIDEO_EDITING', 'CapCut / video editors'], ['DESIGN', 'Canva / graphic design'], ['ADOBE', 'Adobe Suite'], ['LIVE_STREAMING', 'Live streaming tools'], ['WRITING_AI', 'Copywriting / AI tools'], ['AUDIO_EDITING', 'Audio / podcast editing'], ['NONE', 'None yet - eager to learn']]} required />
                        <TextField label="Digital portfolio / sample work link (optional) | 디지털 포트폴리오 / 작업 샘플 링크 (선택)" name="portfolioLink" value={form.portfolioLink} onChange={handleChange} />
                    </div>
                </div>

                <div className="card-surface">
                    <h2 className="text-2xl font-bold">5. Motivation &amp; vision for digital evangelism | 디지털 복음전도에 대한 동기와 비전</h2>
                    <div className="mt-6 grid gap-5">
                        <TextAreaField label="Why do you want to join this 1-month Digital Evangelism Training in Korea? (20-200 words) | 대한민국에서 진행되는 1개월 연수에 참여하고 싶은 이유 (20-200단어)" name="motivation" value={form.motivation} onChange={handleChange} error={errors.motivation} required />
                        <TextAreaField label="How will you use social media, content, and digital tools to share the Gospel with Gen Z and Gen Alpha after the programme? (20-200 words) | 연수 수료 후 소셜 미디어와 디지털 도구를 활용한 복음전도 비전 (20-200단어)" name="postTrainingVision" value={form.postTrainingVision} onChange={handleChange} error={errors.postTrainingVision} required />
                    </div>
                </div>

                <div className="card-surface">
                    <h2 className="text-2xl font-bold">6. Program commitment &amp; availability | 프로그램 참여 약속 및 가능 일정</h2>
                    <div className="mt-6 space-y-4 text-[#122d42]">
                        <SelectField label="Can you commit to 30 consecutive days of intensive, full-time training in South Korea? | 대한민국에서 30일 연속 집중 전일제 연수에 참여할 수 있습니까?" name="commit30Days" value={form.commit30Days} onChange={handleChange} options={[['YES', 'Yes | 예'], ['NO', 'No | 아니요']]} required />
                        <SelectField label="Which program batch timing best fits your schedule? | 어느 연수 기수가 일정에 가장 적합합니까?" name="preferredBatch" value={form.preferredBatch} onChange={handleChange} options={[['BATCH_A', 'Batch A - March 2027'], ['BATCH_B', 'Batch B - July 2027'], ['BATCH_C', 'Batch C - November 2027']]} required />
                        <SelectField label="Will you train other young believers after returning home? | 귀국 후 다른 청년 신자들을 교육할 의향이 있습니까?" name="trainOthers" value={form.trainOthers} onChange={handleChange} options={[['YES', 'Yes, absolutely | 예, 적극적으로 참여'], ['UNSURE', 'Unsure | 아직 확실하지 않음']]} required />
                    </div>
                </div>

                <div className="card-surface">
                    <h2 className="text-2xl font-bold">7. Applicant declaration | 지원자 확인 및 서약</h2>
                    <p className="mt-4 text-sm leading-6 text-[#526977]">I certify that all information provided is true and complete. Selection is subject to committee review, pastoral verification, and visa approval. If selected, I agree to follow the programme code of conduct in South Korea.</p>
                    <p className="mt-2 text-sm leading-6 text-[#526977]">본 지원서의 모든 정보가 사실이며 완전함을 확인합니다. 선발은 심사위원회 검토, 목회자 확인 및 비자 승인에 따라 결정됩니다. 선발될 경우 대한민국 체류 중 프로그램 행동 수칙을 준수하는 데 동의합니다.</p>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <TextField label="Applicant signature / typed full name | 지원자 서명 / 정자체 성명" name="typedSignature" value={form.typedSignature} onChange={handleChange} error={errors.typedSignature} required />
                        <TextField label="Date | 날짜" type="date" name="declarationDate" value={form.declarationDate} onChange={handleChange} error={errors.declarationDate} required />
                    </div>
                    <div className="mt-6 space-y-4 text-sm text-[#122d42]">
                        <CheckboxField name="declarationAccurate" checked={form.declarationAccurate} onChange={handleChange} label="I certify that the information provided is true and complete. | 기재한 정보가 사실이며 완전함을 확인합니다." error={errors.declarationAccurate} required />
                        <CheckboxField name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} label={<span>I have read and agree to the <a className="underline" href="/korea-training/terms" target="_blank" rel="noreferrer">programme terms and conditions</a>. | 프로그램 이용약관을 읽고 동의합니다.</span>} error={errors.termsAccepted} required />
                    </div>
                </div>

                {status && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{status}</div>}

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Submit application'}
                </button>
            </form>
        </div>
    );
}

type FieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
    type?: string;
};

function TextField({ label, name, value, onChange, error, required, type = 'text' }: FieldProps) {
    return (
        <label className="space-y-2 text-sm font-medium text-[#122d42]">
            {label}{required && <RequiredMark />}
            <input type={type} name={name} value={value} onChange={onChange} required={required} className="w-full rounded-xl border border-[#b8cbd7] bg-white p-3" />
            {error && <span className="block text-sm text-red-700">{error}</span>}
        </label>
    );
}

function TextAreaField({ label, name, value, onChange, error, required }: FieldProps) {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

    return (
        <label className="space-y-2 text-sm font-medium text-[#122d42]">
            {label}{required && <RequiredMark />}
            <textarea name={name} value={value} onChange={onChange} required={required} className="min-h-32 w-full rounded-xl border border-[#b8cbd7] bg-white p-3" />
            <span className="block text-xs font-normal text-[#526977]" aria-live="polite">{wordCount} words (20-200)</span>
            {error && <span className="block text-sm text-red-700">{error}</span>}
        </label>
    );
}

function SelectField({ label, name, value, onChange, options, placeholder, disabled, error, required }: FieldProps & { options: string[][]; placeholder?: string; disabled?: boolean }) {
    return (
        <label className="space-y-2 text-sm font-medium text-[#122d42]">
            {label}{required && <RequiredMark />}
            <select name={name} value={value} onChange={onChange} disabled={disabled} required={required} className="w-full rounded-xl border border-[#b8cbd7] bg-white p-3 disabled:bg-[#f4f0ed]">
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
            </select>
            {error && <span className="block text-sm text-red-700">{error}</span>}
        </label>
    );
}

function CheckboxGroup({ label, name, values, onChange, options, error, required }: { label: string; name: string; values: string[]; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; options: string[][]; error?: string; required?: boolean }) {
    return (
        <fieldset className="space-y-3 rounded-xl border border-[#b8cbd7] p-4">
            <legend className="px-1 text-sm font-medium text-[#122d42]">{label}{required && <RequiredMark />}</legend>
            {options.map(([value, optionLabel]) => <label key={value} className="flex items-start gap-2 text-sm"><input type="checkbox" name={name} value={value} checked={values.includes(value)} onChange={onChange} /><span>{optionLabel}</span></label>)}
            {error && <p className="text-sm text-red-700">{error}</p>}
        </fieldset>
    );
}

function CheckboxField({ name, checked, onChange, label, error, required }: { name: string; checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; label: React.ReactNode; error?: string; required?: boolean }) {
    return (
        <label className="flex items-start gap-3">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} required={required} />
            <span>{label}{required && <RequiredMark />}{error && <span className="mt-1 block text-sm text-red-700">{error}</span>}</span>
        </label>
    );
}

function RequiredMark() {
    return <span aria-hidden="true" className="ml-1 font-bold text-red-600">*</span>;
}

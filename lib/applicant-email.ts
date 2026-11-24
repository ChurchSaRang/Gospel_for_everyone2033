import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const providerName = 'resend';

type ApplicantName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

type EmailType = 'application-received' | 'selection-notice' | 'batch-assigned';

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character] ?? character);
}

function getApplicantFullName(name: ApplicantName) {
    return [name.firstName, name.middleName, name.lastName].filter(Boolean).join(' ');
}

function buildMessage(type: EmailType, name: ApplicantName, confirmationCode?: string, batchName?: string, batchNumber?: string | number) {
    const fullName = escapeHtml(getApplicantFullName(name));
    if (type === 'application-received') {
        const subject = 'Application Received: Digital Evangelism Training Program (South Korea)';
        const text = `Dear ${getApplicantFullName(name)},

Thank you for submitting your application for the Digital Evangelism Training Program in South Korea, organized in support of "The Gospel for Everyone by 2033" movement.

We have successfully received your details. Our admissions and screening committee is currently reviewing applications for the upcoming training batches.

What Happens Next?
1. Application Review: The committee will evaluate your profile, pastoral recommendation, and digital background.
2. Notification of Selection: If selected, you will receive a follow-up email containing your Unique Confirmation Code and step-by-step directives on how to secure your spot and complete your travel/visa documentation.
3. Response Time: Shortlisted candidates are typically notified within 14 business days.

We appreciate your passion for reaching the next generation with the Gospel of Jesus Christ.

"Go therefore and make disciples of all nations..." - Matthew 28:19

The Gospel of our Lord Jesus Christ is for everyone!

Warm regards,
The Admissions Secretariat
The Gospel for Everyone 2033 Initiative
https://www.gospelforeveryonemovement.com
support@gospelforeveryonemovement.com`;
        const html = `<p>Dear <strong>${fullName}</strong>,</p>
<p>Thank you for submitting your application for the <strong>Digital Evangelism Training Program in South Korea</strong>, organized in support of <strong>"The Gospel for Everyone by 2033"</strong> movement.</p>
<p>We have successfully received your details. Our admissions and screening committee is currently reviewing applications for the upcoming training batches.</p>
<h3>What Happens Next?</h3>
<ol><li><strong>Application Review:</strong> The committee will evaluate your profile, pastoral recommendation, and digital background.</li><li><strong>Notification of Selection:</strong> If selected, you will receive a follow-up email containing your <strong>Unique Confirmation Code</strong> and step-by-step directives on how to secure your spot and complete your travel/visa documentation.</li><li><strong>Response Time:</strong> Shortlisted candidates are typically notified within <strong>14 business days</strong>.</li></ol>
<p>We appreciate your passion for reaching the next generation with the Gospel of Jesus Christ.</p>
<p><em>"Go therefore and make disciples of all nations..."</em> - Matthew 28:19</p>
<p><strong>The Gospel of our Lord Jesus Christ is for everyone!</strong></p>
<p>Warm regards,<br><strong>The Admissions Secretariat</strong><br><em>The Gospel for Everyone 2033 Initiative</em></p>
<p><a href="https://www.gospelforeveryonemovement.com">www.gospelforeveryonemovement.com</a><br><a href="mailto:support@gospelforeveryonemovement.com">support@gospelforeveryonemovement.com</a></p>`;
        return { subject, text, html };
    }

    if (type === 'selection-notice') {
        const subject = 'Selection Notice: Digital Evangelism Training Program (South Korea) | Action Required';
        const safeCode = escapeHtml(confirmationCode || '');
        const text = `Dear ${getApplicantFullName(name)},

Congratulations! We are delighted to inform you that your application for the Digital Evangelism Training Program in South Korea has been shortlisted and selected by the screening committee.

You are taking a pivotal step toward equipping yourself to reach the next generation with the Gospel of Jesus Christ as part of "The Gospel for Everyone by 2033" movement.

Next Steps to Secure Your Spot
1. Visit https://www.gospelforeveryonemovement.com
2. Click on "Check Application Status / Pay Support Fee"
3. Enter your unique Confirmation Code: ${confirmationCode}
4. Complete the required $500 USD participant support fee.

The $500 participant support fee works alongside grants and donations provided by SaRang Community Church, the World Evangelical Alliance, and movement partners. It helps cover international flight arrangements, accommodation, daily meals, specialized training materials, software licenses, and visa processing support. Personal expenses outside the core training scope remain the participant's responsibility.

Selection alone does not secure your final slot. Places are confirmed on a first-paid, first-secured basis per batch. Once your support fee is received and confirmed, you will be assigned your batch number and training start date, and our team will initiate visa sponsorship documentation and travel arrangements.

You can log into the portal at any time using your confirmation code to track your travel status and updates.

Thank you for answering the call to serve. Together, we are taking the Gospel for Everyone everywhere!

Warm regards,
The Admissions Committee
The Gospel for Everyone 2033 Initiative
https://www.gospelforeveryonemovement.com
support@gospelforeveryonemovement.com`;
        const html = `<p>Dear <strong>${fullName}</strong>,</p>
<p>Congratulations! We are delighted to inform you that your application for the <strong>Digital Evangelism Training Program in South Korea</strong> has been shortlisted and selected by the screening committee.</p>
<p>You are taking a pivotal step toward equipping yourself to reach the next generation with the Gospel of Jesus Christ as part of <strong>"The Gospel for Everyone by 2033"</strong> movement.</p>
<h3>Next Steps to Secure Your Spot</h3>
<ol><li>Visit <a href="https://www.gospelforeveryonemovement.com">www.gospelforeveryonemovement.com</a>.</li><li>Click on <strong>"Check Application Status / Pay Support Fee"</strong>.</li><li>Enter your unique Confirmation Code: <strong>${safeCode}</strong>.</li><li>Complete the required <strong>$500 USD</strong> participant support fee.</li></ol>
<h3>Important Note on Program Support</h3>
<p>The $500 participant support fee works alongside grants and donations provided by SaRang Community Church, the World Evangelical Alliance, and movement partners. It helps cover international flight arrangements, accommodation, daily meals, specialized training materials, software licenses, and visa processing support. Personal expenses outside the core training scope remain the participant's responsibility.</p>
<h3>Deadlines &amp; Batch Processing</h3>
<p>Selection alone does not secure your final slot. Places are confirmed on a <strong>first-paid, first-secured</strong> basis per batch. Once your support fee is received and confirmed, you will be assigned your batch number and training start date, and our team will initiate visa sponsorship documentation and travel arrangements.</p>
<p>You can log into the portal at any time using your confirmation code to track your travel status and updates.</p>
<p>Thank you for answering the call to serve. Together, we are taking the Gospel for Everyone everywhere!</p>
<p>Warm regards,<br><strong>The Admissions Committee</strong><br><em>The Gospel for Everyone 2033 Initiative</em></p>
<p><a href="https://www.gospelforeveryonemovement.com">www.gospelforeveryonemovement.com</a><br><a href="mailto:support@gospelforeveryonemovement.com">support@gospelforeveryonemovement.com</a></p>`;
        return { subject, text, html };
    }

    if (type === 'batch-assigned') {
        const safeBatch = escapeHtml(batchName || 'Batch');
        const safeCode = escapeHtml(confirmationCode || '');
        const safeNumber = escapeHtml(String(batchNumber ?? ''));
        const subject = 'Batch Assignment Confirmed: Digital Evangelism Training Program (South Korea)';
        const text = `Dear ${getApplicantFullName(name)},

Your payment has been confirmed and your batch assignment is now final.

Confirmation Code: ${confirmationCode}
Assigned Batch: ${batchName || 'Not specified'}
Batch Number: ${batchNumber ?? 'Not assigned'}

Your place has been secured for the next available cohort in the programme. The Admissions Team will continue with visa preparation, travel guidance, and orientation support.

Warm regards,
The Admissions Secretariat
The Gospel for Everyone 2033 Initiative
https://www.gospelforeveryonemovement.com
support@gospelforeveryonemovement.com`;
        const html = `<p>Dear <strong>${fullName}</strong>,</p>
<p>Your payment has been confirmed and your batch assignment is now final.</p>
<p><strong>Confirmation Code:</strong> ${safeCode}</p>
<p><strong>Assigned Batch:</strong> ${safeBatch}</p>
<p><strong>Batch Number:</strong> ${safeNumber}</p>
<p>Your place has been secured for the next available cohort in the programme. The Admissions Team will continue with visa preparation, travel guidance, and orientation support.</p>
<p>Warm regards,<br><strong>The Admissions Secretariat</strong><br><em>The Gospel for Everyone 2033 Initiative</em></p>
<p><a href="https://www.gospelforeveryonemovement.com">www.gospelforeveryonemovement.com</a><br><a href="mailto:support@gospelforeveryonemovement.com">support@gospelforeveryonemovement.com</a></p>`;
        return { subject, text, html };
    }

    return { subject: '', text: '', html: '' };
}

export async function sendApplicantEmail({
    type,
    recipient,
    name,
    applicationId,
    confirmationCode,
    batchName,
    batchNumber,
}: {
    type: EmailType;
    recipient: string;
    name: ApplicantName;
    applicationId: string;
    confirmationCode?: string;
    batchName?: string;
    batchNumber?: string | number;
}) {
    const message = buildMessage(type, name, confirmationCode, batchName, batchNumber);
    let status = 'FAILED';
    let errorMessage: string | undefined;

    try {
        const apiKey = process.env.RESEND_API_KEY?.trim();
        const from = process.env.EMAIL_FROM?.trim();
        const replyTo = process.env.EMAIL_REPLY_TO?.trim();
        if (!apiKey) throw new Error('RESEND_API_KEY is not configured in the server environment.');
        if (!from) throw new Error('EMAIL_FROM is not configured in the server environment.');

        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            from,
            to: [recipient],
            subject: message.subject,
            text: message.text,
            html: message.html,
            ...(replyTo ? { replyTo } : {}),
        }, { idempotencyKey: `${type}/${applicationId}` });

        if (error) throw new Error(error.message);
        if (!data?.id) throw new Error('Resend did not confirm the email send.');
        status = 'SENT';
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Email delivery failed.';
        console.error(`Applicant ${type} email failed:`, errorMessage);
    }

    try {
        await prisma.emailLog.create({
            data: {
                recipient,
                subject: message.subject,
                templateName: `${type}:${applicationId}`,
                status,
                provider: providerName,
            },
        });
    } catch (error) {
        console.error('Could not write applicant email log:', error);
    }

    return { sent: status === 'SENT', error: errorMessage };
}

export async function hasSentSelectionEmail(recipient: string, applicationId: string) {
    return Boolean(await prisma.emailLog.findFirst({
        where: { recipient, templateName: `selection-notice:${applicationId}`, status: 'SENT' },
        select: { id: true },
    }));
}
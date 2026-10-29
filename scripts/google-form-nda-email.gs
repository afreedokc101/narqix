/**
 * Narqix Academy: automatic NDA email for the Google Form application.
 *
 * When someone submits the application form, this emails them the NDA (a PDF in Google Drive)
 * and tells them how to continue: sign it, create an account at academy.narqix.com and upload it.
 *
 * Setup (once, by the form owner):
 *   1. Open the Google Form > three-dot menu > Apps Script. Delete what's there and paste this whole file.
 *   2. Set NDA_FILE_ID below: open the NDA PDF in Google Drive, the ID is the long part of the link
 *      between /d/ and /view.
 *   3. Click Save, then Run > "setup" once and allow the permissions it asks for.
 *   4. Submit a test response with your own email and check the email arrives.
 *
 * The email is sent from the Google account that owns the form. Free Gmail accounts can send
 * 100 of these a day; Google Workspace accounts 1,500.
 */

const NDA_FILE_ID = 'PASTE_THE_NDA_FILE_ID_HERE';
const SIGNUP_URL = 'https://academy.narqix.com/signup/';
const REPLY_TO = 'hiring@narqix.com';
const SENDER_NAME = 'Narqix Academy';

/** Run once: makes onFormSubmit run on every new application. */
function setup() {
  const form = FormApp.getActiveForm();
  for (const t of ScriptApp.getProjectTriggers()) if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t);
  ScriptApp.newTrigger('onFormSubmit').forForm(form).onFormSubmit().create();
  DriveApp.getFileById(NDA_FILE_ID); // fails now, rather than on the first applicant, if the ID is wrong
}

function onFormSubmit(e) {
  const response = e.response;
  let email = '';
  try {
    email = response.getRespondentEmail(); // set when the form collects email addresses
  } catch (err) {}
  let name = '';
  for (const item of response.getItemResponses()) {
    const title = item.getItem().getTitle().toLowerCase();
    const answer = String(item.getResponse() || '').trim();
    if (!email && title.includes('email')) email = answer;
    if (!name && title.includes('name')) name = answer;
  }
  if (!email) return; // nothing to send to

  const first = name.split(/\s+/)[0] || 'there';
  const nda = DriveApp.getFileById(NDA_FILE_ID).getAs(MimeType.PDF).setName('Narqix Academy NDA.pdf');
  const body = [
    `Hi ${first},`,
    '',
    'Thanks for applying to Narqix Academy. Before your training starts, we need a signed copy of our non-disclosure agreement (NDA). It is attached to this email.',
    '',
    'Here is what to do next:',
    '1. Read the attached NDA, then sign and date it. You can sign it digitally, or print it, sign it by hand and take a clear photo or scan of every page.',
    `2. Create your free Academy account: ${SIGNUP_URL}`,
    '3. Right after you create your account, upload your signed NDA on the welcome page.',
    '',
    'Our hiring team reviews every NDA, usually within 1 to 2 working days. We will email you as soon as your Academy access is approved.',
    '',
    `Questions? Just reply to this email or write to ${REPLY_TO}.`,
    '',
    'The Narqix Academy hiring team',
  ].join('\n');

  GmailApp.sendEmail(email, 'Next step: sign your Narqix Academy NDA', body, {
    name: SENDER_NAME,
    replyTo: REPLY_TO,
    attachments: [nda],
  });
}

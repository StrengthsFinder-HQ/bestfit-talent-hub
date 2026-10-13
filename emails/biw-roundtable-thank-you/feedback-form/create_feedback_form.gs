/**
 * Creates the Indonesia Executive Roundtable feedback form in Google Forms,
 * with a Google Sheet that collects the responses.
 *
 * How to run:
 *   1. Go to https://script.google.com and click "New project".
 *   2. Delete the sample code, paste this whole file, and click Save.
 *   3. Click Run. Approve the permissions Google asks for (first run only).
 *   4. Open View > Logs (or the Execution log below the code). It shows the
 *      form's share link, its edit link and the responses sheet.
 */
function createRoundtableFeedbackForm() {
  var RATING_LOW = 'Poor';
  var RATING_HIGH = 'Excellent';

  var form = FormApp.create('Indonesia Executive Roundtable: Your Feedback');
  form.setTitle('Indonesia Executive Roundtable: Your Feedback')
    .setDescription(
      'The Execution Gap · Friday 9 October 2026 · Kacapi Room, Ascott Sudirman Jakarta\n\n' +
      'Thank you for joining us. This takes about 2 minutes. Your feedback helps ' +
      'BI WORLDWIDE and Strengths Finder Indonesia shape the next roundtable.')
    .setConfirmationMessage(
      'Thank you for your feedback. We read every response.\n\n' +
      'If you would like to continue the conversation, write to impact@strengthsfinder.id.')
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setLimitOneResponsePerUser(false)
    .setShowLinkToRespondAgain(false)
    .setProgressBar(true);

  function rating(title, help) {
    var item = form.addScaleItem()
      .setTitle(title)
      .setBounds(1, 5)
      .setLabels(RATING_LOW, RATING_HIGH)
      .setRequired(true);
    if (help) item.setHelpText(help);
    return item;
  }

  function comment(title) {
    return form.addParagraphTextItem().setTitle(title).setRequired(false);
  }

  // 1. The event overall
  form.addSectionHeaderItem().setTitle('The event overall');
  rating('Overall, how would you rate the roundtable?');
  form.addMultipleChoiceItem()
    .setTitle('How likely are you to attend a future roundtable from BI WORLDWIDE and Strengths Finder Indonesia?')
    .setChoiceValues(['Very likely', 'Likely', 'Not sure', 'Unlikely'])
    .setRequired(false);

  // 2. The venue
  form.addPageBreakItem().setTitle('The venue')
    .setHelpText('Kacapi Room, Ascott Sudirman Jakarta');
  rating('How would you rate the venue?',
    'Location and access, the room and setup, and the breakfast and coffee.');
  comment('Anything about the venue we should keep or change?');

  // 3. The material
  form.addPageBreakItem().setTitle('The material')
    .setHelpText('Market Perspectives & Executive Insights (SFI), ' +
      'Executive Provocation: The Execution Gap (BIW), and ' +
      'Closing the Execution Gap: Lessons from Practice (BIW).');
  rating('How relevant and useful was the material to your organisation?');
  form.addCheckboxItem()
    .setTitle('Which sessions were most valuable to you?')
    .setChoiceValues([
      'Market Perspectives & Executive Insights',
      'Executive Provocation: The Execution Gap',
      'Executive roundtable discussion',
      'Closing the Execution Gap: Lessons from Practice',
      'What We Heard: three practical takeaways',
      'Networking and executive conversations'
    ])
    .setRequired(false);
  comment('What would have made the material more useful?');

  // 4. The discussion
  form.addPageBreakItem().setTitle('The discussion');
  rating('How would you rate the roundtable discussion?',
    'The quality of the conversation, the mix of perspectives, and the time for it.');
  comment('What was your biggest takeaway from the discussion?');

  // 5. The facilitators
  form.addPageBreakItem().setTitle('The facilitators')
    .setHelpText('Alex Kelly and Suraaj Velayutham (BI WORLDWIDE), and Roma Tampubolon (Strengths Finder Indonesia).');
  rating('How would you rate the facilitation?',
    'How well the facilitators guided the conversation and drew out the room.');
  comment('Any comments for the facilitators?');

  // 6. Looking ahead
  form.addPageBreakItem().setTitle('Looking ahead');
  comment('What topic would you like a future roundtable to explore?');
  form.addMultipleChoiceItem()
    .setTitle('Would you like a follow-up conversation about closing the execution gap in your organisation?')
    .setChoiceValues(['Yes, please contact me', 'Not right now'])
    .setRequired(false);
  form.addTextItem().setTitle('Your name (optional)').setRequired(false);
  form.addTextItem().setTitle('Your company (optional)').setRequired(false);
  form.addTextItem().setTitle('Your email (optional, only if you would like us to follow up)').setRequired(false);

  // Responses go to a new Google Sheet.
  var sheet = SpreadsheetApp.create('Indonesia Executive Roundtable: Feedback Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Forms made by a script can start unpublished; publish so guests can answer.
  try { form.setPublished(true); } catch (e) { /* older accounts publish by default */ }
  // Let guests answer without signing in to a Google account (Workspace only).
  try { form.setRequireLogin(false); } catch (e) { /* not a Workspace account */ }

  var shareUrl = form.getPublishedUrl();
  try { shareUrl = form.shortenFormUrl(shareUrl); } catch (e) { /* keep the long link */ }

  Logger.log('SHARE THIS LINK (put it in the email): ' + shareUrl);
  Logger.log('Edit the form: ' + form.getEditUrl());
  Logger.log('Responses sheet: ' + sheet.getUrl());
}

/**
 * SAI Lab seminar upload relay (Google Apps Script web app).
 *
 * Receives the form on /upload/, then opens a pull request on the site repository that
 * adds the PDF to files/seminars/ and one entry to _data/seminars.yml.
 * Nothing reaches the site until the site manager merges the pull request.
 *
 * Script properties (Project Settings > Script properties):
 *   UPLOAD_CODE   code shared inside the lab
 *   GITHUB_TOKEN  fine-grained token, this repository only:
 *                 Contents (read and write), Pull requests (read and write)
 * Setup steps: guideline.md section 6.
 */
var REPO = 'Signal-Augmented-Intelligence/Signal-Augmented-Intelligence.github.io';
var BASE = 'main';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    if (!d.code || d.code !== props.getProperty('UPLOAD_CODE')) return reply({ ok: false, error: '업로드 코드가 맞지 않습니다.' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || '')) return reply({ ok: false, error: '발표일을 확인해 주세요.' });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.presenter || '')) return reply({ ok: false, error: '발표자를 선택해 주세요.' });
    if (!clean(d.title)) return reply({ ok: false, error: '제목을 적어 주세요.' });
    if (!clean(d.summary)) return reply({ ok: false, error: '개요 한 문장을 적어 주세요.' });

    var token = props.getProperty('GITHUB_TOKEN');
    var stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd-HHmmss');
    var branch = 'upload/' + d.date + '-' + d.presenter + '-' + stamp;
    var head = github(token, 'get', '/git/ref/heads/' + BASE);
    github(token, 'post', '/git/refs', { ref: 'refs/heads/' + branch, sha: head.object.sha });

    var fileName = '';
    if (d.file) {
      fileName = d.date + '-' + d.presenter + '-' + stamp.slice(9) + '.pdf';
      github(token, 'put', '/contents/files/seminars/' + fileName, {
        message: 'Add seminar slides: ' + clean(d.title), content: d.file, branch: branch
      });
    }

    var current = github(token, 'get', '/contents/_data/seminars.yml?ref=' + encodeURIComponent(branch));
    var text = Utilities.newBlob(Utilities.base64Decode(current.content.replace(/\n/g, ''))).getDataAsString('UTF-8');
    text = text.replace(/^\[\]\s*$/m, '');
    if (text.slice(-1) !== '\n') text += '\n';
    text += '- date: ' + d.date + '\n'
      + '  presenter: ' + d.presenter + '\n'
      + '  title: ' + JSON.stringify(clean(d.title)) + '\n'
      + '  summary: ' + JSON.stringify(clean(d.summary)) + '\n'
      + '  file: ' + JSON.stringify(fileName) + '\n'
      + '  highlight: false\n';
    github(token, 'put', '/contents/_data/seminars.yml', {
      message: 'Add seminar: ' + clean(d.title),
      content: Utilities.base64Encode(text, Utilities.Charset.UTF_8),
      sha: current.sha, branch: branch
    });

    var pr = github(token, 'post', '/pulls', {
      title: 'Seminar: ' + clean(d.title), head: branch, base: BASE,
      body: 'Submitted from the upload page.\n\n'
        + '- Date: ' + d.date + '\n- Presenter: ' + d.presenter + '\n- PDF: ' + (fileName || 'none') + '\n'
        + '- Submitted at: ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm') + ' KST\n\n'
        + 'Before merging: check the title and summary, then set `highlight: true` if it should appear on the home page.'
    });
    return reply({ ok: true, url: pr.html_url });
  } catch (err) {
    return reply({ ok: false, error: '제출하지 못했습니다. 관리자에게 알려 주세요. (' + (err.message || err) + ')' });
  }
}

function clean(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function github(token, method, path, body) {
  var options = {
    method: method,
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    muteHttpExceptions: true
  };
  if (body) options.payload = JSON.stringify(body);
  var response = UrlFetchApp.fetch('https://api.github.com/repos/' + REPO + path, options);
  var code = response.getResponseCode();
  var json = response.getContentText() ? JSON.parse(response.getContentText()) : {};
  if (code >= 300) throw new Error(method.toUpperCase() + ' ' + path.split('?')[0] + ' ' + code + ' ' + (json.message || ''));
  return json;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

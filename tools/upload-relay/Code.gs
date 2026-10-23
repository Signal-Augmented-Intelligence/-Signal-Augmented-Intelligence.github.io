/**
 * SAI Lab seminar upload relay (Google Apps Script web app).
 *
 * Receives the form on /upload/, then opens a pull request on the site repository that
 * adds the PDF, optional cover image, and one entry to content/seminars.yml.
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || '')) return reply({ ok: false, error: '세미나 날짜를 확인해 주세요.' });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.presenter || '')) return reply({ ok: false, error: '발표자를 선택해 주세요.' });
    // 'guest' = a speaker outside people.yml; the name typed on the form is stored as is.
    var guestName = d.presenter === 'guest' ? clean(d.presenter_name) : '';
    if (d.presenter === 'guest' && (!guestName || guestName.length > 80)) return reply({ ok: false, error: '외부 발표자 이름을 적어 주세요 (80자 이하).' });
    if (!clean(d.title)) return reply({ ok: false, error: '제목을 적어 주세요.' });
    if (!clean(d.summary)) return reply({ ok: false, error: '개요 한 문장을 적어 주세요.' });
    if (clean(d.area).length > 80) return reply({ ok: false, error: '분야는 80자 이하로 적어 주세요.' });
    if (d.cover && !d.file) return reply({ ok: false, error: '표지 이미지를 올리려면 PDF도 함께 올려 주세요.' });
    var coverExtensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    if (d.cover && !coverExtensions[d.cover_type]) return reply({ ok: false, error: '표지는 JPG, PNG, WebP 이미지만 올릴 수 있습니다.' });

    var token = props.getProperty('GITHUB_TOKEN');
    var stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd-HHmmss');
    var branch = 'upload/' + d.date + '-' + d.presenter + '-' + stamp;
    var head = github(token, 'get', '/git/ref/heads/' + BASE);
    github(token, 'post', '/git/refs', { ref: 'refs/heads/' + branch, sha: head.object.sha });

    var fileName = '';
    if (d.file) {
      fileName = d.date + '-' + d.presenter + '-' + stamp.slice(9) + '.pdf';
      github(token, 'put', '/contents/public/files/seminars/' + fileName, {
        message: 'Add seminar slides: ' + clean(d.title), content: d.file, branch: branch
      });
    }
    var coverName = '';
    if (d.cover) {
      coverName = d.date + '-' + d.presenter + '-' + stamp.slice(9) + '.' + coverExtensions[d.cover_type];
      github(token, 'put', '/contents/public/images/seminars/' + coverName, {
        message: 'Add seminar cover: ' + clean(d.title), content: d.cover, branch: branch
      });
    }

    var current = github(token, 'get', '/contents/content/seminars.yml?ref=' + encodeURIComponent(branch));
    var text = Utilities.newBlob(Utilities.base64Decode(current.content.replace(/\n/g, ''))).getDataAsString('UTF-8');
    text = text.replace(/^\[\]\s*$/m, '');
    if (text.slice(-1) !== '\n') text += '\n';
    text += '- date: ' + d.date + '\n'
      + '  presenter: ' + (guestName ? JSON.stringify(guestName) : d.presenter) + '\n'
      + '  title: ' + JSON.stringify(clean(d.title)) + '\n'
      + '  summary: ' + JSON.stringify(clean(d.summary)) + '\n'
      + '  area: ' + JSON.stringify(clean(d.area)) + '\n'
      + '  file: ' + JSON.stringify(fileName) + '\n'
      + '  cover: ' + JSON.stringify(coverName) + '\n'
      + '  highlight: false\n';
    github(token, 'put', '/contents/content/seminars.yml', {
      message: 'Add seminar: ' + clean(d.title),
      content: Utilities.base64Encode(text, Utilities.Charset.UTF_8),
      sha: current.sha, branch: branch
    });

    var pr = github(token, 'post', '/pulls', {
      title: 'Seminar: ' + clean(d.title), head: branch, base: BASE,
      body: 'Submitted from the upload page.\n\n'
        + '- Seminar date: ' + d.date + '\n- Presenter: ' + (guestName || d.presenter) + '\n- Area: ' + (clean(d.area) || 'none') + '\n- PDF: ' + (fileName || 'none') + '\n- Cover: ' + (coverName || 'none') + '\n'
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

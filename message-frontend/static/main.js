(function main() {
  'use strict';

  const sendMessageUrl = 'sendMessageUrl';

  const getSendMessageUrl = () =>
    localStorage.getItem(sendMessageUrl);

  const configureApp = () =>
    fetch('/config').then(resp => resp.json())
                    .then(json => json.config)
                    .then(config => config['MESSAGE_COMMAND_URL'] || 'http://localhost:3001')
                    .then(messageCommandUrl => messageCommandUrl + '/api/v1/messages')
                    .then(url => localStorage.setItem(sendMessageUrl, url));

  document.addEventListener('load', configureApp, false);
  document.addEventListener('beforeunload', () => localStorage.clear(), false);

  const getInputMessage = target => {
    const value = target.value;
    if (!value || !value.trim().length) return null;
    target.value = '';
    return value.trim();
  };

  const send = message => {
    const sendMessageUrl = getSendMessageUrl();
    return fetch(sendMessageUrl, {
      method: 'post',
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ content: message })
    });
  };

  const onDOMContentLoaded = () => {

    const output = document.querySelector('#output');

    const render = html => {
      const el = document.createElement('div');
      el.innerHTML = html;
      const fragment = document.createDocumentFragment();
      fragment.appendChild(el);
      output.insertBefore(fragment, output.firstChild);
    };

    const onKeyup = e => {
      const { target, keyCode } = e;
      if (!target || !keyCode || keyCode !== 13) return;

      const message = getInputMessage(target);
      if (!message) return;

      send(message).then(resp => resp.json())
                   .then(json => json)
                   .then(payload => payload.id)
                   .then(id => `<div id="${id}">${message}</div>`)
                   .then(render);
    };

    document.querySelector('input').addEventListener('keyup', onKeyup, false);
  };

  document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);

})();

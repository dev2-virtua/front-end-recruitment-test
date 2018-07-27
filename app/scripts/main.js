/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          const installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  const button = document.getElementsByTagName('button')[0];
  const image = document.getElementsByTagName('img')[0];
  const destination = image.parentElement;
  const checkout = document.getElementById('checkout');
  const form = checkout.getElementsByTagName('form')[0];

  /**
   * Validate form function
   * @param {String} type
   * @param {String} message
   */
  function displayMessage(type, message) {
    const isExistElm = document.getElementsByClassName('message');

    if (isExistElm.length > 0) {
        isExistElm[0].parentNode.removeChild(isExistElm[0]);
    }

    const msgElm = document.createElement('div');
    const msgTextElm = document.createElement('p');

    msgElm.setAttribute('class', `message message-${type}`);

    msgTextElm.innerHTML = message;

    msgElm.appendChild(msgTextElm);

    checkout.prepend(msgElm);
  }

  /**
   * Validate form function
   * @param {function} callback
   * @return {void} null
   */
  function validateForm(callback) {
      let validated = true;
      const reqElm = form.querySelectorAll('[required]');
      const patternElm = form.querySelectorAll('[required][data-pattern]');
      let wrongs = [];

      // Check required elements
      reqElm.forEach((item) => {
        item.classList.remove('error');

        if (item.value === '' || item.value === null) {
          wrongs.push(item.name);
          item.className += ' error';
          validated = false;
        }
      });

      // Check elements with specific patterns
      patternElm.forEach((item) => {
        let pattern = '';
        const itemPattern = item.dataset.validationPattern;
        const itemVal = item.value;

        switch (itemPattern) {
          case 'email':
              pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          break;
          case 'creditcard':
              pattern = /[0-9]{4}[\-][0-9]{4}[\-][0-9]{4}[\-][0-9]{4}$/;
          break;
        }

        if (!pattern.test(itemVal)) {
          item.className += ' error';
          wrongs.push(item.name + '(invalid)');
        }
      });

      if (validated) {
          return callback();
      } else {
          let nameList = '';
          let msgText = 'Coś poszło nie tak. Sprawdź jeszcze pola: ';

          for (let i = 0, wrong; wrong = wrongs[i]; i++) {
              nameList += '<li>' + wrong + '</li>';
          }

          displayMessage('error', msgText + '<ul>' + nameList + '</ul>');
      }
  }

  // Add onSubmit event to form
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    validateForm(function() {
      displayMessage('success', 'Dane zostały wysłane.');
    });
  });

  /**
   * Clone image function
   */
  function cloneImage() {
      const clone = image.cloneNode(true);
      destination.appendChild(clone);
  }

  // Add event to button
  button.addEventListener('click', cloneImage);
})();

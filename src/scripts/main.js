'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';
const body = document.body;

body.insertAdjacentHTML('beforeend', '<ul></ul>');

const ul = body.querySelector('ul');

getPhones()
  .then(phones => {
    const phonesWithDetails = phones.map(phone => {
      getPhonesDetails(getPhones).then(details => {
        phone.details = details.find(phoneDetails => {
          return phoneDetails.name === phone.name;
        });
      });

      return phone;
    });

    phonesWithDetails.forEach(phoneWithDetails => {
      ul.insertAdjacentHTML('beforeend', `
    <li>
      ${phoneWithDetails.name};
    </li>
  `);
    });
  });

function getPhones() {
  return fetch(`${url}.json`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(Error(`
          <div>
            ${response.status} - ${url}.json Not found
          </div>
        `));
      }

      return response.json();
    })
    .catch(error => setTimeout(() => {
      body.insertAdjacentHTML('beforeend', `${error}`);
    }, 5000));
}

function getPhonesDetails(callback) {
  return callback()
    .then(phones => phones.map(phone => phone.id))
    .then(ids => {
      return ids.map(id => {
        return fetch(`${url}/${id}.json`)
          .then(response => {
            if (!response.ok) {
              return Promise.reject(Error(`
                <div>
                  ${response.status} - ${url}/${id}.json Not found
                </div>
              `));
            }

            return response.json();
          });
      });
    })
    .then(arr => {
      return Promise.all(arr);
    })
    .catch(error => {
      body.insertAdjacentHTML('beforeend', `${error}`);
    });
}

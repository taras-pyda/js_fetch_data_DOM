'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';
const body = document.body;
const phonesIds = getPhones()
  .then(phones => {
    return phones.map(phone => phone.id);
  });

body.insertAdjacentHTML('beforeend', '<ul></ul>');

const ul = body.querySelector('ul');
const phonesDetails = getPhonesDetails(phonesIds);

getPhones()
  .then(phones => {
    phones.map(phone => {
      ul.insertAdjacentHTML('beforeend', `
        <li>
          ${phone.name};
        </li>
      `);

      phonesDetails.then(details => {
        phone.details = details.find(phoneDetails => {
          return phoneDetails.name === phone.name;
        });
      });
    });
  });

getPhones()
  .then(phones => {
    const phonesWithDetails = phones.map(phone => {
      phonesDetails.then(details => {
        phone.details = details.find(phoneDetails => {
          return phoneDetails.name === phone.name;
        });
      });

      return phone;
    });

    return phonesWithDetails;
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

function getPhonesDetails(idsArr) {
  return idsArr
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

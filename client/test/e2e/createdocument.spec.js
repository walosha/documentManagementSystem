import faker from 'faker';
import config from './config';

module.exports = {
  'Create document': (browser) => {
    browser
     .url(config.url)
     .waitForElementVisible('body')
     .setValue('input[type=email]', 'akinrelesimi@gmail.com')
     .setValue('input[type=password]', 'password')
     .click('button[type=submit]')
     .assert.urlContains('dashboard')
     .waitForElementVisible('body')
     .assert.elementPresent('#createdocument')
     .element('css selector', '.btn')
     .moveToElement('.btn', 0, 0)
     .mouseButtonClick(0)
     .waitForElementVisible('input[name=title]')
     .waitForElementVisible('select[id="access"]')
     .setValue('input[name=title]', faker.lorem.word())
     .click('select[id="access"] option[value="private"]')
     .execute(`tinyMCE.activeEditor.setContent('${faker.lorem.words()}')`)
     .click('button[id="sav"]')
     .end();
  }
};


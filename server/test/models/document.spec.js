/* eslint no-unused-expressions: "off"*/
import { expect } from 'chai';
import db from '../../models/index';
import helper from '../helpers/Helper';


let userInfo;
let documentData;
const document = helper.newDocument;
describe('Document model', () => {
  before((done) => {
    db.User.create(helper.docUser)
        .then((user) => {
          userInfo = user;
          document.ownerId = userInfo.id;
        });
    done();
  });
  before('createdocument', () => {
    db.Document.create(document)
           .then((doc) => {
             documentData = doc;
           });
  });

  describe('Create Document', () => {
    it('document can be created', () => {
      expect(document).to.exist;
      expect(typeof document).to.equal('object');
    });

    it('should create a document with title and content', () => {
      expect(document.title).to.equal(documentData.title);
      expect(document.content).to.equal(documentData.content);
    });

    it('should create a document with correct OwnerId', () => {
      expect(document.ownerId).to.equal(userInfo.id);
    });

    it('should create a document with published date', () => {
      expect(documentData.createdAt).to.exist;
    });

    it('should create a document with access set to public', () => {
      expect(documentData.access).to.equal('public');
    });
  });

  describe('Document Model Validations', () => {
    it('should ensure that the document title is not null', () => {
      db.Document.create(document)
      .catch((error) => {
        expect(/notNull Violation: title cannot be null/
         .test(error.message)).to.be.false;
      });
    });

    it('should expect the notNull Violation to be true', () => {
      db.Document.create(helper.invalidDocument)
      .catch((error) => {
        expect(/notNull Violation: title cannot be null/
         .test(error.message)).to.be.true;
      });
    });
  });

  describe('Document Unique title validation', () => {
    it('should expect that the document title is unique', (done) => {
      db.Document.create(document)
       .catch((error) => {
         expect(/Validation error/.test(error.message)).to.be.true;
         expect(/SequelizeUniqueConstraintError/.test(error.name)).to.be.true;
         done();
       });
    });
  });
});


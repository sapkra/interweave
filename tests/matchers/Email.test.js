import { expect } from 'chai';
import Parser from '../../lib/Parser';
import EmailMatcher from '../../lib/matchers/Email';
import { EMAIL_PATTERN } from '../../lib/constants';
import { TOKEN_LOCATIONS, createExpectedTokenLocations, parentConfig } from '../mocks';

const VALID_EMAILS = [
  'user@domain.com',
  'user.name@domain.com',
  'user+name@domain.com',
  'user123@domain.com',
  'user.name123@domain.com',
  'user+name123@domain.com',
  'user@sub.domain.com',
  'user@domain.superlongtld',
  'user@www.domain.net',
  'user@domain-name.com',
  'USER@DOMAIN123.com',
  'username@sub.domain123.whattldisthis',
  'user~with$special&chars@domain.com',
  'user#with?more|chars@domain.com',
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'email@sub-domain.example.com',
  'first.name+lastname@example.com',
  '1234567890@example.com',
  'email@example-one.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',
];

// Some of these are valid emails but I do not want to support them.
const INVALID_EMAILS = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'email.example.com',
  'email@example@example.com',
  '.email@example.com',
  'email.@example.com',
  'email..email@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example',
  'email@-example.com',
  'email@111.222.333.44444',
  'email@example..com',
  'Abc..123@example.com',
  '"(),:;<>[]@example.com',
  'this is"really"not\\\\allowed@example.com',
  'an"email"here@example.com',
  '_______@example.com',
  'much."more unusual"@example.com',
  'very.unusual."@".unusual.com@example.com',
  'very."(),:;<>[]".VERY."very@\\\\\\ "very".unusual@strange.example.com',
];

describe('matchers/Email', () => {
  const matcher = new EmailMatcher('email');
  const pattern = new RegExp(`^${EMAIL_PATTERN}$`, 'i');

  describe('does match valid email:', () => {
    VALID_EMAILS.forEach((email) => {
      it(email, () => {
        const parts = email.split('@');
        const expected = [
          email,
          parts[0],
          parts[1],
        ];
        expected.index = 0;
        expected.input = email;

        expect(email.match(pattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid email:', () => {
    INVALID_EMAILS.forEach((email) => {
      it(email, () => {
        expect(email.match(pattern)).to.equal(null);
      });
    });
  });

  describe('matches all emails in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createEmail = (email, key) => {
      const parts = email.split('@');

      return matcher.replaceWith(email, {
        emailParts: {
          username: parts[0],
          host: parts[1],
        },
        key,
      });
    };

    VALID_EMAILS.forEach((email) => {
      const expected = createExpectedTokenLocations(email, createEmail);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${email} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, email);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match('notanemail')).to.equal(null);
    });

    it('returns object for valid match', () => {
      expect(matcher.match('user@domain.com')).to.deep.equal({
        match: 'user@domain.com',
        emailParts: {
          username: 'user',
          host: 'domain.com',
        },
      });
    });
  });
});

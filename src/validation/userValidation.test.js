import UserValidation from './userValidation';

describe('UserValidation', () => {
  describe('username validation', () => {
    it('fails validation when blank', () => {
      expect(UserValidation.checkErrors('username')('')).toBeTruthy;
    });

    it('fails validation when too short', () => {
      expect(UserValidation.checkErrors('username')('abc')).toBeTruthy;
    });

    it('fails validation when too long', () => {
      expect(UserValidation.checkErrors('username')('a'.repeat(50))).toBeTruthy;
    });

    it('passes validation when right length', () => {
      expect(UserValidation.checkErrors('username')('tblakey89')).toBeFalsey;
    });
  });

  describe('email validation', () => {
    it('fails validation when blank', () => {
      expect(UserValidation.checkErrors('email')('')).toBeTruthy;
    });

    it('fails validation invalid email', () => {
      expect(UserValidation.checkErrors('email')('abc')).toBeTruthy;
    });

    it('passes validation when right length', () => {
      expect(UserValidation.checkErrors('email')('test@test.com')).toBeFalsey;
    });
  });

  describe('password validation', () => {
    it('fails validation when blank', () => {
      expect(UserValidation.checkErrors('password')('')).toBeTruthy;
    });

    it('fails validation when too short', () => {
      expect(UserValidation.checkErrors('password')('abc')).toBeTruthy;
    });

    it('fails validation when too long', () => {
      expect(UserValidation.checkErrors('password')('a'.repeat(100))).toBeTruthy;
    });

    it('passes validation when right length', () => {
      expect(UserValidation.checkErrors('password')('testtest')).toBeFalsey;
    });
  });
});

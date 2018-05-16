import SessionValidation from './sessionValidation';

describe('SessionValidation', () => {
  describe('username validation', () => {
    it('fails validation when blank', () => {
      expect(SessionValidation.checkErrors('email', '')).toBeTruthy;
    });

    it('passes validation when right length', () => {
      expect(SessionValidation.checkErrors('email', 'test@test.com')).toBeFalsey;
    });
  });
});

import GameValidation from './gameValidation';

describe('GameValidation', () => {
  describe('name validation', () => {
    it('fails validation when blank', () => {
      expect(GameValidation.checkErrors('name', '')).toBeTruthy;
    });

    it('fails validation when too short', () => {
      expect(GameValidation.checkErrors('name', 'abc')).toBeTruthy;
    });

    it('fails validation when too long', () => {
      expect(GameValidation.checkErrors('name', 'a'.repeat(50))).toBeTruthy;
    });

    it('passes validation when right length', () => {
      expect(GameValidation.checkErrors('name', 'tblakey89')).toBeFalsey;
    });
  });

  describe('user_ids validation', () => {
    it('fails validation when blank', () => {
      expect(GameValidation.checkErrors('user_ids', undefined)).toBeTruthy;
    });

    it('fails validation when empty', () => {
      expect(GameValidation.checkErrors('user_ids', [])).toBeTruthy;
    });

    it('passes validation when contains ids', () => {
      expect(GameValidation.checkErrors('user_ids', [1])).toBeFalsey;
    });
  });
});

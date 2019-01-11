import VoteValidation from './voteValidation';

describe('VoteValidation', () => {
  describe('vote validation', () => {
    it('fails validation when blank', () => {
      expect(VoteValidation.checkErrors('vote', '')).toBeTruthy;
    });

    it('passes validation when right length', () => {
      expect(VoteValidation.checkErrors('vote', '1')).toBeFalsey;
    });
  });
});

import ConversationValidation from './conversationValidation';

describe('ConversationValidation', () => {
  describe('user_ids validation', () => {
    it('fails validation when blank', () => {
      expect(ConversationValidation.checkErrors('user_ids', undefined)).toBeTruthy;
    });

    it('fails validation when empty', () => {
      expect(ConversationValidation.checkErrors('user_ids', [])).toBeTruthy;
    });

    it('passes validation when contains ids', () => {
      expect(ConversationValidation.checkErrors('user_ids', [1])).toBeFalsey;
    });
  });
});

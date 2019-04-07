import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import Conversation from '../api/conversation';
import NewChatDialog from './NewChatDialog';

jest.mock('../api/user');
jest.mock('../api/conversation');

describe('NewChatDialog', () => {
  let wrapper;
  let mockNotify;
  let mockClose;
  let button;
  let closeButton;

  beforeEach(() => {
    const user = {id: 10};
    mockNotify = jest.fn();
    mockClose = jest.fn();
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<NewChatDialog onClose={mockClose} onNotificationOpen={mockNotify} open={true} user={user} />).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    User.index.mockClear();
    Conversation.create.mockClear();
    mockNotify.mockClear();
    mockClose.mockClear();
  });

  describe('User opens dialog', () => {
    it('no errors present', () => {
      expect(wrapper.instance().showFieldError()).toBe(false);
      expect(wrapper.state().fields.user_ids).toEqual([]);
    });

    it('clicking close button triggers close function', () => {
      expect(mockClose.mock.calls.length).toEqual(0);
      closeButton = wrapper.find('#close');
      closeButton.simulate('click');
      expect(mockClose.mock.calls.length).toEqual(1);
    });

    describe('user submits without selecting any users', () => {
      beforeEach(() => {
        button.simulate('click');
      });

      it('has an error, and does not call Conversation.create', () => {
        expect(Conversation.create.mock.calls.length).toEqual(0);
        expect(wrapper.state().fields.user_ids).toEqual([]);
        expect(wrapper.instance().showFieldError('user_ids')).toBeTruthy();
        expect(mockNotify.mock.calls.length).toEqual(0);
        expect(wrapper.find('Redirect').length).toEqual(0);
      });
    });

    describe('user selects user', () => {
      let user;

      beforeEach(() => {
        user = {
          id: 1,
          username: 'test',
        };
        wrapper.instance().handleMenuChange({
          target: { value: [user] },
        });
      });

      it('updates state to include selected user_id', () => {
        expect(wrapper.state().fields.user_ids).toEqual([user]);
      });

      describe('user submits form', () => {
        beforeEach(() => {
          button.simulate('click');
        });

        it('calls conversation create', () => {
          expect(Conversation.create.mock.calls.length).toEqual(1);
        });

        describe('on successful create', () => {
          let conversationInvocationArgs;
          let conversation;

          beforeEach(() => {
            conversationInvocationArgs = Conversation.create.mock.calls[0];
            const successCallback = conversationInvocationArgs[1];
            conversation = {
              id: 10,
              messages: [],
            };
            successCallback({
              conversation: conversation,
            });
            wrapper.update();
          });

          it('adds conversation to state, notifies user, and redirects', () => {
            expect(wrapper.state().conversation).toEqual(conversation);
            expect(mockNotify.mock.calls.length).toEqual(1);
            expect(wrapper.find('Redirect').length).toEqual(1);
          });
        });
      });
    });
  });
});

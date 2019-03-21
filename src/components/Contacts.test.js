import React from 'react';
import { shallow } from 'enzyme';
import Conversation from '../api/conversation';
import User from '../api/user';
import Contacts from './Contacts';

jest.mock('../api/conversation');
jest.mock('../api/user');

describe('Contacts', () => {
  let wrapper;
  let user;

  beforeEach(() => {
    user = {
      id: 10
    }
    wrapper = shallow(<Contacts user={user} />);
  });

  afterEach(() => {
    User.index.mockClear();
    Conversation.create.mockClear();
  });

  describe('Loads up contacts when mounted', () => {
    it('shows spinner before contacts load up', () => {
      const spinner = wrapper.find('WithStyles(CircularProgress)');
      expect(spinner.length).toEqual(1);
    });

    describe('displays contacts on successCallback', () => {
      beforeEach(() => {
        const invocationArgs = User.index.mock.calls[0];
        const successCallback = invocationArgs[0];
        successCallback({
          users: [
            {username: 'test', id: 1},
            {username: 'test2', id: 2}
          ]
        });
        wrapper.update();
      });

      it('shows no spinner and shows right number of contacts', () => {
        const spinner = wrapper.find('WithStyles(CircularProgress)');
        const listItem = wrapper.find('WithStyles(ListItem)');
        expect(spinner.length).toEqual(0);
        expect(listItem.length).toEqual(2);
      });

      describe('on contact click, creates new conversation', () => {
        beforeEach(() => {
          const userLink = wrapper.find('WithStyles(ListItem)');
          userLink.first().simulate('click');
          wrapper.update();
        });

        it('conversation create is called', () => {
          expect(Conversation.create.mock.calls.length).toEqual(1);
        });

        describe('redirects to new conversation', () => {
          beforeEach(() => {
            const invocationArgs = Conversation.create.mock.calls[0];
            const successCallback = invocationArgs[1];
            successCallback({
              conversation: {
                id: 10
              }
            });
            wrapper.update();
          });

          it('shows redirect element', () => {
            const redirect = wrapper.find('Redirect');
            expect(redirect.length).toEqual(1);
          });
        });
      });
    });
  });
});

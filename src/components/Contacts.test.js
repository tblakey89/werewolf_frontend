import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router'
import Conversation from '../api/conversation';
import User from '../api/user';
import Contacts from './Contacts';

jest.mock('../api/conversation');
jest.mock('../api/user');

describe('Contacts', () => {
  const shallow = createShallow({untilSelector: 'Contacts'});
  let wrapper;
  let user;

  beforeEach(() => {
    user = {
      id: 10
    }
    wrapper = shallow(<MemoryRouter><Contacts user={user} /></MemoryRouter>);
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

        describe('goes to new conversation', () => {
          let currentHistoryLength;

          beforeEach(() => {
            currentHistoryLength = wrapper.instance().props.history.length
            const invocationArgs = Conversation.create.mock.calls[0];
            const successCallback = invocationArgs[1];
            successCallback({
              conversation: {
                id: 10
              }
            });
            wrapper.update();
          });

          it('adds to history', () => {
            expect(wrapper.instance().props.history.length).toBeGreaterThan(currentHistoryLength);
          });
        });
      });
    });
  });
});

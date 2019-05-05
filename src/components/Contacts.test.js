import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router'
import Conversation from '../api/conversation';
import Contacts from './Contacts';

jest.mock('../api/conversation');

describe('Contacts', () => {
  const shallow = createShallow({untilSelector: 'Contacts'});
  let wrapper;
  let user;
  let friends;

  beforeEach(() => {
    user = {
      id: 10
    };
    friends = [
      {
        id: 1,
        username: 'test'
      }
    ]
    wrapper = shallow(<MemoryRouter><Contacts user={user} friends={friends} /></MemoryRouter>);
  });

  afterEach(() => {
    Conversation.create.mockClear();
  });

  describe('Loads up contact component', () => {
    it('displays friends', () => {
      expect(wrapper.find('WithStyles(ListItem)').length).toEqual(1);
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

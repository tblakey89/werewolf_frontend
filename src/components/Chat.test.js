import React from 'react';
import { shallow } from 'enzyme';
import Chat from './Chat';

jest.mock('../api/user');

describe('Chat', () => {
  let wrapper;
  let mockSetAsRead;
  let user;
  let conversation;

  beforeEach(() => {
    user = {
      id: 1,
    };
    conversation = {
      id: 10,
      messages: [
        {
          id: 1,
          body: 'test',
          conversation_id: 10,
          created_at: new Date(2018, 6, 1),
          sender: user
        },
        {
          id: 2,
          body: 'test2',
          conversation_id: 10,
          created_at: new Date(2018, 3, 1),
          sender: user
        },
      ],
      unreadMessageCount: 0,
    };
    mockSetAsRead = jest.fn();
    wrapper = shallow(<Chat setAsRead={mockSetAsRead} conversation={conversation} />);
  });

  describe('loads up component', () => {
    it('displays messages in correct order', () => {
      const listItemTexts = wrapper.find('WithStyles(ListItemText)');
      expect(listItemTexts.length).toEqual(2);
      expect(listItemTexts.first().props()['secondary']).toEqual(conversation.messages[1].body);
    });

    it('does not call setAsUnread function', () => {
      expect(mockSetAsRead.mock.calls.length).toBe(0);
    });
  });

  describe('loads up component when unreadMessageCount is greater than 0', () => {
    beforeEach(() => {
      conversation = {
        messages: [],
        unreadMessageCount: 1,
      };
      wrapper = shallow(<Chat setAsRead={mockSetAsRead} conversation={conversation} />);
    });

    it('calls setAsUnread function', () => {
      expect(mockSetAsRead.mock.calls.length).toBe(1);
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import Chat from './Chat';

jest.mock('../api/user');

describe('Chat', () => {
  let wrapper;
  let mockSetAsRead;
  let user;
  let conversation;
  let channelPush;

  beforeEach(() => {
    channelPush = jest.fn();
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
      channel: {
        push: channelPush,
      },
    };
    mockSetAsRead = jest.fn();
    wrapper = shallow(<Chat setAsRead={mockSetAsRead} conversation={conversation} />);
  });

  afterEach(() => {
    channelPush.mockClear();
  });

  describe('loads up component', () => {
    it('displays messages in correct order', () => {
      const listItemTexts = wrapper.find('WithStyles(ListItemText)');
      expect(listItemTexts.length).toEqual(2);
      expect(listItemTexts.first().props()['secondary']).toEqual(conversation.messages[1].body);
      expect(channelPush.mock.calls.length).toEqual(1);
      expect(channelPush.mock.calls[0][0]).toEqual('read_conversation');
    });

    it('does not call setAsUnread function', () => {
      expect(mockSetAsRead.mock.calls.length).toBe(0);
    });
  });

  describe('loads up component when unreadMessageCount is greater than 0', () => {
    beforeEach(() => {
      const conversationCopy = { ...conversation, unreadMessageCount: 1 }
      wrapper.setProps({ conversation: conversationCopy });
    });

    it('calls setAsUnread function', () => {
      expect(mockSetAsRead.mock.calls.length).toBe(1);
      expect(channelPush.mock.calls.length).toEqual(2);
      expect(channelPush.mock.calls[1][0]).toEqual('read_conversation');
    });
  });
});

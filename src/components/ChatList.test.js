import React from 'react';
import { shallow } from 'enzyme';
import ChatList from './ChatList';

describe('ChatList', () => {
  let wrapper;
  let conversations;
  let conversationsDisplayed;
  const user = {
    username: 'currentUser',
    id: 1,
  };

  describe('when no conversations present', () => {
    beforeEach(() => {
      conversations = [];
      wrapper = shallow(shallow(<ChatList conversations={conversations} user={user}/>).get(0));
      conversationsDisplayed = wrapper.find('Link');
    });

    it('should show no conversations, but allow users to add new conversation', () => {
      expect(conversationsDisplayed.length).toEqual(0);
      expect(wrapper.find('WithStyles(ListItemText)').length).toEqual(1);
    });

    describe('when user clicks on "+"', () => {
      beforeEach(() => {
        let button = wrapper.find('WithStyles(Button)').first();
        button.simulate('click');
      });

      it('changes open state to true', () => {
        expect(wrapper.state().open).toEqual(true);
      });

      describe('when handleClose is called', () => {
        beforeEach(() => {
          wrapper.instance().handleClose();
        });

        it('changes open state back to false', () => {
          expect(wrapper.state().open).toEqual(false);
        });
      });
    });
  });

  describe('when conversations present, but no messages', () => {
    beforeEach(() => {
      conversations = [
        {
          messages: []
        }
      ];
      wrapper = shallow(shallow(<ChatList conversations={conversations} user={user}/>).get(0));
    });

    it('should show no conversations, but allow users to add new conversation', () => {
      expect(conversationsDisplayed.length).toEqual(0);
      expect(wrapper.find('WithStyles(ListItemText)').length).toEqual(1);
    });
  });

  describe('when conversations present', () => {
    beforeEach(() => {
      conversations = [
        {
          id: 1,
          messages: [{}],
          users: [
            {username: 'test', id: 3},
            {username: user.username, id: 1,},
          ],
          lastMessageAt: new Date(2018, 6, 1),
        },
        {
          id: 2,
          messages: [{}],
          users: [
            {username: 'test2', id: 2},
            {username: user.username, id: 1},
          ],
          lastMessageAt: new Date(2018, 7, 1),
        },
      ];
      wrapper = shallow(shallow(<ChatList conversations={conversations} user={user}/>).get(0));
    });

    it('displays messages in right order with right name, right number of list items', () => {
      const listItems = wrapper.find('WithStyles(ListItemText)');
      expect(listItems.first().props().primary.props.children).toEqual('test2');
      expect(listItems.length).toEqual(2);
    });
  });
});

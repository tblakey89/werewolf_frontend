import React from 'react';
import { shallow } from 'enzyme';
import MessageIcon from '@material-ui/icons/Message';
import FooterButtons from './FooterButtons';

describe('FooterButtons', () => {
  let wrapper;
  let unreadMessageCount;

  beforeEach(() => {
    unreadMessageCount = 10;
    wrapper = shallow(shallow(<FooterButtons unreadMessageCount={unreadMessageCount}/>).get(0));
  });

  describe('renderIconWithBadge', () => {
    it('displays correct number on badge when between 0 and 99', () => {
      expect(wrapper.instance().renderIconWithBadge(MessageIcon, unreadMessageCount).props.badgeContent).toEqual(unreadMessageCount)
    });

    it('displays no badge when no unread messages', () => {
      expect(wrapper.instance().renderIconWithBadge(MessageIcon, 0).props.badgeContent).toEqual(undefined)
    });

    it('displays no badge when no unread messages', () => {
      expect(wrapper.instance().renderIconWithBadge(MessageIcon, 100).props.badgeContent).toEqual('99+')
    });
  });
});

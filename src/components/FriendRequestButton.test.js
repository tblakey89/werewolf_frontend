import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import FriendRequestButton from './FriendRequestButton';
import FriendRequest from '../api/friendRequest';

jest.mock('../api/friendRequest');

describe('FriendRequestButton', () => {
  const shallow = createShallow();
  let wrapper;
  let friends;
  let friendId;

  beforeEach(() => {
    friends = {
      1: {id: 1},
      2: {id: 2},
    };
    friendId = 3;

    wrapper = shallow(<FriendRequestButton friends={friends} friendId={friendId}/>);
  });

  afterEach(() => {
    FriendRequest.create.mockClear();
  });

  describe('loads FriendRequestButton component', () => {
    it('shows the button when user not friend', () => {
      expect(wrapper.find('WithStyles(IconButton)').length).toEqual(1);
    });

    describe('when button is clicked, friendRequest is sent', () => {
      beforeEach(() => {
        wrapper.find('WithStyles(IconButton)').simulate('click');
        wrapper.update();
      });

      it('calls friendRequest create', () => {
        expect(FriendRequest.create.mock.calls.length).toEqual(1);
      });
    });

    describe('when currently friends', () => {
      beforeEach(() => {
        wrapper.setProps({friendId: 2});
        wrapper.update();
      });

      it('does not show the button', () => {
        expect(wrapper.find('WithStyles(IconButton)').length).toEqual(0);
      });
    });
  });
});

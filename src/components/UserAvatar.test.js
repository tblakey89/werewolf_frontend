import React from 'react';
import { shallow } from 'enzyme';
import UserAvatar from './UserAvatar';

describe('UserAvatar', () => {
  let wrapper;
  let user;
  let currentUser;

  beforeEach(() => {
    user = {
      id: 1,
      avatar: 'fake.png'
    };

    currentUser = {
      id: 2,
      avatar: 'fake2.png'
    };

    wrapper = shallow(<UserAvatar user={user} currentUser={currentUser}/>);
  });

  describe('loads UserAvatar component', () => {
    it('has the Avatar component included', () => {
      expect(wrapper.find('WithStyles(Avatar)').length).toEqual(1);
    });

    describe('when user and currentUser are different', () => {
      it('shows the currentUsers avatar', () => {
        expect(wrapper.instance().currentUser()).toEqual(currentUser);
      });
    });

    describe('when the user and currentUser have same id, uses user avatar', () => {
      beforeEach(() => {
        currentUser = {
          id: 1,
          avatar: 'fake2.png'
        };

        wrapper = shallow(<UserAvatar user={user} currentUser={currentUser}/>);
      });

      it('shows the users avatar', () => {
        expect(wrapper.instance().currentUser().avatar).toEqual(user.avatar);
      });
    });

    describe('when user has no avatar', () => {
      beforeEach(() => {
        currentUser = {
          id: 1,
          avatar: null
        };

        wrapper = shallow(<UserAvatar user={currentUser} currentUser={currentUser}/>);
      });

      it('shows accountCircle icon', () => {
        expect(wrapper.find('pure(AccountCircle)').length).toEqual(1);
      });
    });

    describe('when user has no avatar', () => {
      beforeEach(() => {
        wrapper = shallow(<UserAvatar user={currentUser} currentUser={null}/>);
      });

      it('shows accountCircle icon', () => {
        expect(wrapper.find('pure(Notifications)').length).toEqual(1);
      });
    });
  });
});

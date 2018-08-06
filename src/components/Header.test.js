import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('Header', () => {
  let wrapper;

  beforeEach(() => {
    const invitations = [
      {id: 1},
      {id: 2},
    ]
    wrapper = shallow(shallow(<Header invitations={invitations}/>).get(0));
  });

  describe('Header component', () => {
    describe('when invitations present', () => {
      it('shows correct number of invitations', () => {
        const badges = wrapper.find('WithStyles(Badge)');
        expect(badges.length).toEqual(1);
        expect(badges.first().props()['badgeContent']).toEqual(2);
      });
    });

    describe('when no invitations present', () => {
      beforeEach(() => {
        wrapper.setProps({ invitations: [] });
      });

      it('shows correct number of invitations', () => {
        expect(wrapper.find('WithStyles(Badge)').length).toEqual(0);
      });
    });
  });
});

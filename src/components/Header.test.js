import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router'
import Header from './Header';

describe('Header', () => {
  const shallow = createShallow({untilSelector: 'Header'});
  let wrapper;

  beforeEach(() => {
    const invitations = [
      {id: 1},
      {id: 2},
    ]
    wrapper = shallow(<MemoryRouter><Header invitations={invitations}/></MemoryRouter>);
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

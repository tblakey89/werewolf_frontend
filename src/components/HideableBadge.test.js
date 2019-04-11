import React from 'react';
import { shallow } from 'enzyme';
import HideableBadge from './HideableBadge';

describe('HideableBadge', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HideableBadge invisible={false}><div/></HideableBadge>);
  });

  describe('loads HideableBadge component', () => {
    it('has the Badge component included', () => {
      expect(wrapper.find('WithStyles(Badge)').length).toEqual(1);
      expect(wrapper.find('div').length).toEqual(1);
    });

    describe('when invisible is set to true', () => {
      beforeEach(() => {
        wrapper.setProps({invisible: true});
      });

      it('has no Badge component included', () => {
        expect(wrapper.find('WithStyles(Badge)').length).toEqual(0);
        expect(wrapper.find('div').length).toEqual(1);
      });
    });
  });
});

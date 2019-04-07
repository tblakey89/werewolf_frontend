import React from 'react';
import { shallow } from 'enzyme';
import Timer from './Timer';

describe('Timer', () => {
  let wrapper;
  let endPhaseTime;

  Date.now = jest.fn().mockReturnValue(1000);

  beforeEach(() => {
    endPhaseTime = 1000 + Date.now();
    wrapper = shallow(<Timer endPhaseTime={endPhaseTime} />);
  });

  describe('Timer is loaded correctly', () => {
    it('shows right time remaining', () => {
      expect(wrapper.find('span').text()).toEqual('00:00:01');
    });
  });
});

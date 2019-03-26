import React from 'react';
import { shallow } from 'enzyme';
import DurationSelect from './DurationSelect';

describe('DurationSelect', () => {
  let wrapper;
  let mockOnChange;
  let duration;

  beforeEach(() => {
    mockOnChange = jest.fn();
    duration = 'day';
    wrapper = shallow(shallow(
      <DurationSelect
        duration={duration}
        onChange={mockOnChange}
      />
    ).get(0));
  });

  afterEach(() => {
    mockOnChange.mockClear();
  });

  describe('DurationSelect is mounted', () => {
    it('shows four options', () => {
      expect(wrapper.find('WithStyles(MenuItem)').length).toEqual(4);
    });

    describe('user selects duration', () => {
      let input;
      let event;

      beforeEach(() => {
        input = wrapper.find('WithStyles(Select)');
        event = {
          target: { value: ['five_minute'] },
        };
        input.simulate('change', event);
      });

      it('calls on change function', () => {
        expect(mockOnChange.mock.calls.length).toEqual(1);
        expect(mockOnChange.mock.calls[0][0]).toEqual(event);
      });
    });
  });
});

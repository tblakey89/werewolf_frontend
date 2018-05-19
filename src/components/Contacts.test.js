import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import Contacts from './Contacts';

jest.mock('../api/user');

describe('Contacts', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Contacts />);
  });

  afterEach(() => {
    User.index.mockClear();
  });

  describe('Loads up contacts when mounted', () => {
    it('shows spinner before contacts load up', () => {
      const spinner = wrapper.find('WithStyles(CircularProgress)');
      expect(spinner.length).toEqual(1);
    });

    describe('displays contacts on successCallback', () => {
      beforeEach(() => {
        const invocationArgs = User.index.mock.calls[0];
        const successCallback = invocationArgs[0];
        successCallback({
          users: [
            {username: 'test', id: 1},
            {username: 'test2', id: 2}
          ]
        });
        wrapper.update();
      });

      it('shows no spinner and shows right number of contacts', () => {
        const spinner = wrapper.find('WithStyles(CircularProgress)');
        const listItem = wrapper.find('WithStyles(ListItem)');
        expect(spinner.length).toEqual(0);
        expect(listItem.length).toEqual(2);
      });
    });
  });
});

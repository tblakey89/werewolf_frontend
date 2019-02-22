import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import Game from '../api/game';
import EditGameDialog from './EditGameDialog';

jest.mock('../api/user');
jest.mock('../api/game');

describe('EditGameDialog', () => {
  let wrapper;
  let mockNotify;
  let mockClose;
  let button;
  let closeButton;

  beforeEach(() => {
    mockNotify = jest.fn();
    mockClose = jest.fn();
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<EditGameDialog onClose={mockClose} onNotificationOpen={mockNotify} open={true} userId={1} gameId={1} />).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    User.index.mockClear();
    Game.update.mockClear();
    mockNotify.mockClear();
    mockClose.mockClear();
  });

  describe('User opens dialog', () => {
    it('clicking close button triggers close function', () => {
      expect(mockClose.mock.calls.length).toEqual(0);
      closeButton = wrapper.find('#close');
      closeButton.simulate('click');
      expect(mockClose.mock.calls.length).toEqual(1);
    });

    describe('user selects user', () => {
      let user;

      beforeEach(() => {
        user = {
          id: 1,
          username: 'test',
        };
        wrapper.instance().handleMenuChange({
          target: { value: [user] },
        });
      });

      it('updates state to include selected user_id', () => {
        expect(wrapper.state().fields.user_ids).toEqual([user]);
      });

      describe('user submits form', () => {
        let gameInvocationArgs;
        let game;

        beforeEach(() => {
          button.simulate('click');
          gameInvocationArgs = Game.update.mock.calls[0];
          const successCallback = gameInvocationArgs[2];
          successCallback();
          wrapper.update();
        });

        it('adds game to state, notifies user, and redirects', () => {
          expect(Game.update.mock.calls.length).toEqual(1);
          expect(mockNotify.mock.calls.length).toEqual(1);
        });
      });
    });
  });
});

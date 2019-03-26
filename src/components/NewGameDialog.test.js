import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import Game from '../api/game';
import NewGameDialog from './NewGameDialog';

jest.mock('../api/user');
jest.mock('../api/game');

describe('NewGameDialog', () => {
  let wrapper;
  let mockNotify;
  let mockClose;
  let button;
  let closeButton;

  beforeEach(() => {
    mockNotify = jest.fn();
    mockClose = jest.fn();
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<NewGameDialog onClose={mockClose} onNotificationOpen={mockNotify} open={true} userId={1} />).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    User.index.mockClear();
    Game.create.mockClear();
    mockNotify.mockClear();
    mockClose.mockClear();
  });

  describe('User opens dialog', () => {
    it('no errors present', () => {
      expect(wrapper.instance().showFieldError()).toBe(false);
      expect(wrapper.state().fields.user_ids).toEqual([]);
    });

    it('clicking close button triggers close function', () => {
      expect(mockClose.mock.calls.length).toEqual(0);
      closeButton = wrapper.find('#close');
      closeButton.simulate('click');
      expect(mockClose.mock.calls.length).toEqual(1);
    });

    describe('user submits without entering a name', () => {
      beforeEach(() => {
        button.simulate('click');
      });

      it('has an error, and does not call Game.create', () => {
        expect(Game.create.mock.calls.length).toEqual(0);
        expect(wrapper.instance().showFieldError('name')).toBeTruthy();
        expect(mockNotify.mock.calls.length).toEqual(0);
      });
    });

    describe('user selects user', () => {
      let user;

      beforeEach(() => {
        user = {
          id: 1,
          username: 'test',
        };
        wrapper.instance().handleContactMenuChange({
          target: { value: [user] },
        });
      });

      it('updates state to include selected user_id', () => {
        expect(wrapper.state().fields.user_ids).toEqual([user]);
      });

      describe('user inputs name', () => {
        let input;
        let gameName;

        beforeEach(() => {
          gameName = 'cool game'
          input = wrapper.find('#nameInput').first();
          input.simulate('change', {
            target: { value: gameName },
          });
        });

        it('updates state to include name', () => {
          expect(wrapper.state().fields.name).toEqual(gameName);
        });

        describe('user submits form', () => {
          beforeEach(() => {
            button.simulate('click');
          });

          it('calls game create', () => {
            expect(Game.create.mock.calls.length).toEqual(1);
          });

          describe('on successful create', () => {
            let gameInvocationArgs;
            let game;

            beforeEach(() => {
              gameInvocationArgs = Game.create.mock.calls[0];
              const successCallback = gameInvocationArgs[1];
              game = {
                id: 10,
                name: gameName,
                token: 'randomString',
              };
              successCallback({...game});
              wrapper.update();
            });

            it('adds game to state, notifies user, and redirects', () => {
              expect(wrapper.state().game).toEqual(game);
              expect(mockNotify.mock.calls.length).toEqual(1);
              expect(wrapper.find('#close').length).toEqual(0);
              expect(wrapper.find('#gameLink').length).toEqual(1);
              expect(wrapper.find('b').text()).toEqual(expect.stringContaining(game.token));
            });

            describe('when game link clicked', () => {
              it('closes the dialog', () => {
                const gameLink = wrapper.find('#gameLink');
                gameLink.simulate('click');
                expect(mockClose.mock.calls.length).toEqual(1);
              });
            });
          });
        });
      });
    });
  });
});

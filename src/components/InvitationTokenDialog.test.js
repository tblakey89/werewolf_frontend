import React from 'react';
import { shallow } from 'enzyme';
import Invitation from '../api/invitation';
import InvitationTokenDialog from './InvitationTokenDialog';

jest.mock('../api/invitation');

describe('InvitationTokenDialog', () => {
  let wrapper;

  beforeEach(() => {
    const token = "testToken";
    wrapper = shallow(shallow(shallow(shallow(shallow(<InvitationTokenDialog token={token}/>).get(0)).get(0)).get(0)).get(0));
  });

  afterEach(() => {
    Invitation.show.mockClear();
    Invitation.create.mockClear();
  });

  describe('User opens dialog', () => {
    it('calls Invitation show', () => {
      expect(Invitation.show.mock.calls.length).toBe(1);
    });

    describe('when show returns an error', () => {
      let errorMessage;

      beforeEach(() => {
        const invocationArgs = Invitation.show.mock.calls[0];
        errorMessage = 'This is the error message';
        const errorCallback = invocationArgs[2];
        errorCallback({
          error: errorMessage,
        });
        wrapper.update();
      });

      it('shows the message in the title', () => {
        expect(wrapper.find('WithStyles(DialogTitle)').render().text()).toEqual(errorMessage);
      });

      describe('when user clicks close button', () => {
        beforeEach(() => {
          wrapper.find('#close').simulate('click');
          wrapper.update();
        });

        it('shows a redirect', () => {
          expect(wrapper.find('Redirect').length).toEqual(1);
        });
      });
    });

    describe('when invitation found', () => {
      let gameName;

      beforeEach(() => {
        const invocationArgs = Invitation.show.mock.calls[0];
        const successCallback = invocationArgs[1];
        gameName = 'test game name'
        successCallback({
          name: gameName,
        });
        wrapper.update();
      });

      it('shows game name in title', () => {
        expect(wrapper.find('WithStyles(DialogTitle)').render().text()).toEqual(expect.stringContaining(gameName));
      });

      describe('clicking accept calls Invitation create', () => {
        beforeEach(() => {
          wrapper.find('#submit').simulate('click');
        });

        it('has called Invitation create', () => {
          expect(Invitation.create.mock.calls.length).toEqual(1);
        });

        describe('when callback is called, redirects to game page', () => {
          let gameId;

          beforeEach(() => {
            const invocationArgs = Invitation.create.mock.calls[0];
            const successCallback = invocationArgs[1];
            gameId = 10;
            successCallback({
              game_id: gameId,
            });
            wrapper.update();
          });

          it('redirects to the game page', () => {
            const redirect = wrapper.find('Redirect');
            expect(redirect.length).toEqual(1);
            expect(redirect.props().to).toEqual(`/game/${gameId}`);
          });
        });
      });

      describe(('when close button is clicked'), () => {
        beforeEach(() => {
          wrapper.find('#close').simulate('click');
          wrapper.update();
        });

        it('shows a redirect', () => {
          const redirect = wrapper.find('Redirect');
          expect(redirect.length).toEqual(1);
          expect(redirect.props().to).toEqual(`/games`);
        });
      });
    });
  });
});

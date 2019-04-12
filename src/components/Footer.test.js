import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';

describe('Footer', () => {
  let wrapper;

  beforeEach(() => {
    const conversations = [
      {id: 1},
      {id: 2},
    ]
    const games = [
      {id: 1},
      {id: 2},
    ]
    wrapper = shallow(<Footer conversations={conversations} games={games}/>);
  });

  describe('chat/:id renders correct conversation', () => {
    it('the render function selects correctly', () => {
      const match = { params: { id: 2 } }
      expect(wrapper.find('Route').first().props().render({match}).props.conversation.id).toEqual(2)
    });
  });

  describe('allowedToSpeak', () => {
    const user = {id: 1};
    let gamesWithPlayers;

    describe('when alive in day phase', () => {
      beforeEach(() => {
        gamesWithPlayers = [{id:1, state: { state: 'day_phase', players: {1: {alive: true}}}}];
        wrapper.setProps({games: gamesWithPlayers, user: user});
      });

      it('should return true', () => {
        expect(wrapper.instance().allowedToSpeak(gamesWithPlayers[0])).toEqual(true);
      });
    });

    describe('when dead in day phase', () => {
      beforeEach(() => {
        gamesWithPlayers = [{id:1, state: { state: 'day_phase', players: {1: {alive: false}}}}];
        wrapper.setProps({games: gamesWithPlayers, user: user});
      });

      it('should return false', () => {
        expect(wrapper.instance().allowedToSpeak(gamesWithPlayers[0])).toEqual(false);
      });
    });

    describe('when dead in game_over phase', () => {
      beforeEach(() => {
        gamesWithPlayers = [{id:1, state: { state: 'game_over', players: {1: {alive: true}}}}];
        wrapper.setProps({games: gamesWithPlayers, user: user});
      });

      it('should return true', () => {
        expect(wrapper.instance().allowedToSpeak(gamesWithPlayers[0])).toEqual(true);
      });
    });
  });
});

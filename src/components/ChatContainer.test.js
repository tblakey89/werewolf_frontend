import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import userChannel from '../sockets/userChannel';
import conversationChannel from '../sockets/conversationChannel';
import gameChannel from '../sockets/gameChannel';
import ChatContainer from './ChatContainer';

jest.mock('../api/user');
jest.mock('../sockets/userChannel');
jest.mock('../sockets/conversationChannel');
jest.mock('../sockets/gameChannel');

describe('ChatContainer', () => {
  let wrapper;
  let mockNotify;

  beforeEach(() => {
    mockNotify = jest.fn();
    wrapper = shallow(<ChatContainer onNotificationOpen={mockNotify}/>);
  });

  afterEach(() => {
    User.me.mockClear();
    userChannel.join.mockClear();
    conversationChannel.join.mockClear();
    gameChannel.join.mockClear();
  });

  describe('Loads up user\'s account when mounted', () => {
    it('shows spinner before user loaded up', () => {
      const spinner = wrapper.find('WithStyles(CircularProgress)');
      expect(spinner.length).toEqual(1);
    });

    describe('user state is set on success', () => {
      let userChannelInvocationArgs;
      let conversationChannelInvocationArgs;
      let gameChannelInvocationArgs;
      let user;
      let conversationOne;
      let conversationTwo;
      let game;

      beforeEach(() => {
        conversationOne = {
          id: 11,
          messages: []
        };
        conversationTwo = {
          id: 12,
          messages: []
        };
        game = {
          id: 1,
          name: 'test game',
          users_games: [
            {
              user_id: 10,
              state: 'pending'
            }
          ],
          messages: []
        };
        user = {
          conversations: [
            conversationOne,
            conversationTwo
          ],
          games: [
            game
          ],
          id: 10,
        };
        const invocationArgs = User.me.mock.calls[0];
        const successCallback = invocationArgs[0];
        successCallback({
          user: user
        });
        wrapper.update();
        userChannelInvocationArgs = userChannel.join.mock.calls[0];
        conversationChannelInvocationArgs = conversationChannel.join.mock.calls[0];
        gameChannelInvocationArgs = gameChannel.join.mock.calls[0];
      });

      it('shows no spinner and updates state as necessary', () => {
        const spinner = wrapper.find('WithStyles(CircularProgress)');
        expect(spinner.length).toEqual(0);
        expect(userChannelInvocationArgs[1]).toEqual(user.id);
        expect(conversationChannel.join.mock.calls.length).toEqual(2);
        expect(conversationChannelInvocationArgs[1]).toEqual(conversationOne.id);
        expect(gameChannel.join.mock.calls.length).toEqual(1);
        expect(gameChannelInvocationArgs[1]).toEqual(game.id);
        expect(wrapper.state().user.id).toEqual(user.id);
        expect(wrapper.state().conversations[0].id).toEqual(conversationOne.id);
        expect(wrapper.state().games[0].pending).toEqual(true);
        expect(wrapper.state().invitations.length).toEqual(1);
      });

      describe('when a new conversation is created', () => {
        const lastMessageAt = new Date(2018, 7, 1);

        beforeEach(() => {
          const newConversationCallback = userChannelInvocationArgs[2];
          newConversationCallback({
            id: 13,
            messages: [
              {
                body: 'test',
                conversation_id: 13,
                created_at: new Date(2018, 6, 1),
                sender: user
              },
              {
                body: 'test2',
                conversation_id: 13,
                created_at: new Date(2018, 7, 1),
                sender: user
              }
            ]
          });
          wrapper.update();
        });

        it('adds another conversation to the state', () => {
          expect(wrapper.state().conversations.length).toEqual(3);
          expect(wrapper.state().conversations[2].lastMessageAt).toEqual(lastMessageAt);
        });
      });

      describe('when a new game is created', () => {
        beforeEach(() => {
          const newGameCallback = userChannelInvocationArgs[3];
          newGameCallback({
            id: 2,
            name: 'test game 2',
            users_games: [
              {
                user_id: 10,
                state: 'pending'
              }
            ],
            messages: []
          });
          wrapper.update();
        });

        it('adds another game to the state', () => {
          expect(wrapper.state().games.length).toEqual(2);
        });
      });

      describe('when a new message is received from own account', () => {
        const createdAt = new Date(2018, 7, 1);

        beforeEach(() => {
          const newMessageCallback = conversationChannelInvocationArgs[2];
          newMessageCallback({
            body: 'test',
            conversation_id: conversationOne.id,
            created_at: createdAt,
            sender: user
          });
          wrapper.update();
        });

        it('adds another message to the first conversation', () => {
          expect(wrapper.state().conversations[0].messages.length).toEqual(1);
          expect(wrapper.state().conversations[0].lastMessageAt).toEqual(createdAt);
          expect(wrapper.state().conversations[0].unreadMessageCount).toEqual(1);
          expect(mockNotify.mock.calls.length).toBe(0);
        });

        describe('when a new message is received from other account', () => {
          beforeEach(() => {
            const newMessageCallback = conversationChannelInvocationArgs[2];
            newMessageCallback({
              body: 'test',
              conversation_id: conversationOne.id,
              created_at: new Date(2018, 8, 1),
              sender: {
                id: 2,
                username: 'tester'
              }
            });
            wrapper.update();
          });

          it('adds another message to the first conversation', () => {
            expect(wrapper.state().conversations[0].messages.length).toEqual(2);
            expect(wrapper.state().conversations[0].lastMessageAt).not.toEqual(createdAt);
            expect(wrapper.state().conversations[0].unreadMessageCount).toEqual(2);
            expect(mockNotify.mock.calls.length).toBe(1);
          });
        });

        describe('when setAsRead is called', () => {
          beforeEach(() => {
            const instance = wrapper.instance();
            instance.setConversationAsRead(conversationOne);
          });

          it('sets unread message count to 0', () => {
            expect(wrapper.state().conversations[0].unreadMessageCount).toEqual(0);
          });
        });
      });

      describe('when game is updated', () => {
        beforeEach(() => {
          const updateGameCallback = userChannelInvocationArgs[4];
          updateGameCallback({
            id: 1,
            name: 'test game',
            users_games: [
              {
                user_id: 10,
                state: 'accepted'
              }
            ],
            messages: []
          });
          wrapper.update();
        });

        it('replaces the old state of the game with new state and notifies user', () => {
          expect(wrapper.state().games[0].pending).toEqual(false);
          expect(wrapper.state().invitations.length).toEqual(0);
        });
      });

      describe('when a new game message is received from own account', () => {
        const createdAt = new Date(2018, 7, 1);

        beforeEach(() => {
          const newGameMessageCallback = gameChannelInvocationArgs[2];
          newGameMessageCallback({
            body: 'test',
            game_id: game.id,
            created_at: createdAt,
            sender: user
          });
          wrapper.update();
        });

        it('adds another message to the first game', () => {
          expect(wrapper.state().games[0].messages.length).toEqual(1);
          expect(wrapper.state().games[0].lastMessageAt).toEqual(createdAt);
          expect(wrapper.state().games[0].unreadMessageCount).toEqual(1);
          expect(mockNotify.mock.calls.length).toBe(0);
        });

        describe('when a new game message is received from other account', () => {
          beforeEach(() => {
            const newGameMessageCallback = gameChannelInvocationArgs[2];
            newGameMessageCallback({
              body: 'test',
              game_id: game.id,
              created_at: new Date(2018, 8, 1),
              sender: {
                id: 2,
                username: 'tester'
              }
            });
            wrapper.update();
          });

          it('adds another message to the first game', () => {
            expect(wrapper.state().games[0].messages.length).toEqual(2);
            expect(wrapper.state().games[0].lastMessageAt).not.toEqual(createdAt);
            expect(wrapper.state().games[0].unreadMessageCount).toEqual(2);
            expect(mockNotify.mock.calls.length).toBe(1);
          });
        });

        describe('when a new game message is received from bot', () => {
          let botMessage = 'test';
          beforeEach(() => {
            const newGameMessageCallback = gameChannelInvocationArgs[2];
            newGameMessageCallback({
              body: botMessage,
              game_id: game.id,
              created_at: new Date(2018, 8, 1),
              bot: true
            });
            wrapper.update();
          });

          it('adds another message to the first game', () => {
            expect(wrapper.state().games[0].messages.length).toEqual(2);
            expect(wrapper.state().games[0].lastMessageAt).not.toEqual(createdAt);
            expect(wrapper.state().games[0].unreadMessageCount).toEqual(2);
            expect(mockNotify.mock.calls.length).toBe(1);
          });
        });

        describe('when setAsRead is called', () => {
          beforeEach(() => {
            const instance = wrapper.instance();
            instance.setGameAsRead(game);
          });

          it('sets unread message count to 0', () => {
            expect(wrapper.state().games[0].unreadMessageCount).toEqual(0);
          });
        });
      });
    });
  });
});

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import FooterButtons from './FooterButtons';
import ChatInput from './ChatInput';

class Footer extends Component {
  render() {
    return (
      <Switch>
        <Route
          path='/chat/:id'
          render={({ match }) => {
            const conversation = this.props.conversations.find((conversation) =>
              conversation.id === parseInt(match.params.id, 10)
            );

            return (<ChatInput conversation={conversation} />);
          }}
        />
        <Route
          path='/game/:id'
          render={({ match }) => {
            const game = this.props.games.find((game) =>
              game.id === parseInt(match.params.id, 10)
            );

            return (<ChatInput conversation={game} />);
          }}
        />
        <Route>
          <FooterButtons
            unreadMessageCount={this.props.unreadMessageCount}
            unreadGameMessageCount={this.props.unreadGameMessageCount}
          />
        </Route>
      </Switch>
    );
  }
}

export default Footer;

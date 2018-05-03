import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';

class Chat extends Component {
  render() {
    return (
      <List>
        <ListItem>
          <Avatar>
            <AccountCircle style={{ fontSize: 36 }} />
          </Avatar>
          <ListItemText
            primary="Thomas Blakey"
            secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed risus turpis, sodales sit amet turpis quis, consequat ultricies est. Maecenas bibendum ligula non mattis ultricies. Morbi rutrum nisi erat, eu cursus lectus molestie id. Etiam id tincidunt elit."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Giang Blakey"
            secondary="Cras nisi dolor, euismod eu dapibus eu, mollis vel lacus. Vestibulum quis massa quis risus consequat euismod at non ipsum. Vestibulum quis porta tellus. Ut vestibulum egestas lacus, ut tincidunt nisi ultrices eget. Suspendisse auctor venenatis arcu et condimentum. Aliquam sed blandit ex. Proin quis neque in odio convallis ullamcorper. Nam posuere tincidunt purus."
          />
          <Avatar>
            <AccountCircle style={{ fontSize: 36 }} />
          </Avatar>
        </ListItem>
        <ListItem>
          <Avatar>
            <AccountCircle style={{ fontSize: 36 }} />
          </Avatar>
          <ListItemText
            primary="Teddy Blakey"
            secondary="Curabitur vel sodales nisi. Maecenas egestas commodo diam."
          />
        </ListItem>
      </List>
    );
  }
}

export default Chat;

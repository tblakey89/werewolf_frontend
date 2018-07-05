import React, { Component } from 'react';
import BottomNavigation, { BottomNavigationAction } from '@material-ui/core/BottomNavigation';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
    width: '100%'
  },
  textFieldInput: {
    borderRadius: 10,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
    'margin-left': '20px'
  },
});

class ChatInput extends Component {
  state = {
    message: '',
  };

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { conversation } = this.props;
    if (!conversation || this.state.message === '') return;
    conversation.channel.push('new_message', {
      body: this.state.message,
    });
    this.setState({
      message: '',
    })
  };

  render() {
    const { classes } = this.props;
    return (
      <BottomNavigation style={{'background-color': '#3f51b5'}}>
        <Grid container spacing={24} alignItems={'center'}>
          <Grid item xs={10}>
            <form onSubmit={this.handleFormSubmit}>
              <FormControl fullWidth>
                <TextField
                  id="chatInput"
                  InputProps={{
                    disableUnderline: true,
                    classes: {
                      root: classes.textFieldRoot,
                      input: classes.textFieldInput,
                    },
                  }}
                  onChange={this.handleChange}
                  value={this.state.message}
                />
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={1}>
            <SendIcon
              style={{ fontSize: 36, color: 'white' }}
              onClick={this.handleFormSubmit}
            />
          </Grid>
        </Grid>
      </BottomNavigation>
    );
  }
}

export default withStyles(styles)(ChatInput);

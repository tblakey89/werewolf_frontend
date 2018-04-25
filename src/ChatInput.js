import React, { Component } from 'react';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SendIcon from '@material-ui/icons/Send';
import Grid from 'material-ui/Grid';

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

function ChatInput(props) {
  const { classes } = props;
  return (
    <BottomNavigation style={{'background-color': '#3f51b5'}}>
        <Grid container spacing={24} alignItems={'center'}>
          <Grid item xs={10}>
            <FormControl fullWidth>
              <TextField
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.textFieldRoot,
                    input: classes.textFieldInput,
                  },
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <SendIcon style={{ fontSize: 36, color: 'white' }} />
          </Grid>
        </Grid>
    </BottomNavigation>
  );
}

ChatInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatInput);

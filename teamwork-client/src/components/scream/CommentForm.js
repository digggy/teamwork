import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

//MUI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = (theme) => ({
  ...theme,
});

class CommentForm extends Component {
  state = {
    body: "",
    errors: {},
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSumbit = (event) => {
    event.preventDefault();
    const newScream = { body: this.state.body };
    this.props.submitComment(this.props.screamId, newScream);
    // if (!this.state.errors) {
    //   this.setState({ body: "" });
    // }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "" });
    }
  }

  render() {
    const { authenticated, classes } = this.props;
    const { errors, body } = this.state;
    const commentInputMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSumbit}>
          <TextField
            name="body"
            type="text"
            label="Comment on scream"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            onChange={this.handleChange}
            value={body}
            className={classes.textField}
            fullWidth
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <hr className={classes.visibleSeperator} />
      </Grid>
    ) : null;
    return commentInputMarkup;
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

CommentForm.propTypes = {
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  screamID: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);

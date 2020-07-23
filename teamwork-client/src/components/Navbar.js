import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI Imports
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

//Icons

import AddIcon from "@material-ui/icons/Add";
import Home from "@material-ui/icons/Home";
import Notifications from "@material-ui/icons/Notifications";

// Redux
import { connect } from "react-redux";
import { Tooltip } from "@material-ui/core";

// Utils
import CustomButton from "../utils/CustomButton";

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <React.Fragment>
              <CustomButton tipTitle={"Post a scream"}>
                <AddIcon />
              </CustomButton>
              <Link to="/">
                <CustomButton tipTitle={"Home"}>
                  <Home />
                </CustomButton>
              </Link>
              <CustomButton tipTitle={"Notification"}>
                <Notifications />
              </CustomButton>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Navbar);

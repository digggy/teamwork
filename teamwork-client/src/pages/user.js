import React, { Component } from "react";
import PropTypes from "prop-types";
import Scream from "../components/scream/Scream";
import StaticProfile from "../components/profile/StaticProfile";

import axios from "axios";

// MUI
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    screamIdParam: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;
    if (screamId) {
      this.setState({
        screamIdParam: screamId,
      });
    }
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { screams, loading } = this.props.data;
    const { screamIdParam } = this.state;
    const screamsMarkup = loading ? (
      <p>Loading ....</p>
    ) : screams === null ? (
      <p>No screams from the user</p>
    ) : !screamIdParam ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      screams.map((scream) => {
        if (scream.screamId !== screamIdParam) {
          return <Scream key={scream.screamId} scream={scream} />;
        } else {
          return <Scream key={scream.screamId} scream={scream} openDialog />;
        }
      })
    );
    const profileSection =
      this.state.profile === null ? (
        <p>Loading Profile ...</p>
      ) : (
        <StaticProfile profile={this.state.profile} />
      );
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {profileSection}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

user.propTypes = {
  data: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getUserData })(user);

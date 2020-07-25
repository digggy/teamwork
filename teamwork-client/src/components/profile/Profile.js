import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
import CustomButton from "../../utils/CustomButton";

//Redux
import { connect } from "react-redux";
import {
  logoutUser,
  uploadProfileImage,
} from "../../redux/actions/userActions";

//MUI stuffs
import Button from "@material-ui/core/Button";

import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";

//Icons
import EditIcon from "@material-ui/icons/Edit";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

const styles = (theme) => ({ ...theme });

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    // Send the image to the server
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadProfileImage(formData);
  };

  handleEditPicture() {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  }

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} className="profile-image" alt="profile"></img>
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <CustomButton
                tipTitle="Edit Profile Picture"
                btnClassName="button"
                placement="top"
                onClick={this.handleEditPicture}
              >
                <EditIcon color="primary" />
              </CustomButton>
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="primary"
                variant="h5"
              >
                @{handle}
              </MuiLink>
              <hr />
              {bio && <Typography variant="body2"> {bio} </Typography>}
              <hr />
              {location && (
                <Fragment>
                  <LocationOn color="primary" /> <span> {location}</span>
                  <hr />
                </Fragment>
              )}
              {website && (
                <Fragment>
                  <LinkIcon color="primary" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                  <hr />
                </Fragment>
              )}
              <CalendarToday color="primary" />{" "}
              <span> Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>
            <CustomButton
              tipTitle="Logout"
              btnClassName="button"
              placement="top"
              onClick={this.handleLogout}
            >
              <KeyboardReturn color="primary" />
            </CustomButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No Profile found <br />
            Please login again 😁
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
            >
              Sign Up
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <div> Loading.... </div>
    );

    return profileMarkup;
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  uploadProfileImage: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { uploadProfileImage, logoutUser })(
  withStyles(styles)(Profile)
);

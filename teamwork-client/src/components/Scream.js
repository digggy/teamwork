import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";

// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";
import FavouriteBorder from "@material-ui/icons/FavoriteBorder";
import Favourite from "@material-ui/icons/Favorite";

//Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";
import CustomButton from "../utils/CustomButton";

//Styles for this Scream

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Scream extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.scream.screamId
      )
    )
      return true;
    else return false;
  };

  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    let likeButton = !authenticated ? (
      <CustomButton tipTitle="Like">
        <Link to="/login">
          <FavouriteBorder color="primary" />
        </Link>
      </CustomButton>
    ) : this.likedScream() ? (
      <CustomButton tipTitle="Unlike" onClick={this.unlikeScream}>
        <Favourite color="primary" />
      </CustomButton>
    ) : (
      <CustomButton tipTitle="Like" onClick={this.likeScream}>
        <FavouriteBorder color="primary" />
      </CustomButton>
    );

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          <Typography>
            {likeButton}
            <span>{likeCount}</span>
            <CustomButton tipTitle="Comments">
              <ChatIcon color="primary" />
            </CustomButton>
            <span>{commentCount} comments</span>
          </Typography>
          {/* <ScreamDialog screamId userHandle /> */}
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { likeScream, unlikeScream })(
  withStyles(styles)(Scream)
);

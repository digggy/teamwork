import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Icons
import FavouriteBorder from "@material-ui/icons/FavoriteBorder";
import Favourite from "@material-ui/icons/Favorite";

//Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../../redux/actions/dataActions";
import CustomButton from "../../utils/CustomButton";

export class LikeButton extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.screamId
      )
    )
      return true;
    else return false;
  };

  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };

  render() {
    const {
      user: { authenticated },
    } = this.props;

    const likeButton = !authenticated ? (
      <Link to="/login">
        <CustomButton tipTitle="Like">
          <FavouriteBorder color="primary" />
        </CustomButton>
      </Link>
    ) : this.likedScream() ? (
      <CustomButton tipTitle="Unlike" onClick={this.unlikeScream}>
        <Favourite color="primary" />
      </CustomButton>
    ) : (
      <CustomButton tipTitle="Like" onClick={this.likeScream}>
        <FavouriteBorder color="primary" />
      </CustomButton>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { likeScream, unlikeScream })(
  LikeButton
);

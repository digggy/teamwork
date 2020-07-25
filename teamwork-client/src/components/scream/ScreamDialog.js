import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Components
import CustomButton from "../../utils/CustomButton";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

import dayjs from "dayjs";
import { Link } from "react-router-dom";

// Material UI stuffs
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Icon
import ExpandIcon from "@material-ui/icons/UnfoldMore";
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";

//Redux
import { connect } from "react-redux";
import { getScream, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme,
  expandButton: {
    position: "absolute",
    left: "90%",
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%",
  },
});

class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    const { userHandle, screamId } = this.props;
    let oldPath = window.location.pathname;
    const newPath = `/users/${userHandle}/scream/${screamId}`;

    if (oldPath === newPath) {
      oldPath = `/users/${userHandle}`;
    }
    window.history.pushState(null, null, newPath);
    this.setState({
      open: true,
      newPath,
      oldPath,
    });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({
      open: false,
    });
    this.props.clearErrors();
  };

  render() {
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        commentCount,
        userImage,
        userHandle,
        likeCount,
        comments,
      },
      UI: { loading },
    } = this.props;
    const dialogMarkup = loading ? (
      <CircularProgress size="6rem" />
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`users/${userHandle}`}
          >
            @ {userHandle}
          </Typography>
          <hr className={classes.seperator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.seperator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount}</span>
          <CustomButton tipTitle="Comments">
            <ChatIcon color="primary" />
          </CustomButton>
          <span>{commentCount} comments</span>
        </Grid>
        <hr className={classes.visibleSeperator} />
        <CommentForm screamId={screamId} />
        <Comments comments={comments} />
      </Grid>
    );
    return (
      <Fragment>
        <CustomButton
          onClick={this.handleOpen}
          tipTitle={"Expand Scream"}
          btnClassName={classes.expandButton}
        >
          <ExpandIcon color="primary" />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <CustomButton
            tipTitle={"close"}
            onClick={this.handleClose}
            btnClassName={classes.closeButton}
          >
            <CloseIcon />
          </CustomButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  scream: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  getScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
});

export default connect(mapStateToProps, { getScream, clearErrors })(
  withStyles(styles)(ScreamDialog)
);

import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import PropTypes from "prop-types";

//MUI
import Menu from "@material-ui/core/Menu";
import MenusItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

import NotificationsIcon from "@material-ui/icons/Notifications";
import FavouriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

//Redux

import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";
import { IconButton } from "@material-ui/core";

class Notifications extends Component {
  state = {
    anchor: null,
  };

  handleOpen = (event) => {
    this.setState({
      anchor: event.target,
    });
  };

  handleClose = () => {
    this.setState({
      anchor: null,
    });
  };

  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };

  render() {
    const notifications = this.props.notifications;
    const anchor = this.state.anchor;
    dayjs.extend(relativeTime);

    let notificationIcon = <NotificationsIcon />;
    let notificationsMarkup = null;

    if (notifications && notifications.length > 0) {
      const unreadNotifications = notifications.filter(
        (notification) => notification.read === false
      ).length;

      notificationIcon =
        unreadNotifications > 0 ? (
          <Badge badgeContent={unreadNotifications} color="secondary">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        );

      notificationsMarkup = notifications.map((notification) => {
        const conjunction =
          notification.type === "like" ? "liked" : "commented";
        const time = dayjs(notification.createdAt).fromNow();
        const iconColor = notification.read ? "primary" : "secondary";
        const iconType = notification.type ? (
          <FavouriteIcon color={iconColor} style={{ marginRight: 10 }} />
        ) : (
          <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
        );

        return (
          <MenusItem key={notification.createdAt} onClick={this.handleClose}>
            {iconType}
            <Typography
              component={Link}
              color="default"
              variant="body1"
              to={`/users/${notification.recipient}/scream/${notification.screamId}`}
            >
              {notification.sender} {conjunction} {time}.
            </Typography>
          </MenusItem>
        );
      });
    } else {
      notificationsMarkup = (
        <MenusItem onClick={this.handleClose}>
          You have no notifications yet !
        </MenusItem>
      );
    }

    return (
      <Fragment>
        <Tooltip placement="top" title="Notification">
          <IconButton
            aria-owns={anchor ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  markNotificationsRead: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);

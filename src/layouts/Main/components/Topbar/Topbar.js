import React, { useState, useContext } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton, Typography, Popover } from '@material-ui/core';
import { AppContext } from 'adapter';
import clsx from 'clsx';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import MenuIcon from '@material-ui/icons/Menu';
import ArchiveIcon from '@material-ui/icons/Archive';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import InputIcon from '@material-ui/icons/Input';
import EmojiNatureIcon from '@material-ui/icons/EmojiNature';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  download: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  downloadA: {
    color: theme.palette.primary.main,
    fontSize: 12,
    marginTop: theme.spacing(1),
    marginBottom: -theme.spacing(1),
    textDecoration: 'none'
  }
}));

const downloadUrl = "http://echonew.virjar.com/echo-static/EchoClient-release.apk";

const SelfPopover = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const onClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  return (
    <>
      <IconButton
        color="inherit"
        aria-describedby={id}
        onClick={onClick}>
        {props.icon}
        {props.iconText}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {props.popContent}
      </Popover>
    </>
  );
}

const Topbar = props => {
  const { user, setUser } = useContext(AppContext);
  const { className, onSidebarOpen, ...rest } = props;
  const history = useHistory();
  const classes = useStyles();

  const onLogout = () => {
    localStorage.removeItem("Echo-4G-USER");
    history.push("/sign-in");
  }

  const onMockOut = () => {
    localStorage.removeItem("Echo-4G-USER-MOCK");
    setUser(apis.getStore());
    history.push("/account");
  }

  const downloadBtn = (
    <SelfPopover
      icon={(<ArchiveIcon />)}
      iconText={(
        <Typography
          variant="caption"
          style={{ color: "#FFFFFF", marginLeft: 5 }}
        >APP 下载</Typography>
      )}
      popContent={(
        <section className={classes.download}>
          <QRCode value={downloadUrl} />
          <a className={classes.downloadA} href={downloadUrl} target="_blank" rel="noopener noreferrer">点击直接下载</a>
        </section>
      )} />
  );

  const salesBtn = (
    <SelfPopover
      icon={(<EmojiEventsIcon />)}
      iconText={(
        <Typography
          variant="caption"
          style={{ color: "#FFFFFF", marginLeft: 5 }}
        >联系商务</Typography>
      )}
      popContent={(
        <section className={classes.download}>
          <img src={require('assets/rsh.png')} alt="" style={{ width: 150 }} />
        </section>
      )} />
  );

  const logoutBtn = (
    <IconButton
      className={classes.signOutButton}
      color="inherit"
      onClick={onLogout}
    >
      <InputIcon />
      <Typography
        variant="caption"
        style={{ color: "#FFFFFF", marginLeft: 5 }}
      >安全退出</Typography>
    </IconButton>
  );

  const logoutMockBtn = (
    <IconButton
      className={classes.signOutButton}
      color="inherit"
      onClick={onMockOut}
    >
      <EmojiNatureIcon />
      <Typography
        variant="caption"
        style={{ color: "#FFFFFF", marginLeft: 5 }}
      >退出 {user.userName}</Typography>
    </IconButton>
  );

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            style={{ width: 150 }}
            src="/images/logos/logo.png"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        {user.mock ? logoutMockBtn : (
          <>
            {salesBtn}
            {downloadBtn}
            {logoutBtn}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;

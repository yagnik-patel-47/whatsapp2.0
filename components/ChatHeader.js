import styled from "styled-components";
import {
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
} from "@material-ui/core";
import FormatClearIcon from "@material-ui/icons/FormatClear";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useContext, useEffect, useState } from "react";
import { SideMenuContext } from "../context/SideMenu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useRouter } from "next/router";
import { db } from "../firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import TimeAgo from "timeago-react";
import { DarkModeContext } from "../context/DarkMode";

const ChatHeader = ({ email }) => {
  const [showMenu, setShowMenu] = useContext(SideMenuContext);
  const [darkMode, setDarkMode] = useContext(DarkModeContext);
  const [receiver, setReceiver] = useState({});
  const isMobile = useMediaQuery("(max-width:768px)");
  const router = useRouter();

  const clearChats = () => {
    db.collection("chats").doc(router.query.chatid).set(
      {
        chats: [],
      },
      { merge: true }
    );
  };

  const [receiverData, loading] = useDocument(
    db.collection("users").where("email", "==", email),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  useEffect(() => {
    setShowMenu(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      setReceiver(receiverData?.docs[0]?.data());
    }
  }, [receiverData]);

  return (
    <AppBar
      elevation={3}
      color="default"
      style={{ zIndex: 5, background: darkMode ? "#282a34" : "#fff" }}
      position="static"
      suppressHydrationWarning={true}
    >
      <Toolbar>
        <Grid container>
          <Grid item>
            <InfoSide>
              {isMobile && (
                <IconButton
                  onClick={() => {
                    setShowMenu(true);
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              {receiver ? (
                <Avatar src={receiver.photo}></Avatar>
              ) : (
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              )}
              <div style={{ margin: "0 1rem" }}>
                {email && <Typography>{email}</Typography>}
                {!receiver && (
                  <span className="timeagoclass">Currently Unavailable</span>
                )}
                {receiver?.lastSeen?.toDate() && (
                  <span className="timeagoclass">
                    Last seen:{" "}
                    <TimeAgo datetime={receiver?.lastSeen?.toDate()} />
                  </span>
                )}
              </div>
            </InfoSide>
          </Grid>
        </Grid>
        <Grid item>
          <Tooltip title="Clear all chats" arrow>
            <IconButton onClick={clearChats}>
              <FormatClearIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const InfoSide = styled.div`
  display: flex;
  align-items: center;
`;

export default ChatHeader;

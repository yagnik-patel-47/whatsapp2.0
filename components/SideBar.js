import {
  Avatar,
  Drawer,
  IconButton,
  Divider,
  makeStyles,
  InputBase,
  Button,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
import { useDocument } from "react-firebase-hooks/firestore";
import { SideMenuContext } from "../context/SideMenu";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import User from "./User";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { motion } from "framer-motion";
import { ChatUserAnim } from "../animations/ChatUser";
import Image from "next/image";
import { DarkModeContext } from "../context/DarkMode";
import theme from "../appTheme";

const useStyles = makeStyles((theme) => ({
  drawer: (darkMode) => ({
    height: "100%",
    width: "100vw",
    background: darkMode ? "#282a34" : "#fff",
    [theme.breakpoints.up(768)]: {
      position: "relative",
      width: "25vw",
    },
  }),
}));

const SideBar = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [user] = useAuthState(auth);
  const [chatUsers, setChatUsers] = useState([]);
  const [showMenu, setShowMenu] = useContext(SideMenuContext);
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

  const classes = useStyles(darkMode);

  const [usersDoc, loading] = useDocument(
    firebase.firestore().doc(`users/${user.uid}`),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  const router = useRouter();

  const colorArray = ["#ea4335", "#4285f4", "#00c2cb", "#fbbc05", "#34a853"];

  const checkEmail = (email) => {
    let emails = usersDoc.data().emails;

    if (!EmailValidator.validate(email)) {
      alert("Email Not Valid!");
      return { canCreate: false };
    }
    if (user.email === email) {
      alert("It's your Email.");
      return { canCreate: false };
    }
    if (emails.includes(email)) {
      alert("Already in chats.");
      return { canCreate: false };
    }

    return { emails: emails, canCreate: true };
  };

  const handleNewUser = () => {
    let newEmail = prompt("Email of receiver.");
    let check = checkEmail(newEmail);
    if (check.canCreate) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            emails: [...check.emails, newEmail],
          },
          { merge: true }
        );
    }
  };

  const handleDeleteUser = (userEmail) => {
    db.collection("users")
      .doc(user.uid)
      .set(
        {
          emails: firebase.firestore.FieldValue.arrayRemove(userEmail),
        },
        { merge: true }
      );
  };

  useEffect(() => {
    if (!loading && usersDoc.exists) {
      setChatUsers(usersDoc.data().emails);
    }
  }, [usersDoc]);

  return (
    <Drawer
      classes={{ paper: classes.drawer }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={showMenu}
      suppressHydrationWarning={true}
    >
      <TopLogoContainer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/transparent_logo.png"
            height={50}
            width={50}
            alt="App Logo"
          />
          <Typography variant="subtitle1">WhatsApp 2.0</Typography>
        </div>
        <Button
          onClick={() => {
            setDarkMode((prev) => !prev);
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </TopLogoContainer>
      <Divider />
      <TopContainer>
        <div>
          <Tooltip title={user.email} arrow>
            <Avatar src={user.photoURL}></Avatar>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Logout" arrow>
            <IconButton
              onClick={() => {
                auth.signOut();
              }}
            >
              <ExitToAppIcon style={darkMode ? { color: "" } : null} />
            </IconButton>
          </Tooltip>
          {isMobile && (
            <IconButton
              onClick={() => {
                if (router.route !== "/") {
                  setShowMenu(false);
                } else {
                  alert("Please select any chat first.");
                }
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          )}
        </div>
      </TopContainer>
      <Divider />
      <SpaceContainer>
        <InputBase
          startAdornment={<SearchIcon style={{ margin: "0 0.5rem" }} />}
          placeholder="Search chat..."
          fullWidth
          style={{ padding: "0 1rem" }}
        />
      </SpaceContainer>
      <Divider />
      <SpaceContainer>
        <Button onClick={handleNewUser} style={{ padding: "0.6rem 1rem" }}>
          start new chat
        </Button>
      </SpaceContainer>
      <Divider />
      <UsersContainer>
        {chatUsers.map((user) => (
          <UserNavigating
            key={user}
            variants={ChatUserAnim}
            initial="hidden"
            animate="show"
          >
            {isMobile && (
              <BehindSlideDelete>
                <IconButton
                  onClick={() => {
                    handleDeleteUser(user);
                  }}
                >
                  <DeleteForeverIcon style={{ color: "#f9f9f9" }} />
                </IconButton>
              </BehindSlideDelete>
            )}
            <motion.div
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 50 }}
              className="redirectButton"
              style={{
                background: darkMode ? "#282a34" : "#fff",
                zIndex: 2,
              }}
            >
              <User
                email={user}
                styledObj={{
                  backgroundColor:
                    colorArray[Math.floor(Math.random() * colorArray.length)],
                }}
              />
            </motion.div>
            {!isMobile && (
              <IconButton
                onClick={() => {
                  handleDeleteUser(user);
                }}
                className="deleteIcon"
                style={{ margin: "0.7rem 0" }}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
          </UserNavigating>
        ))}
      </UsersContainer>
    </Drawer>
  );
};

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BehindSlideDelete = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background: #ff3a3a;
  height: 100%;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.7rem;
`;

const TopLogoContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.7rem;
`;

const SpaceContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem 0;
`;

const UserNavigating = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  position: relative;
  &:hover div.redirectButton {
    width: 80%;
  }
  & .deleteIcon {
    transition: 0.4s;
    position: relative;
    right: -5rem;
  }
  &:hover button.deleteIcon {
    right: 1rem;
  }
  @media screen and (max-width: 768px) {
    &:hover div.redirectButton {
      width: 100%;
    }
  }
`;

export default SideBar;

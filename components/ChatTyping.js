import styled from "styled-components";
import { IconButton, InputBase, Box, makeStyles } from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import SendIcon from "@material-ui/icons/Send";
import { useContext, useState } from "react";
import { db, auth } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { Picker } from "emoji-mart";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { DarkModeContext } from "../context/DarkMode";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    width: "100%",
    zIndex: 3,
  },
});

const ChatTyping = ({ showEmoji, setShowEmoji }) => {
  const [chatText, setChatText] = useState("");
  const router = useRouter();
  const [user] = useAuthState(auth);
  const isMobile = useMediaQuery("(max-width:768px)");
  const classes = useStyles();
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

  const keyboardSend = (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  };

  const sendChat = () => {
    if (chatText.length === 0) {
      alert("Please write something.");
    } else {
      db.collection("chats")
        .doc(router.query.chatid)
        .set(
          {
            chats: firebase.firestore.FieldValue.arrayUnion({
              sender: user.email,
              message: chatText,
              time: new Date().getTime().toString(),
            }),
          },
          { merge: true }
        );
      setChatText("");
    }
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleEmoji = (emoji) => {
    setChatText((prev) => prev + emoji.native);
  };

  const toggleEmoji = () => {
    setShowEmoji((prev) => !prev);
  };

  return (
    <Box className={classes.container} elevation={0}>
      <IconButton onClick={toggleEmoji}>
        <EmojiEmotionsIcon />
      </IconButton>
      <Picker
        onClick={handleEmoji}
        set="twitter"
        style={
          showEmoji
            ? {
                visibility: "visible",
                opacity: 1,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
                zIndex: 2,
                transition: "300ms ease-in-out",
                background: darkMode ? "#282a34" : "#fff",
              }
            : {
                visibility: "hidden",
                opacity: 0,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(0.6)",
                zIndex: 2,
                transition: "300ms ease-in-out",
                background: darkMode ? "#282a34" : "#fff",
              }
        }
      />
      <InputBase
        placeholder="message..."
        style={{
          background: darkMode ? "#3c3f51" : "#eee",
          padding: "0.3rem 0.6rem",
          margin: "0 1rem",
        }}
        value={chatText}
        fullWidth
        onChange={(e) => {
          setChatText(e.target.value);
        }}
        onKeyPress={keyboardSend}
        autoFocus={!isMobile ? true : false}
      />
      <IconButton
        onClick={() => {
          sendChat();
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatTyping;

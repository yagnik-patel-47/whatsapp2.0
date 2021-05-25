import ChatHeader from "./ChatHeader";
import styled from "styled-components";
import ChatTyping from "./ChatTyping";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { auth, db } from "../firebase";
import { IconButton, makeStyles, Container, Box } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import moment from "moment";
import { DarkModeContext } from "../context/DarkMode";

const useStyles = makeStyles({
  container: (darkMode) => ({
    width: "100%",
    position: "relative",
    height: "100%",
    background: darkMode ? "#282a34" : "#fff",
    padding: "0",
    margin: "0",
  }),
  ChatContainer: (darkMode) => ({
    background: darkMode ? "#3c3f51" : "#e8e6e6",
    width: "100%",
    height: "83%",
    overflowX: " hidden",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    scrollBehavior: "smooth",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
});

const ChatScreen = ({ headerTitle }) => {
  const [chats, setChats] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const router = useRouter();
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

  const classes = useStyles(darkMode);

  const [user] = useAuthState(auth);
  const [chatsDoc, loading] = useDocument(
    firebase.firestore().doc(`chats/${router.query.chatid}`),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  const ChatContainerRef = useRef(null);

  const handleDelete = (chat) => {
    db.collection("chats")
      .doc(router.query.chatid)
      .set(
        {
          chats: firebase.firestore.FieldValue.arrayRemove(chat),
        },
        { merge: true }
      );
  };

  const getChatTime = (time) => {
    const numTime = Number(time);
    return moment(numTime).format("LT");
  };

  useEffect(() => {
    if (!loading) {
      setChats(chatsDoc.data().chats);
      setTimeout(() => {
        ChatContainerRef.current.scrollTop =
          ChatContainerRef.current.scrollHeight;
      }, 500);
    }
  }, [chatsDoc]);

  return (
    <Container className={classes.container}>
      <ChatHeader email={headerTitle} />
      <Box
        ref={ChatContainerRef}
        onClick={() => {
          setShowEmoji(false);
        }}
        className={classes.ChatContainer}
      >
        {chats.map((chat) =>
          chat.sender === user.email ? (
            <UserMessage key={chat.time} darkMode={darkMode}>
              {chat.message}
              <ChatTime>{getChatTime(chat.time)}</ChatTime>
              <DeleteSpan>
                <IconButton
                  onClick={() => {
                    handleDelete(chat);
                  }}
                  disableRipple
                  style={{ padding: "0 0.5rem" }}
                >
                  <DeleteForeverIcon style={{ fontSize: "1.2rem" }} />
                </IconButton>
              </DeleteSpan>
            </UserMessage>
          ) : (
            <SenderMessage key={chat.time} darkMode={darkMode}>
              {chat.message}
              <ChatTime>{getChatTime(chat.time)}</ChatTime>
              <DeleteSpan>
                <IconButton
                  onClick={() => {
                    handleDelete(chat);
                  }}
                  disableRipple
                  style={{ padding: "0 0.5rem" }}
                >
                  <DeleteForeverIcon style={{ fontSize: "1.2rem" }} />
                </IconButton>
              </DeleteSpan>
            </SenderMessage>
          )
        )}
      </Box>
      <ChatTyping showEmoji={showEmoji} setShowEmoji={setShowEmoji} />
    </Container>
  );
};

const ChatTime = styled.span`
  position: relative;
  bottom: 0;
  font-size: 0.6rem;
  margin: 0 0.5rem;
`;

const DeleteSpan = styled.span`
  display: none;
`;

const SenderMessage = styled.p`
  align-self: flex-start;
  padding: 0.8rem 1.5rem;
  background: ${(props) => (props.darkMode ? "#282a34" : "white")};
  color: ${(props) => (props.darkMode ? "#f9f9f9" : "black")};
  border-radius: 0.6rem;
  margin: 0.5rem 0;
  transition: 0.3s ease;
  &:hover span {
    display: initial;
  }
`;

const UserMessage = styled.p`
  align-self: flex-end;
  padding: 0.8rem 1.5rem;
  background: ${(props) => (props.darkMode ? "#282a34" : "white")};
  color: ${(props) => (props.darkMode ? "#f9f9f9" : "black")};
  border-radius: 0.6rem;
  margin: 0.5rem 0;
  transition: 0.3s ease;
  &:hover span {
    display: initial;
  }
`;

export default ChatScreen;

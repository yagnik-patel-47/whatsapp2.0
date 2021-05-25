import ChatScreen from "../../components/ChatScreen";
import { useRouter } from "next/router";
import styled from "styled-components";
import PageTitle from "../../components/PageTitle";
import { db, auth } from "../../firebase";
import { useState, useEffect } from "react";
import { getReceiverEmail } from "../../utils/receiverEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import SideBar from "../../components/SideBar";

const Chat = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [receiverEmail, setReceiverEmail] = useState("");

  useEffect(() => {
    if (router.query.chatid === undefined) {
      router.push("/");
    }
  }, []);

  const getChat = async () => {
    const chat = await db.collection("chats").doc(router.query.chatid).get();
    if (chat.exists) {
      setReceiverEmail(getReceiverEmail(chat.data().emails, user.email));
      if (!chat.data().emails.includes(user.email)) {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    getChat();
  }, [router.query.chatid]);

  return (
    <Container>
      <PageTitle title="WhatsApp 2.0" />
      <SideBar />
      <ChatScreen headerTitle={receiverEmail} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export default Chat;

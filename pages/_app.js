import "../styles/globals.css";
import "../styles/emoji-mart.css";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../components/Login";
import Loading from "../components/Loading";
import { useEffect } from "react";
import firebase from "firebase/app";
import { getChatUsers } from "../utils/ChatUsers";
import { SideMenuProvider } from "../context/SideMenu";
import { useRouter } from "next/router";
import { DarkModeProvider } from "../context/DarkMode";
import ThemeHook from "../appTheme";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const initialSeedUp = async () => {
    if (user) {
      const emails = await getChatUsers(user.uid);
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photo: user.photoURL,
          emails: emails,
        },
        { merge: true }
      );
    }
  };

  useEffect(() => {
    initialSeedUp();
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return (
    <>
      <SideMenuProvider>
        <DarkModeProvider>
          <ThemeHook>
            <Component {...pageProps} />
          </ThemeHook>
        </DarkModeProvider>
      </SideMenuProvider>
    </>
  );
}

export default MyApp;

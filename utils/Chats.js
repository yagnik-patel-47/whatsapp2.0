import { db } from "../firebase";

export const getChats = async (id) => {
  return new Promise((resolve, reject) => {
    db.collection("chats")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        }
      });
  });
};

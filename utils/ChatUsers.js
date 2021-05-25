import { db } from "../firebase";

export const getChatUsers = async (id) => {
  return new Promise((resolve, reject) => {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data().emails);
        } else {
          resolve([]);
        }
      });
  });
};

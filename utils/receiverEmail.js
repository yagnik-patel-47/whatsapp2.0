export const getReceiverEmail = (emailArray, userEmail) => {
  const receiverEmail = emailArray.filter((email) => email !== userEmail);
  return receiverEmail[0];
};

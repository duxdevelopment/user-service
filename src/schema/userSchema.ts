interface userSchemaInterface {
  id: string;
  firstName: string;
  stripeId: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export const userSchema = ({
  id,
  firstName,
  lastName,
  email,
  stripeId,
  phoneNumber,
}: userSchemaInterface) => {
  const PK = `USER:${id}`;
  const SK = `META:${id}`;
  const emailIndex = `EMAIL:${email}`;
  const phoneIndex = `PHONE:${phoneNumber}`;

  return {
    PK: PK,
    SK: SK,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    stripeId: stripeId,
    GSI_1_PK: emailIndex,
    GSI_2_PK: phoneIndex,
  };
};

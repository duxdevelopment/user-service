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
}: userSchemaInterface) => ({
  PK: { S: `USER:${id}` },
  SK: { S: `META:${id}` },
  firstName: { S: firstName },
  lastName: { S: lastName },
  email: { S: email },
  phoneNumber: { S: phoneNumber },
  stripeId: { S: stripeId },
});

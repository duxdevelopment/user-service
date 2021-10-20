import { createKey, toItem } from './base';

interface userSchemaInterface {
  id: string;
  firstName: string;
  stripeId: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive?: boolean;
}

export const userSchema = ({
  id,
  firstName,
  lastName,
  email,
  stripeId,
  phoneNumber,
  isActive,
}: userSchemaInterface) => {
  const PK = `USER:${id}`;
  const SK = `META:${id}`;
  const emailIndex = `EMAIL:${email}`;
  const activeStatus = `STATUS:${isActive}`;
  // const phoneIndex = `PHONE:${phoneNumber}`;

  return toItem({
    ...createKey(PK, SK),
    entityType: 'user',
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    stripeId: stripeId,
    GSI_1_PK: emailIndex,
    isActive: isActive,
    GSI_1_SK: activeStatus,
  });
};

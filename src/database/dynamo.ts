interface userSchemaInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  stripeId: string;
}

export const userSchema = ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
  stripeId,
}: userSchemaInterface) => {
  return {
    RequestItems: {
      [`${process.env.TABLE_PREFIX}USERS`]: [
        {
          PutRequest: {
            Item: {
              PK: `UG#${id}`,
              SK: `#METADATA#${id}`,
              enitityType: 'userGroup',
              userGroupName: '',
              userGroupType: 'Standard',
            },
          },
        },
        {
          PutRequest: {
            Item: {
              PK: `UG#${id}`,
              SK: `USER#${id}`,
              isUserGroupOwner: true,
              firstName: firstName,
              lastName: lastName,
              GSI_1_PK: `USER#${id}`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              PK: `USER#${id}`,
              SK: `#METADATA#${id}`,
              enitityType: 'user',
              GSI_1_PK: `EMAIL#${email}`,
              GSI_1_SK: 'active',
              firstName: firstName,
              lastName: lastName,
              email: email,
              phoneNumber: phoneNumber,
              stripeId: stripeId,
            },
          },
        },
      ],
    },
  };
};

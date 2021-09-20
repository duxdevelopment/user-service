interface userSchemaInterface {
  id: string;
  userGroupType: string;
}

export const userGroupSchema = ({ id, userGroupType }: userSchemaInterface) => {
  const PK = `UG:${id}`;
  const SK = `META:${id}`;

  return {
    PK: PK,
    SK: SK,
    userGroupType: userGroupType,
  };
};

interface userGroupSchemaInterface {
  id: string;
  userGroupType: string;
}

export const userGroupSchema = ({
  id,
  userGroupType,
}: userGroupSchemaInterface) => {
  const PK = `UG:${id}`;
  const SK = `META:${id}`;

  return {
    PK: PK,
    SK: SK,
    entityType: 'userGroup',
    userGroupType: userGroupType,
    createdAt: Date.now(),
  };
};

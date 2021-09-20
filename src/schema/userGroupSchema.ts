interface userSchemaInterface {
  id: string;
  userGroupType: string;
}

export const userGroupSchema = ({
  id,
  userGroupType,
}: userSchemaInterface) => ({
  PK: { S: `UG:${id}` },
  SK: { S: `META:${id}` },
  userGroupType: { S: userGroupType },
});

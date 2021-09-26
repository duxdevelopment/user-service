interface userGroupSchemaInterface {
  id: string;
  fleetType: string;
}

export const fleetSchema = ({ id, fleetType }: userGroupSchemaInterface) => {
  const PK = `FLEET:${id}`;
  const SK = `META:${id}`;

  return {
    PK: PK,
    SK: SK,
    entityType: 'fleet',
    userGroupType: fleetType,
    createdAt: Date.now(),
  };
};

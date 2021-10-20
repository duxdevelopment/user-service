import { createKey, toItem } from './base';
interface fleetSchemaInterface {
  id: string;
  fleetType: string;
}

export const fleetSchema = ({ id, fleetType }: fleetSchemaInterface) => {
  const PK = `FLEET:${id}`;
  const SK = `META:${id}`;

  return toItem({
    ...createKey(PK, SK),
    entityType: 'fleet',
    userGroupType: fleetType,
  });
};

interface fleetUserSchemaInterface {
  fleetId: string;
  userId: string;
  email: string;
}

export const fleetUserSchema = ({
  fleetId,
  userId,
  email,
}: fleetUserSchemaInterface) => {
  const PK = `FLEET:${fleetId}`;
  const SK = `USER:${userId}`;

  return toItem({
    ...createKey(PK, SK),
    email,
    userId,
  });
};

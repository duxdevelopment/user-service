import { austates, vehicleTypes } from './constants';
import { createKey, toItem } from './base';
import { v4 } from 'uuid';

export interface plateSchemaInterface {
  registration: string;
  state: keyof typeof austates;
  vehicleType: keyof typeof vehicleTypes;
  isActive?: boolean;
  userId: string;
}

export const plateSchema = ({
  registration,
  state,
  vehicleType,
  isActive,
  userId,
}: plateSchemaInterface) => {
  const plateId = v4();
  const PK = `USER:${userId}`;
  const SK = `PLATE:${plateId}`;
  return toItem({
    ...createKey(PK, SK),
    entityType: 'plate',
    registration,
    GSI_1_PK: `REGO:${registration}`,
    GSI_1_SK: `STATUS:${isActive}`,
    plateId,
    state,
    vehicleType,
    isActive,
    userId,
  });
};

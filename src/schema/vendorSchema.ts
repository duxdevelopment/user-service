import { createKey, toItem } from './base';

interface vendorSchemaInterface {
  id: string;
  state: string;
  vendorName: string;
}

export const vendorSchema = ({
  id,
  state,
  vendorName,
}: vendorSchemaInterface) => {
  const PK = `VENDOR:${id}`;
  const SK = `META:${id}`;

  return toItem({
    ...createKey(PK, SK),
    entityType: 'vendor',
    state: state,
    vendorName,
    createdAt: Date.now(),
  });
};

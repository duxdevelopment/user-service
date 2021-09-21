interface vendorSchemaInterface {
  id: string;
  state: string;
  vendorName: string;
}

export const vendorSchema = ({ id, state }: vendorSchemaInterface) => {
  const PK = `VENDOR:${id}`;
  const SK = `META:${id}`;

  return {
    PK: PK,
    SK: SK,
    entityType: 'vendor',
    state: state,
    vendorName: 'string',
    createdAt: Date.now(),
  };
};

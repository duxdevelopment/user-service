import { corsSuccessResponse, runWarm } from '../utils';
import { Response } from '../utils/lambda-response';
import { getUserGroupsForUser } from '../database/getUserGroupsForUser';

const getPaymentDetails = async (): Promise<Response> => {
  const getGroups = await getUserGroupsForUser(
    '660432dc-eedf-400b-8c7b-1fda53035cf3'
  );

  return corsSuccessResponse({
    message: JSON.stringify(getGroups),
  });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getPaymentDetails);

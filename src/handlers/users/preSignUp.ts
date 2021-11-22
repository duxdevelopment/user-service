import { runWarm } from '../../utils';

const preSignUp = (event: any, context: any): any => {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  context.done(null, event);
};

export default runWarm(preSignUp);

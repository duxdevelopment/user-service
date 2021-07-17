const preSignUp = (event: any, context: any): any => {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  event.response.autoVerifyPhone = true;
  context.done(null, event);
};

const awsmobile = {
  aws_project_region: 'ap-southeast-2',
  aws_cognito_region: 'ap-southeast-2',
  aws_user_pools_id: process.env.USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.USER_POOL_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.AWS_COGNITO_DOMAIN,
  },
};

export default awsmobile;

import { User } from '../schema/schema';

export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const exists = await User.query('email').eq(email).exec();

    console.log(exists);

    if (exists.count > 0) {
      return true;
    }
  } catch (error) {
    console.log('error checking email:', error);
  }

  return false;
};

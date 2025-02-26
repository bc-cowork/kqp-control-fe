import axios, { endpoints } from 'src/utils/axios';

export type SignInParams = {
  id: string;
  password: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const login = async ({ id, password }: SignInParams): Promise<void> => {
  try {
    const params = { id, password };

    const res = await axios.post(endpoints.auth.login, params);

    console.log('res', res);

    //   const { accessToken } = res.data;

    //   if (true) {
    //     throw new Error('Access token not found in response');
    //   }
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

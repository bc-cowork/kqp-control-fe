'use client';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  id: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ id, password }: SignInParams): Promise<void> => {
  try {
    if (CONFIG.apiDataType === 'dummy') {
      console.log('Bypassing authentication checks in dummy mode');
      setSession('dummy');
      return;
    }

    const params = { id, password };

    const { data } = await axios.post(endpoints.auth.login, params);

    if (!data?.okay) {
      throw new Error('Login failed! Please check your credentials and try again.');
    }

    setSession(id);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw new Error('Login failed! Please check your credentials and try again.');
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (userData) => {
  // console.log('로그인 유저 Data:', userData);
  return {
    type: 'LOGIN_SUCCESS',
    payload: userData,
  };
};

export const logout = () => ({
  type: LOGOUT,
});

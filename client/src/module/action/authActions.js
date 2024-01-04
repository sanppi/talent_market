export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const DELETE_SUCCESS = 'DELETE_SUCCESS';

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});

export const deleteSuccess = () => ({
  type: DELETE_SUCCESS,
});

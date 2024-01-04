export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const UPDATE_USER = 'UPDATE_USER';
export const LOGOUT = 'LOGOUT';
export const DELETE_SUCCESS = 'DELETE_USER';

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const updateUser = (userData) => ({
  type: UPDATE_USER,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});

export const deleteSuccess = () => ({
  type: DELETE_SUCCESS,
});

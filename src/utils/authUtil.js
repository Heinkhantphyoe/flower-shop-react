import store from '../store';

// 🧠 Utility to get user + role from Redux
export const getStateAuth = () => {
  const state = store.getState();
  const user = state.auth.user;
  const role = state.auth.role;
  return { user, role };
};

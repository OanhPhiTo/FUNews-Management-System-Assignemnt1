/**
 * Author: OanhTP
 */
export const authService = {
  login: (username, password) => {
    if (username === 'Admin' && password === 'Admin') {
      const user = { username: 'Admin', role: 1, status: 1 };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password' };
  },

  logout: () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!authService.getCurrentUser();
  }
};

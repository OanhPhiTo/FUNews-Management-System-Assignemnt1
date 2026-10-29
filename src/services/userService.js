/**
 * Author: OanhTP
 */
import { INITIAL_USERS } from '../mock/initialData';

const STORAGE_KEY = 'funews_users';

const initUsers = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
};

export const userService = {
  getAll: () => {
    return initUsers();
  },

  getById: (id) => {
    const list = userService.getAll();
    return list.find((item) => item.id === Number(id)) || null;
  },

  create: (userData) => {
    const list = userService.getAll();
    const newId = list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1;
    const newUser = {
      id: newId,
      username: userData.username.trim(),
      password: userData.password,
      role: Number(userData.role), // 1 = Admin, 2 = Staff
      status: Number(userData.status), // 1 = Active, 0 = Inactive
    };
    const updatedList = [...list, newUser];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newUser;
  },

  update: (id, userData) => {
    const list = userService.getAll();
    const targetId = Number(id);
    const updatedList = list.map((item) =>
      item.id === targetId
        ? {
            ...item,
            username: userData.username.trim(),
            password: userData.password ? userData.password : item.password,
            role: Number(userData.role),
            status: Number(userData.status),
          }
        : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList.find((item) => item.id === targetId);
  },

  delete: (id) => {
    const list = userService.getAll();
    const targetId = Number(id);
    const updatedList = list.filter((item) => item.id !== targetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return true;
  },
};

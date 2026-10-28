import { INITIAL_CATEGORIES } from '../mock/initialData';

const STORAGE_KEY = 'funews_categories';

// Khởi tạo dữ liệu nếu chưa có trong localStorage
const initCategories = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
};

export const categoryService = {
  getAll: () => {
    return initCategories();
  },

  getById: (id) => {
    const list = categoryService.getAll();
    return list.find((item) => item.id === Number(id)) || null;
  },

  create: (category) => {
    const list = categoryService.getAll();
    const newId = list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1;
    const newCategory = {
      id: newId,
      name: category.name.trim(),
      status: Number(category.status),
    };
    const updatedList = [...list, newCategory];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newCategory;
  },

  update: (id, categoryData) => {
    const list = categoryService.getAll();
    const targetId = Number(id);
    const updatedList = list.map((item) =>
      item.id === targetId
        ? {
            ...item,
            name: categoryData.name.trim(),
            status: Number(categoryData.status),
          }
        : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList.find((item) => item.id === targetId);
  },

  delete: (id) => {
    const list = categoryService.getAll();
    const targetId = Number(id);
    const updatedList = list.filter((item) => item.id !== targetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return true;
  },
};

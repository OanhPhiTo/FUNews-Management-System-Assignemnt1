import { INITIAL_NEWS } from '../mock/initialData';

const STORAGE_KEY = 'funews_articles';

const initNews = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
};

export const newsService = {
  getAll: () => {
    return initNews();
  },

  getById: (id) => {
    const list = newsService.getAll();
    return list.find((item) => item.id === Number(id)) || null;
  },

  create: (newsData) => {
    const list = newsService.getAll();
    const newId = list.length > 0 ? Math.max(...list.map((item) => item.id)) + 1 : 1;
    const newArticle = {
      id: newId,
      title: newsData.title.trim(),
      content: newsData.content.trim(),
      categoryId: Number(newsData.categoryId),
      createdBy: newsData.createdBy || 'Admin',
      status: Number(newsData.status),
      tags: Array.isArray(newsData.tags)
        ? newsData.tags
        : typeof newsData.tags === 'string'
        ? newsData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    const updatedList = [...list, newArticle];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newArticle;
  },

  update: (id, newsData) => {
    const list = newsService.getAll();
    const targetId = Number(id);
    const updatedList = list.map((item) =>
      item.id === targetId
        ? {
            ...item,
            title: newsData.title.trim(),
            content: newsData.content.trim(),
            categoryId: Number(newsData.categoryId),
            status: Number(newsData.status),
            tags: Array.isArray(newsData.tags)
              ? newsData.tags
              : typeof newsData.tags === 'string'
              ? newsData.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              : item.tags,
          }
        : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList.find((item) => item.id === targetId);
  },

  delete: (id) => {
    const list = newsService.getAll();
    const targetId = Number(id);
    const updatedList = list.filter((item) => item.id !== targetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return true;
  },
};

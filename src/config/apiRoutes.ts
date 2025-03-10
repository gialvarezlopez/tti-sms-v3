const usersRoutes = {
  login: `/api/v1/auth/login`,
  list: `/api/v1/users`,
  new: `/api/v1/users`,
  single: (id: string) => `/api/v1/users/${id}`, //View, Delete, Update
  multiOption: `/api/v1/users/multi-op`, //Delete multi options
};

const branchesRoutes = {
  list: `/api/v1/branches`,
  new: `/api/v1/branches`,
  single: (id: string) => `/api/v1/branches/${id}`, //View, Delete, Update
  multiOption: `/api/v1/branches/multi-op`, //Delete multi options
};

const templatesRoutes = {
  list: `/api/v1/templates`,
  new: `/api/v1/templates`,
  single: (id: string) => `/api/v1/templates/${id}`, //View, Delete, Update
};

const messagesRoutes = {
  list: `/api/v1/messages`,
  new: `/api/v1/messages`,
  single: (id: string) => `/api/v1/messages/${id}`, //View, Delete, Update
};

export { usersRoutes, branchesRoutes, templatesRoutes, messagesRoutes };

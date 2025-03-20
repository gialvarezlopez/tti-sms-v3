const usersRoutes = {
  login: `/api/v1/auth/login`,
  list: `/api/v1/users`,
  new: `/api/v1/users`,
  single: (id: string) => `/api/v1/users/${id}`, //View, Delete, Update
  multiOption: `/api/v1/users/multi-op`, //Delete multi options
  forgotPassword: `/api/v1/auth/forgot`,
  resetPassword: (token: string) => `/api/v1/auth/${token}/reset`,
};

const rolesRoutes = {
  list: `/api/v1/roles`,
};

const statsRoutes = {
  get: `/api/v1/threads/stats`, //We use post method due to get method is limited to send parameters
};

const availableNumbersRoutes = {
  list: `/api/v1/sending_numbers/available`, //Delete multi options
};

const branchesRoutes = {
  list: `/api/v1/branches`,
  new: `/api/v1/branches`,
  single: (id: string) => `/api/v1/branches/${id}`, //View, Delete, Update
  multiOption: `/api/v1/branches/multi-op`, //Delete multi options
};

const ticketsRoutes = {
  list: `/api/v1/threads`,
  filter: `/api/v1/threads/search`,
  new: `/api/v1/threads`,
  single: (id: string) => `/api/v1/threads/${id}`, //View, Delete, Update
  multiOption: `/api/v1/threads/multi-op`, //Delete multi options
  resendLast: (id: string) => `/api/v1/threads/${id}/resend_last`,
};

const templatesRoutes = {
  list: `/api/v1/templates`,
  new: `/api/v1/templates`,
  single: (id: string) => `/api/v1/templates/${id}`, //View, Delete, Update
};

const messagesRoutes = {
  list: `/api/v1/threads`,
  new: `/api/v1/threads`,
  resend: (id: string) => `/api/v1/messages/${id}/resend`,
};

export {
  usersRoutes,
  branchesRoutes,
  templatesRoutes,
  messagesRoutes,
  statsRoutes,
  ticketsRoutes,
  rolesRoutes,
  availableNumbersRoutes,
};

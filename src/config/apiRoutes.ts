// config/apiRoutes.ts
const usersRoutes = {
  login: `/api/v1/auth/login`,
  list: `/api/v1/users`,
  new: `/api/v1/users`,
  single: (id: string) => `/api/v1/users/${id}`, //View, Delete, Update
};

const branchesRoutes = {
  list: `/api/v1/branches`,
  new: `/api/v1/branches`,
  single: (id: string) => `/api/v1/branches/${id}`, //View, Delete, Update
};

/*
const companyRoutes = {
  list: `/api/v1/empresa/listar`,
  create: `/api/v1/empresa/crear`,
  single: (companyId: string) => `/api/v1/empresa/mostrar/${companyId}`,
  change: (companyId: string) => `/api/v1/empresa/cambiar/${companyId}`,
  update: (companyId: string) => `/api/v1/empresa/actualizar/${companyId}`,
  delete: (companyId: string) => `/api/v1/empresa/eliminar/${companyId}`,
};
*/
export { usersRoutes, branchesRoutes };

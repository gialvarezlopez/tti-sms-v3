// config/apiRoutes.ts
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const usersRoutes = {
  login: `/api/v1/auth/login`,
  /*
  changePassword: `/api/v1/usuario/actualizarPassword`,
  validatePassword: `/api/v1/usuario/compararPassword`,
  validateAccount: (activationId: string) =>
    `/api/v1/usuario/validarCuenta/${activationId}`,
  update: `/api/v1/usuario/actualizar`,
  checkToken: `/api/v1/usuario/refresh-token`,
  register: `/api/v1/usuario/registrar`,
  adminCompany: (companyId: string) =>
    `/api/v1/usuario/administrar/${companyId}`,
  delete: (userId: string) => `/api/v1/usuario/eliminar/${userId}`,
  */
};

const employeesRoutes = {
  registerEmployee: `/api/v1/usuario/registrarEmpleado`,
  list: `/api/v1/usuario/listarEmpleados`,
  update: (employeeId: string) =>
    `/api/v1/usuario/empleado/actualizar/${employeeId}`,
};

const companyRoutes = {
  list: `/api/v1/empresa/listar`,
  create: `/api/v1/empresa/crear`,
  single: (companyId: string) => `/api/v1/empresa/mostrar/${companyId}`,
  change: (companyId: string) => `/api/v1/empresa/cambiar/${companyId}`,
  update: (companyId: string) => `/api/v1/empresa/actualizar/${companyId}`,
  delete: (companyId: string) => `/api/v1/empresa/eliminar/${companyId}`,
};

export { usersRoutes, employeesRoutes, companyRoutes };

export const TICKETS_STATUS = {
  ERROR_IN_MESSAGE: "error",
  CLOSED: "closed",
  IN_PROGRESS: "in_progress",
  OVERDUE: "overdue",
  TO_BE_OVERDUE: "toBeOverdue",
};

export const USER_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  UNKNOWN: "unknown",
};

export const TOAST_STATUS = {
  SUCCESS: "success",
  DESTRUCTIVE: "destructive",
  DEFAULT: "default",
} as const;

export const TYPE_OF_MESSAGE = {
  ONE_WAY: "one_way",
  TWO_WAY: "two_way",
};

export const WHO_SEND_MESSAGE = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

export const USER_ROLE = {
  ADMIN: "admin",
  MEMBER: "user",
  CUSTOMER_EXPERIENCE: "CE",
};

export const KEYWORD_SYMBOL = {
  BRACKETS: "[]",
  //BRACKETS: "{{}}",
};

export const SETTING_OPTIONS = {
  USERS: "users",
  BRANCHES: "branches",
};

export const MESSAGE_EXCHANGE = {
  ONE_WAY: "one-way",
  TWO_WAY: "two-way",
} as const;

export const SETTINGS_PARAMETER_URL = {
  USERS: "users",
  BRANCH: "branch",
};

export type RoleProps = {
  id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type UserProps = {
  id?: string;
  status?: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  primaryRole?: RoleProps;
  lastLogin?: string;
  active?: boolean;
  last_update?: string | null;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  branchId?: string;
  branch?: BranchProps;
  // };
  data?: {
    jwt: string;
    tokenType: string;
    expiresIn: string;
  };
};

export type ProvincesProps = {
  id: string;
  name: string;
  abbreviation?: string;
};

export type BranchProps = {
  id?: string;
  name?: string;
  address?: string;
  province?: ProvincesProps | string;
  number?: string;
  sendingNumberId?: string;
  status?: string;
  distributionList?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TicketsProps = {
  id?: number;
  branch?: string;
  client: string;
  phoneNumber: string;
  lastSent: string;
  lastReceived: string;
  createdAt?: string;
  typeOfMessage: string;
  status: string;
  templateName?: string;
  templateDescription?: string;
  date?: string;
  message?: string;
  errorMessage?: string;
  chat: ChatMessage[];
  reason?: string;
  closedBy?: string;
  template?: string;
  closed?: string;
};

export type ChatMessage = {
  from?: string;
  keyword?: string;
  date: string;
  message: string;
};

export type KeywordTemplates = {
  id?: string;
  name: string;
  type: string;
};

export type AutomaticResponsesTemplates = {
  id?: string;
  value: string;
  reply: string;
};

export type TemplateProps = {
  id?: string;
  title: string;
  slug?: string;
  type: string;
  branches?: string[];
  description?: string;
  message?: string;
  keywords?: KeywordTemplates[];
  responses?: AutomaticResponsesTemplates[];
  invalidReply?: string;
  created_at?: string;
};

export type TypeComboBoxProps = {
  id: string;
  value: string;
};

export type KeywordProps = {
  id?: string;
  name: string;
  type: string;
  value?: string;
};

export type ResponseProps = {
  id?: string;
  responseName: string;
  value?: string;
  automaticReply: string;
};

export type PhoneNumberProps = {
  id?: string;
  phoneNumber: string;
  createdAt: string;
};

export interface PaginateParams {
  page: number;
  limit?: number | string;
  search?: string;
}

// Opciones para refetch
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Opciones para refetch
export interface RefetchOptions {
  pagination: PaginationOptions;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type RoleProps = {
  role_id?: string;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

/*
export type UserListProps={

}
*/
export type UserProps = {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  primary_role?: RoleProps;
  branch?: BranchProps;
  created_at?: string;
  updated_at?: string;
};
export type LoginProps = {
  //id?: string;
  //status?: string;
  //name?: string;
  //first_name?: string;
  //last_name?: string;
  //username?: string;
  //lastLogin?: string;
  //active?: boolean;
  //last_update?: string | null;
  //image?: string;
  createdAt?: string;
  updatedAt?: string;
  data?: {
    jwt: string;
    tokenType: string;
    expiresIn: string;
    user: UserProps;
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
  sending_number_id?: string;
  status?: string;
  distributionList?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  created_at?: string;
  updated_at?: string;
};

export type FormReviewMessageProps = {
  clientName: string;
  phoneNumber: string;
  keywords?: KeywordTemplates[];
  responses?: AutomaticResponsesTemplates[];
  content?: string;
};

type FormReviewMessagePropsWithoutKeywordsAndResponses = Omit<
  FormReviewMessageProps,
  "keywords" | "responses"
>;

export type TicketsProps = FormReviewMessagePropsWithoutKeywordsAndResponses & {
  id?: string | number;
  branch?: string;
  lastSent: string;
  lastReceived: string;
  createdAt?: string;
  status: string;
  date?: string;
  errorMessage?: string;
  chat: ChatMessage[];
  reason?: string;
  closedBy?: string;
  template?: TemplateProps;
  closed?: string;
};

export type KeywordTemplates = {
  id?: string | number;
  keyword: string;
  value?: string;
  type: string;
};

export type AutomaticResponsesTemplates = {
  id?: string | number;
  response: string;
  reply: string;
};

export type ChatMessage = {
  from?: string;
  keyword?: string;
  date: string;
  message: string;
};

export type TemplateProps = {
  id?: string;
  name?: string;
  slug?: string;
  isTwoWay?: boolean;
  branches?: string[];
  description?: string;
  isReminder?: boolean;
  content?: string;
  keywords?: KeywordTemplates[];
  responses?: AutomaticResponsesTemplates[];
  invalidReply?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
};

export type TypeComboBoxProps = {
  id: string;
  value: string;
};

export type KeywordProps = {
  id?: string;
  keyword: string;
  type: string;
  value?: string;
  template_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ResponseProps = {
  id?: string;
  response: string;
  value?: string;
  automaticReply: string;
};

export type PhoneNumberProps = {
  id?: string;
  phoneNumber: string;
  createdAt: string;
};

export interface PaginateParams {
  page?: number;
  limit?: number | string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// Opciones para refetch
export interface RefetchOptions {
  pagination: PaginationOptions;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | null;
}

export type RoleProps = {
  id?: string;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type UserProps = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  username?: string;
  primary_role?: RoleProps;
  branch?: BranchProps;
  created_at?: string;
  updated_at?: string;
};

export type ResetPassword = {
  newPassword: string;
};

export type LoginProps = {
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

export type SendingNumberProps = {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber: string;
};

export type BranchProps = {
  id?: string;
  name?: string;
  address?: string;
  province?: ProvincesProps | string;
  phone_number?: string; //if the correct is sendingNumber, then remove phone_number
  sendingNumber?: SendingNumberProps;
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
  client: string;
  recipient_number: string;
  keywords?: KeywordTemplates[];
  responses?: AutomaticResponsesTemplates[];
  content?: string;
};

type FormReviewMessagePropsWithoutKeywordsAndResponses = Omit<
  FormReviewMessageProps,
  "keywords" | "responses"
>;
export type SendMessageProps = {
  id?: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  threadId: string;
  sentByType?: string;
};

export type ClosedByUserProps = {
  closedAt?: string;
  closedReason?: string;
  user?: UserProps;
};

export type TicketsProps = FormReviewMessagePropsWithoutKeywordsAndResponses & {
  id?: string | number;
  branch?: BranchProps;
  lastSent: string;
  recipientNumber?: string;
  firstMessage?: SendMessageProps;
  lastMessage?: SendMessageProps;
  lastSentMessage?: SendMessageProps;
  lastReceivedMessage: SendMessageProps;
  template?: TemplateProps;
  created_at?: string;
  status: string;
  date?: string;
  messages?: MessageProps[];
  errorMessage?: string;
  chat: ChatMessage[];
  reason?: string;
  closedBy?: ClosedByUserProps;
  closed?: string;
  createdAt?: string;
};

export type MessageProps = {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sentByType: string;
  threadId: string;
};

export type ResendMessageProps = {
  cliente?: string;
  recipientNumber?: string;
  content: MessageProps["content"];
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
  reply?: string;
  is_default?: boolean;
  isInvalidReply?: boolean;
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
  branch?: BranchProps;
  branches?: string[];
  description?: string;
  isReminder?: boolean;
  type?: string;
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
  isInvalidReply?: boolean;
};

export type PhoneNumberProps = {
  id?: string;
  phoneNumber: string;
  createdAt: string;
};

export interface PaginateParams {
  page?: number;
  limit?: number | string;
  query?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// Opciones para refetch
export interface RefetchOptions {
  pagination: PaginationOptions;
  query: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | null;
}

export type StatsProps = {
  error: string;
  overdue: string;
  toBeOverdue: string;
  inProgress: string;
  closed: {
    total: 0;
    closebyUser: 0;
    manualClose: 0;
  };
};

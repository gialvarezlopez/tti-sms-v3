// dataTickets.ts

const templateOneWay = {
  id: "cba5c6fd-b10a-4335-8c2a-20ab4d26eda6",
  name: "Estimate",
  description:
    "Notice of non-warranty repair with contact for estimate approval.",
  branch_id: null,
  content:
    "Your Milwaukee repair request [SV or MODEL Number] has been inspected and does not qualify for warranty coverage. For a repair estimate and approval to proceed, please contact Milwaukee at 1-877-948-2360. Thank you!",
  keywords: [
    {
      id: 32,
      template_id: "cba5c6fd-b10a-4335-8c2a-20ab4d26eda6",
      keyword: "SV or MODEL Number",
      type: "number",
      created_at: "2025-03-07T15:51:43.000000Z",
      updated_at: "2025-03-07T15:51:43.000000Z",
    },
  ],
  responses: [],
  isTwoWay: false,
  createdBy: {
    id: "ab35c12c-f9ce-11ef-ae33-12367ee732df",
    name: "Juan",
    email: "juan@expertel.ca",
  },
  createdAt: "2025-03-07T15:30:50.000000Z",
  updatedAt: "2025-03-07T15:41:28.000000Z",
};

const templateTwoWay = {
  id: "957a8029-dcc0-49b3-a123-b16b670cf53a",
  name: "Cost Repair + is R + 2w",
  description: "Tool replacement cost approval request.",
  branch_id: null,
  content:
    "The replacement cost for your tool is [Total Cost] . Please respond by [Date] with one of the following:\n [Approve] \n [Deny] \nIf you have any questions, please contact Milwaukee at 1-877-948-2360. Thank you!",
  keywords: [
    {
      id: 21,
      template_id: "957a8029-dcc0-49b3-a123-b16b670cf53a",
      keyword: "Total Cost",
      type: "currency",
      created_at: "2025-03-07T15:13:24.000000Z",
      updated_at: "2025-03-07T15:13:24.000000Z",
    },
    {
      id: 22,
      template_id: "957a8029-dcc0-49b3-a123-b16b670cf53a",
      keyword: "Date",
      type: "date",
      created_at: "2025-03-07T15:13:24.000000Z",
      updated_at: "2025-03-07T15:13:24.000000Z",
    },
  ],
  responses: [
    {
      id: 21,
      template_id: "957a8029-dcc0-49b3-a123-b16b670cf53a",
      response: "Approve",
      reply:
        "Thank you for approving the replacement cost. We will proceed with the next steps and provide you with updates shortly.",
      is_default: 0,
      created_at: "2025-03-07T15:13:24.000000Z",
      updated_at: "2025-03-07T15:13:24.000000Z",
    },
    {
      id: 22,
      template_id: "957a8029-dcc0-49b3-a123-b16b670cf53a",
      response: "Deny",
      reply:
        "We have received your decision to deny the replacement cost. If you have any questions or need further assistance, please contact Milwaukee at 1-877-948-2360.",
      is_default: 0,
      created_at: "2025-03-07T15:13:24.000000Z",
      updated_at: "2025-03-07T15:13:24.000000Z",
    },
  ],
  isTwoWay: true,
  createdBy: {
    id: "ab35c12c-f9ce-11ef-ae33-12367ee732df",
    name: "Juan",
    email: "juan@expertel.ca",
  },
  createdAt: "2025-03-07T15:13:24.000000Z",
  updatedAt: "2025-03-07T15:13:24.000000Z",
};

export const dataHistory = [
  {
    id: 1,
    branch: "Tech",
    clientName: "Carvajal Noth",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "One way",
    status: "Error",
    template: templateOneWay,
    //templateName: "Cost Repair Template",
    //templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "Tool info and code here",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
    errorMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ",
    reason: "Customer did not respond",
    //template: "Estimate",
    closed: "01/07/2025",
    closedBy: "Wool sr.",
  },
  {
    id: 2,
    branch: "Office",
    clientName: "Joe Doe",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "One way",
    status: "In Progress",
    template: templateOneWay,
    //templateName: "Cost Repair Template",
    //templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "Tool info and code here",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
    reason: "Customer did not respond",
    //template: "Estimate",
    closed: "01/07/2025",
    closedBy: "Wool sr.",
  },
  {
    id: 3,
    branch: "Office",
    clientName: "Doron smith",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "One way",
    status: "In Progress",
    template: templateOneWay,
    //templateName: "Cost Repair Template",
    //templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "Tool info and code here",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
    reason: "Customer Contacted",
    //template: "Estimate",
    closed: "01/07/2025",
    closedBy: "Wool sr.",
  },
  {
    id: 4,
    branch: "Tech",
    clientName: "Bruce Willis",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "One way",
    status: "Error",
    template: templateOneWay,
    //templateName: "Cost Repair Template",
    //templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "Tool info and code here",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
    errorMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ",
    reason: "Customer Contacted",
    //template: "Estimate",
    closed: "01/07/2025",
    closedBy: "Wool sr.",
  },

  {
    id: 4,
    branch: "Tech",
    clientName: "Bruce Banner",
    phoneNumber: "(358) 755-3920",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "Two way",
    status: "Error",
    date: "12/12/2024 at 9:12 AM",
    template: templateTwoWay,
    //templateName: "Cost Repair Template",
    //templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        date: "12/12/2024 at 9:12 AM",
        keyword: "Tool info and code here",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
      {
        from: "customer",
        date: "12/12/2025 at 9:30 AM",
        message: "Ok, yes. I want to proceed.",
      },
      {
        from: "admin",
        date: "12/20/2024 at 9:32 AM",
        keyword: "Factory Service Centre",
        message:
          "Your tool is ready. You can pick your tool up at the facility Factory Service Centre, from Mondays to Fridays 8am to 4:30pm. Please remember there’s a $150 fee you have to pay. Any unaclaimed tools will be disposed after 35 days of this notification.",
      },
    ],
    reason: "Customer Contacted",
    //template: "Estimate",
    closed: "01/07/2025",
    closedBy: "Wool sr.",
  },
  {
    id: 5,
    branch: "Tech",
    clientName: "Bruce Banner",
    phoneNumber: "(358) 755-3920",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "Two way",
    status: "completed",
    date: "12/12/2024 at 9:12 AM",
    template: templateTwoWay,
    //templateName: "Cost Repair Template",
    //templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        date: "12/12/2024 at 9:12 AM",
        keyword: "Tool info and code here",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
      {
        from: "customer",
        date: "12/12/2025 at 9:30 AM",
        message: "Ok, yes. I want to proceed.",
      },
      {
        from: "admin",
        date: "12/20/2024 at 9:32 AM",
        keyword: "Factory Service Centre",
        message:
          "Your tool is ready. You can pick your tool up at the facility Factory Service Centre, from Mondays to Fridays 8am to 4:30pm. Please remember there’s a $150 fee you have to pay. Any unaclaimed tools will be disposed after 35 days of this notification.",
      },
    ],
    reason: "Customer Contacted",
    //template: "Pick Up",
    closed: "01/08/2025",
    closedBy: "Doron Awl",
  },
  {
    id: 6,
    branch: "Tech",
    clientName: "Bruce Banner",
    phoneNumber: "(358) 755-3920",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    //typeOfMessage: "Two way",
    status: "completed",
    date: "12/12/2024 at 9:12 AM",
    template: templateTwoWay,
    //templateName: "Cost Repair Template",
    templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        date: "12/12/2024 at 9:12 AM",
        keyword: "Tool info and code here",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
      {
        from: "customer",
        date: "12/12/2025 at 9:30 AM",
        message: "Ok, yes. I want to proceed.",
      },
      {
        from: "admin",
        date: "12/20/2024 at 9:32 AM",
        keyword: "Factory Service Centre",
        message:
          "Your tool is ready. You can pick your tool up at the facility Factory Service Centre, from Mondays to Fridays 8am to 4:30pm. Please remember there’s a $150 fee you have to pay. Any unaclaimed tools will be disposed after 35 days of this notification.",
      },
    ],
    reason: "Customer Contacted",
    //template: "Estimate",
    closed: "01/07/2025",
    closedBy: "Wool sr.",
  },
];

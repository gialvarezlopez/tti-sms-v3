// dataTickets.ts
export const dataTickets = [
  {
    id: 1,
    branch: "Tech",
    clientName: "Carvajal Noth",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    createdAt: "01/01/2025",
    typeOfMessage: "One way",
    status: "Error",
    templateName: "Cost Repair Template",
    templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "SV or MODEL Number",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
    errorMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ",
  },
  {
    id: 2,
    branch: "Office",
    clientName: "Joe Doe",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    createdAt: "01/02/2025",
    typeOfMessage: "One way",
    status: "In Progress",
    templateName: "Cost Repair Template",
    templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "SV or MODEL Number",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
  },
  {
    id: 3,
    branch: "Office",
    clientName: "Doron smith",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    createdAt: "01/03/2025",
    typeOfMessage: "One way",
    status: "In Progress",
    templateName: "Cost Repair Template",
    templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "SV or MODEL Number",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
  },
  {
    id: 4,
    branch: "Tech",
    clientName: "Bruce Willis",
    phoneNumber: "(226) 755-3917",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    createdAt: "01/04/2025",
    typeOfMessage: "One way",
    status: "Error",
    templateName: "Cost Repair Template",
    templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        keyword: "SV or MODEL Number",
        date: "12/12/2024 at 9:12 AM",
        message:
          "Your Milwaukee repair request for {{}} has been inspected and qualifies for warranty coverage. You will have to pay $150 for labor cost. If you want to proceed with this repair please answer this text. You can pay when you pick up the tool.",
      },
    ],
    errorMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ",
  },

  {
    id: 4,
    branch: "Tech",
    clientName: "Bruce Banner",
    phoneNumber: "(358) 755-3920",
    lastSent: "01/07/2025",
    lastReceived: "01/07/2025",
    createdAt: "01/05/2025",
    typeOfMessage: "Two way",
    status: "Error",
    date: "12/12/2024 at 9:12 AM",
    templateName: "Cost Repair Template",
    templateDescription: "Tool replacement cost approval request.",
    chat: [
      {
        from: "admin",
        date: "12/12/2024 at 9:12 AM",
        keyword: "SV or MODEL Number",
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
  },
];

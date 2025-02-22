export const messageOneWay =
  "Your Milwaukee repair request [SV or MODEL Number] has been inspected and does not qualify for warranty coverage response. For a repair estimate and approval to proceed, please contact Milwaukee at 1-877-948-2360. Thank you!";
export const messageTwoWay =
  "Your Milwaukee repair request [SV or MODEL Number] has been inspected and [Expiration Date] and does not qualify for warranty coverage response:. \n [Yes] \n [No] \n For a repair estimate and approval to proceed, please contact Milwaukee at 1-877-948-2360. Thank you!";

export const invalidReply = `We could not process your response. Please reply with one of the following options: "Approve" or "Deny." If you have any questions, contact Milwaukee at 1-877-948-2360.`;
export const dataTemplates = [
  {
    id: "1",
    title: "Estimate",
    slug: "estimate",
    type: "One Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageOneWay,
    timeToRespond: 35,
    created_at: "01/07/2025",
    branches: ["1", "2"],
    keywords: [{ id: "1", name: "SV or MODEL Number", type: "text" }],
  },
  {
    id: "2",
    title: "Pick Up",
    slug: "pick-up",
    type: "One Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageOneWay,
    timeToRespond: 35,
    created_at: "02/07/2025",
    branches: ["1"],
    keywords: [{ id: "1", name: "SV or MODEL Number", type: "text" }],
  },
  {
    id: "3",
    title: "Cost Repair",
    slug: "cost-repair",
    type: "One Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageOneWay,
    timeToRespond: 35,
    created_at: "03/07/2025",
    branches: ["1", "2"],
    keywords: [{ id: "1", name: "SV or MODEL Number", type: "text" }],
  },
  {
    id: "4",
    title: "Cost Repair",
    slug: "cost-repair",
    type: "One Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageOneWay,
    timeToRespond: 35,
    created_at: "04/07/2025",
    branches: ["4", "5"],
    keywords: [{ id: "1", name: "SV or MODEL Number", type: "text" }],
  },
  {
    id: "5",
    title: "Reminder",
    slug: "remainder",
    type: "One Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageOneWay,
    timeToRespond: 35,
    created_at: "05/07/2025",
    branches: ["4"],
    keywords: [{ id: "1", name: "SV or MODEL Number", type: "text" }],
  },

  {
    id: "6",
    title: "Cost Repair",
    slug: "cost-repair",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "06/07/2025",
    branches: ["5"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "7",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "07/07/2025",
    branches: ["3"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },

  {
    id: "8",
    title: "Cost Repair",
    slug: "cost-repair",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "08/07/2025",
    branches: ["2"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "9",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "09/07/2025",
    branches: ["4"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "10",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "10/07/2025",
    branches: ["1", "2", "3"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "11",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "11/07/2025",
    branches: ["1", "2", "3"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "12",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "11/07/2025",
    branches: ["1", "2", "3"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "13",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "01/07/2025",
    branches: ["1", "2", "3"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
  {
    id: "14",
    title: "Reminder",
    slug: "remainder",
    type: "Two Way",
    description:
      "The replacement cost for your tool is [cost]. Please respond by [date]",
    message: messageTwoWay,
    timeToRespond: 35,
    created_at: "01/07/2025",
    branches: ["1", "2", "3"],
    keywords: [
      { id: "1", name: "SV or MODEL Number", type: "text" },
      { id: "2", name: "Expiration Date", type: "date" },
    ],
    responses: [
      { id: "1", value: "Yes", reply: "Ok done" },
      { id: "2", value: "No", reply: "Terminated" },
    ],
    invalidReply,
  },
];

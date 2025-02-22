import {
  IconErrorFound,
  IconOverdue,
  IconUnansweredTickets,
  IconClosed,
} from "../../../../assets/images";

export const dataCard = [
  {
    title: "Errors Found",
    footer: "0 Tickets",
    icon: IconErrorFound,
    setClass: "cardErrors",
  },
  {
    title: "Overdue",
    footer: "3 Tickets",
    icon: IconOverdue,
    setClass: "",
  },
  {
    title: "To be overdue",
    footer: "5 Tickets",
    icon: IconOverdue,
    setClass: "",
  },
  {
    title: "Unanswered Tickets",
    footer: "2 Tickets",
    icon: IconUnansweredTickets,
    setClass: "cardUnansweredTickets",
  },
  {
    title: "Recently Closed",
    footer: "0 Tickets",
    icon: IconClosed,
    setClass: "cardRecentlyClosed",
  },
];

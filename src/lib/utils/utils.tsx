import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { KEYWORD_SYMBOL, TICKETS_STATUS, USER_STATUS } from "../constants";
import { CalendarRange, DollarSign, Hash, LetterText } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getStatusName = (ticketStatus: string): string => {
  switch (convertToSnakeCase(ticketStatus.toLowerCase())) {
    case TICKETS_STATUS.ERROR_IN_MESSAGE:
      return "Error";
    //case TICKETS_STATUS.RESPONSE_TO_THE_CLIENT:
    //return "Response to client Due";
    case TICKETS_STATUS.TO_BE_OVERDUE:
      return "To Be Overdue";
    case TICKETS_STATUS.OVERDUE:
      return "Overdue";
    case TICKETS_STATUS.IN_PROGRESS:
      return "In Progress";
    case TICKETS_STATUS.CLOSED:
      return "Closed";
    default:
      return "None";
  }
};
/// #E1E1E1;

export const statusType = (status: string, withCircle: boolean = true) => {
  let setBgColor = "";
  let circleBg = "";

  // Color map for each state
  const statusColors = {
    [TICKETS_STATUS.ERROR_IN_MESSAGE]: {
      bg: "bg-customRed-v4 text-customRed-v3",
      circle: "bg-customRed-v3",
    },
    /*
    [TICKETS_STATUS.RESPONSE_TO_THE_CLIENT]: {
      bg: "bg-customGray-v1 text-[#1D2433]/80",
      circle: "bg-[#1D2433]/80",
    },
    */
    [TICKETS_STATUS.IN_PROGRESS]: {
      bg: "bg-[#EDFDF8] text-[#16A37A]",
      circle: "bg-[#16A37A]",
    },
    [TICKETS_STATUS.OVERDUE]: {
      bg: "bg-[#E1E1E1] text-[#1D2433]/80",
      circle: "bg-[#1D2433]/80",
    },
    [TICKETS_STATUS.TO_BE_OVERDUE]: {
      bg: "bg-[#FFF8EB] text-[#B25E09]",
      circle: "bg-[#B25E09]",
    },
    [TICKETS_STATUS.CLOSED]: {
      bg: "bg-[#EDFDF8] text-[#16A37A]",
      circle: "bg-[#16A37A]",
    },
  };

  // Assigning classes based on state
  const { bg, circle } = statusColors[
    convertToSnakeCase(status.toLowerCase())
  ] || {
    bg: "bg-gray text-gray-500", // Default value
    circle: "bg-sky",
  };

  setBgColor = bg;
  circleBg = circle;

  return (
    <div className="flex justify-start gap-2">
      <div
        className={`${setBgColor} flex place-items-center px-4 py-1 rounded-[12px] gap-3 text-xs`}
      >
        {withCircle && (
          <span
            className={`rounded-full ${circleBg} flex-none w-[6px] h-[6px]`}
          />
        )}
        <span className="flex-none">{getStatusName(status)}</span>
      </div>
    </div>
  );
};

export const convertToSnakeCase = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "_");
};

export const branchStatus = (status: string, withCircle: boolean = true) => {
  let setBgColor = "";
  let circleBg = "";

  // Color map for each state
  const statusColors = {
    [USER_STATUS.INACTIVE]: {
      bg: "bg-customGray-v1 text-[#1D2433]/80",
      circle: "bg-[#1D2433]/80",
    },
    [USER_STATUS.ACTIVE]: {
      bg: "bg-[#EDFDF8]  text-[#16A374]",
      circle: "bg-[#16A374]",
    },

    [USER_STATUS.UNKNOWN]: {
      bg: "bg-customGray-v1  text-[#1D2433]/80",
      circle: "bg-[#1D2433]/80",
    },
  };

  // Assigning classes based on state
  const { bg, circle } = statusColors[
    convertToSnakeCase(status.toLowerCase())
  ] || {
    bg: "bg-customGray-v1 text-gray-500", // Default value
    circle: "bg-[#1D2433]/80",
  };

  setBgColor = bg;
  circleBg = circle;

  return (
    <div className="flex justify-start gap-2">
      <div
        className={`${setBgColor} flex place-items-center px-4 py-1 rounded-[12px] gap-2 text-xs`}
      >
        {withCircle && (
          <span
            className={`rounded-full ${circleBg} flex-none w-[6px] h-[6px]`}
          />
        )}
        <span className="flex-none">{capitalizarPrimeraLetra(status)}</span>
      </div>
    </div>
  );
};

export const capitalizarPrimeraLetra = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeFirstLetterOfEveryWord = (str: string) => {
  if (typeof str !== "string") {
    throw new Error("The provided value is not a text string.");
  }

  if (str === null || str === undefined) {
    throw new Error("The text string cannot be null or undefined.");
  }

  return str
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
};

export const lineReplaceWithBreaks = (content: string) => {
  return content?.replace(/\n/g, "<br />");
};

/**
 * Function to highlight keywords and responses within a string.
 *
 * @param {string} str - The string where keywords and responses will be highlighted.
 * @param {Array} keywords - An array of objects containing keywords and their replacement values.
 *   Each object must have the properties `keyword` (the keyword to find) and `value` (the value to replace it with).
 * @param {string} [color='red'] - The default color to apply to the highlighted keywords.
 * @param {Array} [responses] - An optional array of objects containing `value` and `color` properties to highlight responses.
 * @param {boolean} [setWithBreaks=false] - A flag to indicate whether the string should be processed to replace line breaks.
 * @returns {string} - The updated string with highlighted keywords and responses.
 */
export const highlightKeyword = (
  str: string,
  keywords: { keyword: string; value: string }[], // Pasamos un arreglo con el keyword y su valor
  color: string = "red",
  responses?: { value: string; color: string }[],
  setWithBreaks?: boolean
) => {
  let updatedStr = str;

  if (setWithBreaks) {
    updatedStr = lineReplaceWithBreaks(updatedStr);
  }

  // We replace each [keyword] tag with its corresponding value
  keywords?.forEach(({ keyword, value }) => {
    const regex = new RegExp(`\\[${keyword}\\]`, "g"); // Create a regex to find [keyword]
    updatedStr = updatedStr?.replace(
      regex,
      `<span style="color: ${color}; font-weight: bold;">${value}</span>`
    );
  });

  // If there are responses, we process them and highlight them
  responses?.forEach(({ value, color: responseColor }) => {
    const responseRegex = new RegExp(`\\[${value}\\]`, "g"); // We create a regex to find [value]
    updatedStr = updatedStr.replace(
      responseRegex,
      `<span style="color: ${responseColor}; font-weight: bold;">${value}</span>`
    );
  });

  return updatedStr;
};

export const cleanString = (
  string: string,
  charsToRemove: string[],
  replace = " "
) => {
  let cleanedString = string;

  charsToRemove.forEach((char: string) => {
    cleanedString = cleanedString.replace(
      new RegExp(`\\${char}`, "g"),
      replace
    );
  });

  // Capitalize the first letter of the result
  return cleanedString.charAt(0).toUpperCase() + cleanedString.slice(1);
};

export const cleanWhiteSpaceAndBreakLine = (str: string): string => {
  // Replace all multiple spaces with a single space
  return str.trim().replace(/\s+/g, " ");
};

export const cleanOnlyWhiteSpace = (str: string): string => {
  // Replace multiple spaces with a single space, but without touching newlines (\n)
  return str.replace(/[^\S\r\n]+/g, " ").trim(); // Replaces only whitespace and tabs (not newlines)
};

export const formatTextWithBold = (text: string) => {
  const regex = /\[(.*?)\]/g; // Regular expression to capture text inside []
  const parts = text.split(regex); // Split the text into parts, keeping the words between []

  return parts.map((part, index) =>
    text.match(regex)?.includes(`[${part}]`) ? (
      <strong key={index}>[{part}]</strong>
    ) : (
      part
    )
  );
};

//remove the brackets
export const removeBrackets = (str: string): string => {
  return str.replace(/[\[\]]/g, "");
};

export const removeHtmlTags = (str: string): string => {
  return str.replace(/<[^>]*>/g, "");
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize characters (to remove accents)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents, tildes)
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with "-"
    .replace(/-+/g, "-"); // Avoid multiple hyphens in a row
};

export const templateType = (isTwoWay: boolean) => {
  return isTwoWay ? "Two-Way" : "One-Way";
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const renderIcon = (type: string) => {
  // Function to return the icon according to the selected type
  switch (type) {
    case "date":
      return <CalendarRange className="ml-auto h-4 w-4 opacity-50" />;
    case "number":
      return <Hash className="ml-auto h-4 w-4 opacity-50" />;
    case "currency":
      return <DollarSign className="ml-auto h-4 w-4 opacity-50" />;
    default:
      return <LetterText className="ml-auto h-4 w-4 opacity-50" />;
  }
};

export const formatPhoneNumber = (
  phone: string | number,
  addPlus?: boolean
): string => {
  const phoneStr = getJustNumber(phone); // remove non-numeric characters

  // If the number has less than 10 digits or more than 11, return it as is
  if (phoneStr.length < 10 || phoneStr.length > 11) return phoneStr;

  let formattedNumber = "";

  if (phoneStr.length === 11 && phoneStr.startsWith("1")) {
    // If the number has 11 digits and starts with "1", remove the "1" to format it
    formattedNumber = `(${phoneStr.slice(1, 4)}) ${phoneStr.slice(
      4,
      7
    )}-${phoneStr.slice(7)}`;
    return `+1 ${formattedNumber}`; // Always with "+1"
  } else if (phoneStr.length === 10) {
    // If the number has 10 digits, format it normally
    formattedNumber = `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
      3,
      6
    )}-${phoneStr.slice(6)}`;
    return addPlus ? `+1 ${formattedNumber}` : formattedNumber;
  }

  return phoneStr;
};

export const formatPhoneNumberWithoutAreCode = (phone: string) => {
  return phone.length > 10 ? phone.slice(-10) : phone;
};

export const addFormatPhoneNumberMask = (number: string): string => {
  const cleanNumber = number.replace(/\D/g, ""); // Remueve caracteres no numéricos
  if (cleanNumber.length === 11 && cleanNumber.startsWith("1")) {
    const withoutAreaCode = cleanNumber.slice(1); // Elimina el código de área
    return `(${withoutAreaCode.slice(0, 3)}) ${withoutAreaCode.slice(
      3,
      6
    )}-${withoutAreaCode.slice(6)}`;
  } else if (cleanNumber.length === 10) {
    return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(
      3,
      6
    )}-${cleanNumber.slice(6)}`;
  }
  return number; // Si no cumple con los requisitos, devolverlo sin cambios
};

export const getJustNumber = (word: string | number) => {
  return word.toString().replace(/\D/g, "");
};

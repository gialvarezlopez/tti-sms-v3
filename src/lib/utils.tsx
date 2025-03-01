import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { KEYWORD_SYMBOL, TICKETS_STATUS, USER_STATUS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getStatusName = (ticketStatus: string): string => {
  switch (convertToSnakeCase(ticketStatus.toLowerCase())) {
    case TICKETS_STATUS.ERROR_IN_MESSAGE:
      return "Error";
    //case TICKETS_STATUS.RESPONSE_TO_THE_CLIENT:
    //return "Response to client Due";
    case TICKETS_STATUS.IN_PROGRESS:
      return "In Progress";
    case TICKETS_STATUS.COMPLETED:
      return "Completed";
    default:
      return "None";
  }
};

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
      bg: "bg-[#FFF8EB] text-[#B25E09]",
      circle: "bg-[#B25E09]",
    },
    [TICKETS_STATUS.COMPLETED]: {
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
      bg: "bg-success-v1  text-success-v2",
      circle: "bg-success-v2",
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

/*
export const highlightKeyword = (
  str: string,
  keyword: string,
  id: string = "my_keyword", // Se agrega un id único
  color: string = "red"
) => {
  //const id = "my_keyword";
  // Create a regular expression that searches for the keyword in the string
  const regex = new RegExp(`(${keyword})`, "gi"); // "gi" para hacer la búsqueda insensible a mayúsculas y minúsculas
  return str.replace(regex, (match) => {
    return `<span id="${id}" style="color: ${color}; font-weight: bold;">${match}</span>`;
  });
};
*/

/*
export const highlightKeyword = (
  str: string,
  modelNumber: string,
  color: string = "red"
) => {
  const marker = "{{}}"; // Marcador para reemplazar

  // Reemplazar solo el marcador {{}} por el valor de modelNumber
  let updatedStr = str.replace(marker, modelNumber);
  //console.log("updatedStr", updatedStr);
  // Reemplazar el texto modelNumber por el valor con el formato de resaltado
  // Solo se resalta el valor reemplazado, no el texto original que estaba antes
  updatedStr = updatedStr.replace(
    modelNumber,
    `<span style="color: ${color}; font-weight: bold;">${modelNumber}</span>`
  );

  return updatedStr;
};
*/
export const highlightKeyword = (
  str: string,
  modelNumber: string,
  color: string = "red"
) => {
  // We just replace the {{}} marker with the value of model Number
  const marker = KEYWORD_SYMBOL.BRACKETS;

  // We just replace {{}} with the value of model Number
  const updatedStr = str.replace(
    marker,
    `<span style="color: ${color}; font-weight: bold;">${modelNumber}</span>`
  );

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
  const regex = /\[(.*?)\]/g; // Expresión regular para capturar texto dentro de []
  const parts = text.split(regex); // Divide el texto en partes, manteniendo las palabras entre []

  return parts.map((part, index) =>
    text.match(regex)?.includes(`[${part}]`) ? (
      <strong key={index}>[{part}]</strong>
    ) : (
      part
    )
  );
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase() // Convertir a minúsculas
    .normalize("NFD") // Normalizar caracteres (para quitar acentos)
    .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos (acentos, tildes)
    .replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres especiales
    .trim() // Eliminar espacios al inicio y al final
    .replace(/\s+/g, "-") // Reemplazar espacios por "-"
    .replace(/-+/g, "-"); // Evitar múltiples guiones seguidos
};

export const templateType = (isTwoWay: boolean) => {
  return isTwoWay ? "Two Way" : "One Way";
};

export const formatDate = (isoDate: string) => {
  if (isoDate === "") return;
  const date = new Date(isoDate);

  // Formatear la fecha en el formato "MM/dd/yyyy" en inglés (EE. UU.)
  const formattedDate = date.toLocaleDateString("en-US");
  return formattedDate;
};

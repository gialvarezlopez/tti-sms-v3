export const formatDateXXXX = (isoDate: string) => {
  if (isoDate === "") return;
  const date = new Date(isoDate);

  // Formatear la fecha en el formato "MM/dd/yyyy" en inglés (EE. UU.)
  const formattedDate = date.toLocaleDateString("en-US");
  return formattedDate;
};

export const formatDate = (isoDate: string | Date): string => {
  // Si isoDate es un string vacío, retorna una cadena vacía
  if (isoDate === "" || isoDate === undefined) return "";

  // Si isoDate es un string, conviértelo a Date
  const date = new Date(isoDate);

  // Verifica si la fecha es válida
  if (isNaN(date.getTime())) {
    // Si la fecha no es válida, retorna una cadena vacía
    return "";
  }

  // Si es una fecha válida, formatea en el formato "MM/dd/yyyy"
  return date.toLocaleDateString("en-US");
};

export const convertDateYYYYMMDD = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Sumar 1 porque los meses en JavaScript comienzan desde 0
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

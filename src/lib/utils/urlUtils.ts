import { useRouter } from "next/navigation";

/**
 * Elimina todos los parámetros de la URL.
 * @param router - Instancia del router de Next.js.
 */
export const removeAllParamsFromUrl = (
  router: ReturnType<typeof useRouter>
) => {
  const newUrl = window.location.pathname;
  router.push(newUrl);
};

/**
 * Elimina todos los parámetros de la URL excepto los especificados.
 * @param router - Instancia del router de Next.js.
 * @param paramsToKeep - Array de nombres de parámetros que se conservarán.
 */
export const removeParamsExcept = (
  router: ReturnType<typeof useRouter>,
  paramsToKeep: string[]
) => {
  const newSearchParams = new URLSearchParams(window.location.search);

  Array.from(newSearchParams.keys()).forEach((param) => {
    if (!paramsToKeep.includes(param)) {
      newSearchParams.delete(param);
    }
  });

  const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
  router.push(newUrl);
};

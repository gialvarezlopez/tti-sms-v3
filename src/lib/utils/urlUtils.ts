import { useRouter } from "next/navigation";

/**
 * Removes all parameters from the URL.
 * @param router - Next.js router instance.
 */
export const removeAllParamsFromUrl = (
  router: ReturnType<typeof useRouter>
) => {
  const newUrl = window.location.pathname;
  router.push(newUrl);
};

/**
 * Removes all parameters from the URL except the ones specified.
 * @param router - Next.js router instance.
 * @param paramsToKeep - Array of parameter names to be preserved.
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

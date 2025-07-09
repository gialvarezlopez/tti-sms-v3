import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  { active?: boolean } & React.ComponentProps<"li">
>(({ className, active, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      active
        ? "rounded-md cursor-text page-active-datable bg-[#DC2F2F] text-white hover:bg-[#DC2F2F]"
        : "cursor-pointer bg-gray-200 rounded-md",
      className
    )}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  labelBtnPrevious?: string;
  labelBtnNext?: string;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  disabled,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "ghost",
        size,
      }),
      //isActive ? "!bg-red-500 text-white cursor-text !hover:bg-red-500" : "", //
      disabled ? "opacity-50 pointer-events-none " : "",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  disabled,
  labelBtnPrevious,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(`gap-1 ${labelBtnPrevious ? "pl-2.5" : ""}`, className)}
    disabled={disabled}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    {labelBtnPrevious && <span>{labelBtnPrevious}</span>}
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  disabled,
  labelBtnNext,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(`gap-1   ${labelBtnNext ? "pr-2.5" : ""} `, className)}
    disabled={disabled}
    {...props}
  >
    {labelBtnNext && <span>{labelBtnNext}</span>}
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

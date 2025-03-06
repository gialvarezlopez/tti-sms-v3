import { ReactNode, useEffect, useState } from "react";
import { Control, FieldValues, useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CustomFormMessage from "./CustomFormMessage";

const CustomMultiSelect = ({
  name,
  label,
  control,
  data,
  icon,
  showLimit = 2,
  leftPositionLabel,
  withLabel,
  isDisabled,
}: Props) => {
  const [hydrated, setHydrated] = useState(false);

  const { getFieldState, setValue } = useFormContext();
  const { error } = getFieldState(name);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);

  const selectedItems = control._formValues[name] || [];

  const handleSelectItem = (id: string) => {
    if (id === "all") {
      setValue(name, selectedItems.includes("all") ? [] : ["all"]);
    } else {
      if (selectedItems.includes("all")) {
        return;
      }

      const newSelectedItems = selectedItems.includes(id)
        ? selectedItems.filter((item: string) => item !== id)
        : [...selectedItems, id];

      setValue(name, newSelectedItems);
    }
  };

  const isAllSelected = selectedItems.includes("all");
  const isAllDisabled = selectedItems.length > 0 && !isAllSelected;

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
  };

  const handleRemoveAll = () => {
    setValue(
      name,
      selectedItems.filter((item: string) => item !== "all")
    );
  };

  data.sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

  useEffect(() => {
    setHydrated(true); // The component has been hydrated on the client
  }, []);

  // Then, in the JSX:
  if (!hydrated) return null; // Prevents rendering until hydrated

  return (
    <FormItem>
      <div
        className={`${
          leftPositionLabel ? "flex items-center gap-3" : "space-y-[8px]"
        }`}
      >
        <FormLabel className={`${withLabel} text-sm font-semibold`}>
          {icon ? (
            <div className="flex gap-2 items-center ">
              {icon}
              {label}
            </div>
          ) : (
            label
          )}
        </FormLabel>
        <FormControl>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto flex-1"
                ref={(element) => {
                  if (element) {
                    setButtonWidth(element.offsetWidth);
                  }
                }}
                onClick={() => setOpen((prev) => !prev)}
                disabled={isDisabled}
              >
                <div className="flex text-wrap">
                  {selectedItems.length > 0 ? (
                    <>
                      {selectedItems.includes("all") ? (
                        <Badge
                          key="all"
                          className="mr-2 rounded-[4px] font-normal"
                        >
                          All
                          <button
                            className="ml-1 text-white"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the button from closing the popover
                              handleRemoveAll(); // Remove "All"
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Badge>
                      ) : (
                        <>
                          {selectedItems
                            .slice(0, showLimit)
                            .map((id: string) => (
                              <Badge
                                key={id}
                                className="mr-2 rounded-[4px] font-normal"
                              >
                                {data.find((el) => el.id === id)?.value}
                                <button
                                  className="ml-1 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectItem(id);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </Badge>
                            ))}
                          {selectedItems.length > showLimit && (
                            <span> +{selectedItems.length - showLimit}</span>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    `Select...`
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`p-0`}
              style={{ width: buttonWidth ? `${buttonWidth}px` : "auto" }}
            >
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 opacity-50" />
                  <input
                    type="text"
                    placeholder={`Search...`}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-wrap"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <CommandList>
                  <CommandItem
                    key="all"
                    onSelect={() => handleSelectItem("all")}
                    className={cn(
                      "cursor-pointer flex justify-start gap-2",
                      isAllDisabled ? "text-muted" : "",
                      isAllSelected && "text-primary",
                      isAllDisabled ? "hover:no-underline" : "",
                      isAllSelected ? "hover:no-underline" : ""
                    )}
                    disabled={isAllDisabled}
                  >
                    <Check
                      className={cn(
                        "ml-1 h-2 w-2 text-customBlack-v1",
                        isAllSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All
                  </CommandItem>

                  {data
                    .filter((element) =>
                      element.value
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((element) => (
                      <CommandItem
                        key={element.id}
                        onSelect={() => handleSelectItem(element.id)}
                        className={cn(
                          "cursor-pointer flex justify-start gap-2",
                          isAllSelected ? "text-muted" : "",
                          isAllSelected ? "hover:no-underline hidden" : ""
                        )}
                      >
                        <Check
                          className={cn(
                            "ml-1 h-2 w-2 text-customBlack-v1",
                            selectedItems.includes(element.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {element.value}
                      </CommandItem>
                    ))}
                </CommandList>
              </Command>
              <div className="flex justify-between p-2 gap-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                >
                  Apply/Close
                </Button>

                <Button
                  onClick={() => {
                    setValue(name, []);
                  }}
                  variant="outline"
                  className="w-full "
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </FormControl>
      </div>
      <CustomFormMessage className="w-full">{error?.message}</CustomFormMessage>
    </FormItem>
  );
};

type Props = {
  name: string;
  label: string;
  control: Control<FieldValues>;
  data: { id: string; value: string }[];
  icon?: ReactNode;
  showLimit?: number;
  leftPositionLabel?: boolean;
  withLabel?: string;
  isDisabled?: boolean;
};

export default CustomMultiSelect;

"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconSearch } from "../../../../assets/images";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ModalAdd from "./ModalAdd";
import { BranchProps, UserProps } from "@/types/types";
import useUsersStore from "@/store/useUsers";
import useBranchesStore from "@/store/useBranches";
import FormFilterBranch from "./shared/filter/FormFilterUsersBranch";
import { useGetRoles } from "@/hooks/useRoles";

type Props = {
  usersSelected: UserProps[];
  branchesSelected: BranchProps[];
};

const Filter = ({ usersSelected, branchesSelected }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setUsers } = useUsersStore();
  const { setBranches } = useBranchesStore();

  const {
    data: dataRoles,
    error: errorRoles,
    isLoading: isLoadingRoles,
  } = useGetRoles({
    page: 1,
    limit: 100,
    query: "",
  });

  const [selectedValue, setSelectedValue] = useState("users");
  const FormSchema = z.object({
    search: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  const { setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams(searchParams || "");
    params.set("search", data.search ?? "");
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  const handleTypeClick = (typeValue: string) => {
    // Remove the 'filterBy' parameter if it exists
    const params = new URLSearchParams(searchParams || "");
    params.set("type", typeValue);
    params.delete("filterBy"); // Make sure to remove 'filterBy' when changing 'type'
    params.set("page", "1");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("status");
    params.delete("provinces");
    params.delete("status");
    params.delete("roles");
    params.delete("search");

    router.push(`?${params.toString()}`);
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    handleTypeClick(value);
  };

  const handleDeleteSelected = () => {
    setUsers(usersSelected);
    setBranches(branchesSelected);
  };

  // Retrieve the value of the `type` parameter from the URL when the component is mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      const typeFromUrl = currentUrl.searchParams.get("type");
      if (typeFromUrl) {
        setSelectedValue(typeFromUrl);
      }
    }
  }, []);

  const type = searchParams ? searchParams.get("type") : null;

  useEffect(() => {
    setValue("search", searchParams?.get("search") ?? "", {
      shouldDirty: true,
    });
  }, [searchParams, setValue]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative">
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Option</SelectLabel>
              <SelectItem value="users" bg="custom">
                Users
              </SelectItem>
              <SelectItem value="branch" bg="custom">
                Branch
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex flex-col lg:flex-row flex-1 justify-end gap-3 w-full">
          <div className="w-full md:w-full lg:w-[336px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full gap-6 flex items-center"
              >
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex gap-3 relative">
                          <span className="absolute left-4 top-4">
                            <Image src={IconSearch} alt="Search" />
                          </span>
                          <Input
                            placeholder="Search.."
                            {...field}
                            className="pl-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="flex flex-row gap-3 md:gap-3 mt-3 md:mt-0 w-auto justify-end">
            <div className="flex-1 md:flex-none">
              <Button
                type="submit"
                variant={"outline"}
                className="flex gap-3 items-center btn-white-normal md:px-8 w-full md:w-auto"
                onClick={handleDeleteSelected}
                disabled={
                  !(usersSelected.length > 0 || branchesSelected.length > 0)
                }
              >
                Delete
              </Button>
            </div>
            <FormFilterBranch
              dataRoles={dataRoles?.data ?? []}
              errorRoles={errorRoles}
              isLoadingRoles={isLoadingRoles}
            />
            <ModalAdd selectedValue={selectedValue} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;

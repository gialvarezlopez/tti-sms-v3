"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { IconSearch } from "../../../../assets/images";
import Image from "next/image";

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
import { useEffect, useState } from "react";
import ModalAdd from "./ModalAdd";
import { BranchProps, UserProps } from "@/types/types";
import useUsersStore from "@/store/useUsers";
import useBranchesStore from "@/store/useBranches";
import FormFilterBranch from "./shared/filter/FormFilterBranch";

type Props = {
  //setBranchesSelected: React.Dispatch<React.SetStateAction<BranchProps[]>>;
  //setUserSelected: React.Dispatch<React.SetStateAction<UserProps[]>>;
  //setDeleteUsers: React.Dispatch<React.SetStateAction<boolean>>;
  usersSelected: UserProps[];
  branchesSelected: BranchProps[];
};

const Filter = ({
  //setBranchesSelected,
  //setUserSelected,
  //setDeleteUsers,
  usersSelected,
  branchesSelected,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setUsers } = useUsersStore();
  const { setBranches } = useBranchesStore();

  //const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("users");

  //const type = searchParams ? searchParams.get("type") : null;

  const FormSchema = z.object({
    username: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /*
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    */
  }

  // Centralized function to update URL parameters
  /*
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams || "");
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  // Function to handle the click on the 'filterBy' parameter
  const handleClick = (value: string) => {
    updateSearchParams("filterBy", value);
    setIsOpenDropdown(false);
  };
  */

  const handleTypeClick = (typeValue: string) => {
    // Remove the 'filterBy' parameter if it exists
    const params = new URLSearchParams(searchParams || "");
    params.set("type", typeValue);
    params.delete("filterBy"); // Make sure to remove 'filterBy' when changing 'type'
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
    const currentUrl = new URL(window.location.href);
    const typeFromUrl = currentUrl.searchParams.get("type");
    if (typeFromUrl) {
      setSelectedValue(typeFromUrl);
    }
  }, []);

  return (
    <>
      {/*
      <div className="flex justify-between items-center gap-6 relative">
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px]">
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
        <div className="flex flex-1 justify-end gap-3 ">
          <div className="w-full md:w-full md:max-w-[336px] ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full gap-6 flex items-center"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className=" w-full">
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

          <div className="flex gap-2 ">
            <Button
              type="submit"
              variant={"outline"}
              className="flex gap-3 items-center btn-white-normal px-8"
              onClick={handleDeleteSelected}
              disabled={
                !(usersSelected.length > 0 || branchesSelected.length > 0)
              }
            >
              Delete
            </Button>
            <FormFilterBranch />

            <ModalAdd selectedValue={selectedValue} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
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

        <div className="flex flex-col md:flex-row flex-1 justify-end gap-3 w-full">
          <div className="w-full md:w-[336px]">
           
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full gap-6 flex items-center"
              >
                <FormField
                  control={form.control}
                  name="username"
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

          <div className="flex flex-col md:flex-row gap-2 mt-3 md:mt-0">
            <Button
              type="submit"
              variant={"outline"}
              className="flex gap-3 items-center btn-white-normal px-8"
              onClick={handleDeleteSelected}
              disabled={
                !(usersSelected.length > 0 || branchesSelected.length > 0)
              }
            >
              Delete
            </Button>
            <FormFilterBranch />
            <ModalAdd selectedValue={selectedValue} />
          </div>
        </div>
      </div>
      */}

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative">
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            {" "}
            {/* Ajuste para pantallas pequeñas */}
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
            {" "}
            {/* Se mantiene el ancho en pantallas grandes */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full gap-6 flex items-center"
              >
                <FormField
                  control={form.control}
                  name="username"
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

          {/* Contenedor de botones ajustado */}
          <div className="flex flex-row gap-3 md:gap-3 mt-3 md:mt-0 w-auto justify-end">
            <Button
              type="submit"
              variant={"outline"}
              className="flex gap-3 items-center btn-white-normal px-8"
              onClick={handleDeleteSelected}
              disabled={
                !(usersSelected.length > 0 || branchesSelected.length > 0)
              }
            >
              Delete
            </Button>
            <FormFilterBranch />
            <ModalAdd selectedValue={selectedValue} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;

"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import FormBuildMessage from "@/components/screens/templates/BuildTemplate/FormBuildMessage";
import { useSingleTemplate } from "@/hooks/useTemplates";
import ErrorFetching from "@/components/ui/errorFetching";

const Page = () => {
  const params = useParams();
  const elementId = params?.id ?? "";

  const {
    data: currentTemplate,
    isFetching,
    error,
  } = useSingleTemplate(elementId as string);

  if (isFetching) {
    return <>Loading</>;
  }

  const template = currentTemplate.data || [];
  return (
    <div>
      <div className="flex justify-between gap-3 mb-6 flex-col md:flex-row">
        <h2 className="font-bold text-2xl md:order-first">New Message</h2>
        <div className="text-customRed-v1 font-semibold text-sm order-first md:order-last">
          <Link
            href="/messages/new-message"
            className=" flex gap-2 items-center"
          >
            <ArrowLeft /> Go back to templates
          </Link>
        </div>
      </div>

      {error && (
        <ErrorFetching
          message={error.message ?? "There was an error to get the data"}
        />
      )}

      {template && <FormBuildMessage isFromModal={false} template={template} />}
    </div>
  );
};

export default Page;

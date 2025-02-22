"use client";
import React from "react";
//import { useRouter } from "next/navigation";
import FilterTop from "./SearchTop";
import { Separator } from "@/components/ui/separator";
import TemplateSelection from "@/components/screens/templates/TemplateSelection";

const Message = () => {
  /*
  const router = useRouter();
  const [templateSelected, setTemplateSelected] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (templateSelected) {
      router.push(`/messages/new-message/${templateSelected}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateSelected]);
  */
  return (
    <div>
      <div className="flex justify-between gap-3">
        <h2 className="font-bold text-2xl">New Message</h2>
        <FilterTop />
      </div>

      <p className="py-3">Select the template that works best.</p>
      <Separator className="my-3" />

      <TemplateSelection
        //setTemplateSelected={setTemplateSelected}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        isLink={true}
      />
    </div>
  );
};

export default Message;

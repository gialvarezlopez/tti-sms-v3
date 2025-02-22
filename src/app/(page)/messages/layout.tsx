"use client";
//import AnimateMotion from "@/wrappers/AnimateMotion";
import MenuMessage from "@/components/screens/message/MenuMessage";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between">
      <div className="flex gap-6 justify-between">
        <h1 className="font-bold text-4xl">Message</h1>
      </div>

      <div className="rounded-lg bg-white my-6 px-4 flex-1 min-h-[calc(100vh-150px)]">
        <div className="flex gap-3 justify-between flex-col md:flex-row">
          <div className="py-4">
            <div className="sticky top-4  mr-3">
              <MenuMessage />
            </div>
          </div>

          <div className="flex-1 text-[#1D2433]/80 border-l border-l-[#E1E1E1] pl-6 py-4 pb-8 pt-6 min-h-[calc(100vh-150px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

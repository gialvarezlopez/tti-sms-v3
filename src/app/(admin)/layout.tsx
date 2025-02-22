import SideBar from "@/components/commons/sidebar/Sidebar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#141414] relative">
      <SideBar />

      <div
        className={`flex-1 px-6 py-7 rounded-tl-[20px] min-h-[100vh] overflow-x-auto bg-[#F9F9F9] ml-[227px] z-auto relative`}
      >
        {children}
      </div>
    </div>
  );
}

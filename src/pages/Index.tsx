
import { SprintBoard } from "@/components/SprintBoard/SprintBoard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <header className="bg-[#8B1D3D] text-white px-6 py-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Sprint Flow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">
              Hey Student, ready for your next sprint?
            </span>
          </div>
        </div>
        <div className="mt-2">
          <Breadcrumb>
            <BreadcrumbList className="text-white/70">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Spring '25</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white font-medium">Sprint Board</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main>
        <SprintBoard />
      </main>
    </div>
  );
};

export default Index;

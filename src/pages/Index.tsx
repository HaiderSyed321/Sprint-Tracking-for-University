
import { SprintBoard } from "@/components/SprintBoard/SprintBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <header className="bg-[#8B1D3D] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Sprint Flow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">
              Hey Student, ready for your next sprint?
            </span>
          </div>
        </div>
      </header>
      <main>
        <SprintBoard />
      </main>
    </div>
  );
};

export default Index;

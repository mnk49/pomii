import PomiiTimer from "@/components/pomii/PomiiTimer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="relative z-10 w-full max-w-4xl">
        <PomiiTimer />
      </div>
      <div className="absolute bottom-2 z-10">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
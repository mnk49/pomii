import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="animated-mesh-gradient-container">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>
      <div className="relative z-10">
        <PomodoroTimer />
      </div>
      <div className="absolute bottom-4 z-10">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
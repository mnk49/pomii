import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <PomodoroTimer />
      <div className="absolute bottom-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
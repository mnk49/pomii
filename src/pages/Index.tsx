import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
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
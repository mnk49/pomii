import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess } from '@/utils/toast';
import { Cog } from 'lucide-react';
import SettingsDialog, { SessionTimes } from './SettingsDialog';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const DEFAULT_TIMES: SessionTimes = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const POMODOROS_UNTIL_LONG_BREAK = 4;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const PomodoroTimer = () => {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [sessionTimes, setSessionTimes] = useState<SessionTimes>(DEFAULT_TIMES);
  const [timeLeft, setTimeLeft] = useState(sessionTimes.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);

  const handleModeChange = useCallback((newMode: Mode, resetPomodoros = false) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(sessionTimes[newMode]);
    if (resetPomodoros) {
      setPomodoroCount(0);
    }
  }, [sessionTimes]);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - Pomodoro`;
  }, [timeLeft]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (timeLeft === 0) {
      const message = `Time for your ${mode === 'pomodoro' ? 'break' : 'pomodoro'}!`;
      showSuccess(message);
      
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      audio.play().catch(e => console.error("Error playing sound:", e));

      if (mode === 'pomodoro') {
        const newPomodoroCount = pomodoroCount + 1;
        setPomodoroCount(newPomodoroCount);
        const nextMode = newPomodoroCount > 0 && newPomodoroCount % POMODOROS_UNTIL_LONG_BREAK === 0
          ? 'longBreak'
          : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(sessionTimes[nextMode]);
        setIsActive(autoStartBreaks);
      } else {
        setMode('pomodoro');
        setTimeLeft(sessionTimes.pomodoro);
        setIsActive(autoStartPomodoros);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionTimes, pomodoroCount, autoStartBreaks, autoStartPomodoros]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionTimes[mode]);
  };

  const handleSaveSettings = (newSettings: { 
    pomodoro: number; 
    shortBreak: number; 
    longBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  }) => {
    const newSessionTimes = {
      pomodoro: newSettings.pomodoro * 60,
      shortBreak: newSettings.shortBreak * 60,
      longBreak: newSettings.longBreak * 60,
    };
    setSessionTimes(newSessionTimes);
    setAutoStartBreaks(newSettings.autoStartBreaks);
    setAutoStartPomodoros(newSettings.autoStartPomodoros);

    setIsActive(false);
    setTimeLeft(newSessionTimes[mode]);
    
    showSuccess("Settings saved!");
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
        <CardHeader className="relative">
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Cog className="h-5 w-5 text-foreground/60 hover:text-foreground/80 transition-colors" />
            </Button>
          </div>
          <CardTitle className="text-center text-lg font-medium pt-8 text-foreground/80">Pomodoro</CardTitle>
          <Tabs value={mode} onValueChange={(value) => handleModeChange(value as Mode, true)} className="w-full pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-200/80 dark:bg-slate-900/80 p-1 h-auto rounded-lg">
              <TabsTrigger value="pomodoro" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm rounded-md">Pomodoro</TabsTrigger>
              <TabsTrigger value="shortBreak" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm rounded-md">Short Break</TabsTrigger>
              <TabsTrigger value="longBreak" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm rounded-md">Long Break</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center py-10">
          <div className="text-8xl font-semibold font-mono tracking-tighter text-primary">
            {formatTime(timeLeft)}
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            {mode === 'pomodoro' ? `Completed Pomodoros: ${pomodoroCount}` : 'Time to relax and recharge!'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={toggleTimer} size="lg" className="w-36 text-lg rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow">
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} size="lg" variant="outline" className="w-36 text-lg rounded-lg border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-black/10">
            Reset
          </Button>
        </CardFooter>
      </Card>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        sessionTimes={sessionTimes}
        autoStartBreaks={autoStartBreaks}
        autoStartPomodoros={autoStartPomodoros}
        onSave={handleSaveSettings}
      />
    </>
  );
};

export default PomodoroTimer;
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess } from '@/utils/toast';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMES: Record<Mode, number> = {
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
  const [timeLeft, setTimeLeft] = useState(TIMES[mode]);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const handleModeChange = useCallback((newMode: Mode, resetPomodoros = false) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(TIMES[newMode]);
    if (resetPomodoros) {
      setPomodoroCount(0);
    }
  }, []);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - Pomodoro`;
  }, [timeLeft]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (timeLeft === 0) {
      setIsActive(false);
      
      const message = `Time for your ${mode === 'pomodoro' ? 'break' : 'pomodoro'}!`;
      showSuccess(message);
      
      // Play a notification sound
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      audio.play().catch(e => console.error("Error playing sound:", e));

      if (mode === 'pomodoro') {
        const newPomodoroCount = pomodoroCount + 1;
        setPomodoroCount(newPomodoroCount);
        if (newPomodoroCount > 0 && newPomodoroCount % POMODOROS_UNTIL_LONG_BREAK === 0) {
          handleModeChange('longBreak');
        } else {
          handleModeChange('shortBreak');
        }
      } else {
        handleModeChange('pomodoro');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, handleModeChange, pomodoroCount]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMES[mode]);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Pomodoro Timer</CardTitle>
        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as Mode, true)} className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center py-10">
        <div className="text-8xl font-bold tracking-tighter text-primary">
          {formatTime(timeLeft)}
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          Completed Pomodoros: {pomodoroCount}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button onClick={toggleTimer} size="lg" className="w-36 text-lg">
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer} size="lg" variant="outline" className="w-36 text-lg">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
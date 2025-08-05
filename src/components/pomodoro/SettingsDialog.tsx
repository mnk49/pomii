import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SessionTimes {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export const soundOptions = [
  { id: 'bell', name: 'Bell', url: 'https://actions.google.com/sounds/v1/alarms/bell_timer.ogg' },
  { id: 'chime', name: 'Chime', url: 'https://actions.google.com/sounds/v1/notifications/positive_notification.ogg' },
  { id: 'alarm', name: 'Alarm Clock', url: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
  { id: 'none', name: 'None (Mute)', url: '' },
];

const settingsSchema = z.object({
  pomodoro: z.coerce.number().min(1, "Must be at least 1 minute.").max(120, "Cannot exceed 120 minutes."),
  shortBreak: z.coerce.number().min(1, "Must be at least 1 minute.").max(60, "Cannot exceed 60 minutes."),
  longBreak: z.coerce.number().min(1, "Must be at least 1 minute.").max(120, "Cannot exceed 120 minutes."),
  autoSwitch: z.boolean().default(true),
  sound: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sessionTimes: SessionTimes;
  autoSwitch: boolean;
  selectedSound: string;
  onSave: (newSettings: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    autoSwitch: boolean;
    sound: string;
  }) => void;
}

const SettingsDialog = ({ isOpen, onOpenChange, sessionTimes, autoSwitch, selectedSound, onSave }: SettingsDialogProps) => {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        pomodoro: sessionTimes.pomodoro / 60,
        shortBreak: sessionTimes.shortBreak / 60,
        longBreak: sessionTimes.longBreak / 60,
        autoSwitch: autoSwitch,
        sound: selectedSound,
      });
    }
  }, [isOpen, sessionTimes, autoSwitch, selectedSound, form]);

  const onSubmit = (data: SettingsFormValues) => {
    onSave({
      pomodoro: data.pomodoro,
      shortBreak: data.shortBreak,
      longBreak: data.longBreak,
      autoSwitch: data.autoSwitch,
      sound: data.sound,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-100/90 dark:bg-slate-900/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Set the length of your sessions and notification preferences.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="pomodoro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pomodoro (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortBreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Break (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longBreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Break (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="autoSwitch"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Auto-switch sessions</FormLabel>
                    <FormDescription>
                      Automatically switch to the next session.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Sound</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sound" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {soundOptions.map(option => (
                        <SelectItem key={option.id} value={option.url}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
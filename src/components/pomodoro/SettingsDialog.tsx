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
import { Switch } from '@/components/ui/switch';

export interface SessionTimes {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

const settingsSchema = z.object({
  pomodoro: z.coerce.number().min(1, "Must be at least 1 minute.").max(120, "Cannot exceed 120 minutes."),
  shortBreak: z.coerce.number().min(1, "Must be at least 1 minute.").max(60, "Cannot exceed 60 minutes."),
  longBreak: z.coerce.number().min(1, "Must be at least 1 minute.").max(120, "Cannot exceed 120 minutes."),
  autoStartBreaks: z.boolean().default(false),
  autoStartPomodoros: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sessionTimes: SessionTimes;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  onSave: (newSettings: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  }) => void;
}

const SettingsDialog = ({ isOpen, onOpenChange, sessionTimes, onSave, autoStartBreaks, autoStartPomodoros }: SettingsDialogProps) => {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      autoStartBreaks: false,
      autoStartPomodoros: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        pomodoro: sessionTimes.pomodoro / 60,
        shortBreak: sessionTimes.shortBreak / 60,
        longBreak: sessionTimes.longBreak / 60,
        autoStartBreaks,
        autoStartPomodoros,
      });
    }
  }, [isOpen, sessionTimes, autoStartBreaks, autoStartPomodoros, form]);

  const onSubmit = (data: SettingsFormValues) => {
    onSave({
      pomodoro: data.pomodoro,
      shortBreak: data.shortBreak,
      longBreak: data.longBreak,
      autoStartBreaks: data.autoStartBreaks,
      autoStartPomodoros: data.autoStartPomodoros,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-100/90 dark:bg-slate-900/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Set the length of your sessions and auto-start preferences.
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
              name="autoStartBreaks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                  <div>
                    <FormLabel className="text-base">Auto Start Breaks</FormLabel>
                    <FormDescription>
                      Automatically start breaks after a pomodoro.
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
              name="autoStartPomodoros"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-base">Auto Start Pomodoros</FormLabel>
                    <FormDescription>
                      Automatically start pomodoros after a break.
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
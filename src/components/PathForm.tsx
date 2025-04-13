
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(3, { message: "Path title must be at least 3 characters" }),
  totalCourses: z.coerce.number().min(1, { message: "At least 1 course is required" }),
  deadline: z.date({
    required_error: "A deadline is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type PathFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (path: FormValues) => void;
  initialData?: {
    id?: string;
    title?: string;
    totalCourses?: number;
    deadline?: Date;
  };
};

export default function PathForm({ isOpen, onClose, onSave, initialData }: PathFormProps) {
  const isEditing = !!initialData?.id;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      totalCourses: initialData?.totalCourses || 1,
      deadline: initialData?.deadline || new Date(),
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave(values);
    form.reset();
    onClose();
    
    toast({
      title: `Learning path ${isEditing ? "updated" : "created"}`,
      description: `"${values.title}" has been ${isEditing ? "updated" : "created"} successfully.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Learning Path" : "Create New Learning Path"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Development Fundamentals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalCourses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Courses</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Save Changes" : "Create Path"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

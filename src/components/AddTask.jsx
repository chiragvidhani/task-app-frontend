import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";
import taskStore from "../store/taskStore";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(100, "Maximum 100 characters"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "completed"]).optional(),
  dueDate: z.date().optional().nullable(),
});

// useEffect(() => {

// }, [handleSubmit])

export function AddTask({
  openAddTaskModal,
  setOpenAddTaskModal,
  editData,
  setEditData,
  title,
  setTitle,
  buttonName,
  setButtonName,
  mode,
  setMode,
  filterTask,
}) {
  const { accessToken } = useAuthStore((state) => state.accessToken);
  const { taskData, setTaskData } = taskStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      status: "",
      dueDate: null,
    },
  });

  const handleSubmit = async (values) => {
    let data = {
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate : null,
    };

    let config = {
      method: mode == "edit" ? "put" : "post",
      maxBodyLength: Infinity,
      url:
        `${import.meta.env.VITE_API_URL}` +
        (mode == "edit"
          ? `/user/editTask?taskID=${editData._id}`
          : "/user/createTask"),
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        form.reset();
        setOpenAddTaskModal(false);
        filterTask();
        toast.success(
          `Task ${mode === "edit" ? "edited" : "added"} successfully`,
          { style: { background: "green", color: "white" } }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.data, {
          style: {
            background: "red",
            color: "white",
          },
        });
      });
  };

  useEffect(() => {
    if (editData !== null) {
      form.reset({
        title: editData?.title || "",
        description: editData?.description || "",
        priority: editData?.priority || "",
        dueDate: editData?.dueDate
          ? new Date(
              new Date(editData.dueDate).getTime() +
                new Date(editData.dueDate).getTimezoneOffset() * 60000
            )
          : null,

        status: editData?.status || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        priority: "",
        dueDate: null,
        status: "",
      });
    }
  }, [editData, form]);

  return (
    <Dialog
      open={openAddTaskModal}
      onOpenChange={() => setOpenAddTaskModal(false)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      type="text"
                      placeholder="Enter description"
                      className="max-h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              className="w-full"
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="relative overflow-hidden">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={"w-full capitalize"}>
                        <SelectValue placeholder="Select Task Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full p-0 max-h-40 overflow-auto">
                      {["low", "medium", "high"].map((data, i) => (
                        <SelectItem className="capitalize" value={data} key={i}>
                          {data}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              className="w-full"
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="relative overflow-hidden">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={"w-full capitalize"}>
                        <SelectValue placeholder="Select Task Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full p-0 max-h-40 overflow-auto">
                      {["pending", "completed"].map((data, i) => (
                        <SelectItem className="capitalize" value={data} key={i}>
                          {data}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            "pl-3 text-left font-normal text-muted-foreground"
                          }
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Mandatory</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultValue={null}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date().setHours(0, 0, 0, 0) ||
                          date > new Date("2100-10-16")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {buttonName}
            </Button>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

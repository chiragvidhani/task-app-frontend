import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns/format";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { AddTask } from "./AddTask";
import taskStore from "../store/taskStore";
import useAuthStore from "../store/authStore";
import axios from "axios";
import { CommonDeleteModal } from "./DeleteModal";
import { toast } from "sonner";

export function TaskTable({ data, setData, filterTask }) {
  const {accessToken} = useAuthStore((state) => state.accessToken);
  const { taskData } = taskStore();
  const [selectedFilterByPriority, setSelectedFilterByPriority] =
    useState(null);
  const [selectedFilterByStatus, setSelectedFilterByStatus] = useState(null);
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [title, setTitle] = useState("Add task");
  const [buttonName, setButtonName] = useState("Add task");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);

  const handleDelete = async () => {
    setLoading(true)
    try {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_API_URL}/user/deleteTask?taskID=${selectedTask}`,
        headers: {
          Authorization: accessToken
        },
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(response.data.data);
          if (response.data.success) {
            setLoading(false);
            setOpenDeleteModal(false)
            filterTask();
            setSelectedTask("")
            toast.success("Task deleted successfully")
          }
        })
        .catch((error) => {
          console.log(error);
           toast.error("Error")
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    filterTask(null, null, page);
  }, [page]);

  return (
    <div className="flex flex-col gap-2">
      <AddTask
        openAddTaskModal={openAddTaskModal}
        setOpenAddTaskModal={setOpenAddTaskModal}
        editData={editData}
        setEditData={setEditData}
        title={title}
        setTitle={setTitle}
        buttonName={buttonName}
        setButtonName={setButtonName}
        mode={mode}
        setMode={setMode}
        filterTask={filterTask}
      />
      <div className="flex gap-1 justify-between">
        <Input
          onChange={(e) => filterTask("search", e.target.value)}
          type="text"
          className="w-1/2"
          placeholder="Search by title"
        />
        <div className="w-full flex justify-end gap-3">
          <Button
            onClick={() => {
              setOpenAddTaskModal(true),
                setButtonName("Add task"),
                setTitle("Add Task");
            }}
            variant=""
            className="bg-green-500 hover:bg-green-600 w-[20%] self-end"
          >
            Add Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 ">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {["low", "medium", "high"]?.map((elem, i) => (
                <DropdownMenuCheckboxItem
                  key={i}
                  checked={selectedFilterByPriority === elem}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFilterByPriority(elem);
                      filterTask("priority", elem);
                    } else {
                      setSelectedFilterByPriority(null);
                      filterTask();
                    }
                  }}
                >
                  {elem}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {["pending", "completed"]?.map((elem, i) => (
                <DropdownMenuCheckboxItem
                  key={i}
                  checked={selectedFilterByStatus === elem}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFilterByStatus(elem);
                      filterTask("status", elem);
                    } else {
                      setSelectedFilterByStatus(null);
                      filterTask();
                    }
                  }}
                >
                  {elem}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border py-2">
        <Table>
          <TableCaption>A list of your recent Tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">S No.</TableHead>
              <TableHead className="text-center w-[100px]">Title</TableHead>
              <TableHead className="w-[100px]">Description</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Due Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskData?.taskList?.map((invoice, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-left">{i + 1}</TableCell>
                <TableCell className="font-medium">{invoice.title}</TableCell>
                <TableCell className="font-medium">
                  {invoice.description}
                </TableCell>
                <TableCell className="capitalize">{invoice.priority}</TableCell>
                <TableCell>
                  {invoice.dueDate
                    ? format(new Date(invoice.dueDate), "PPP")
                    : "-"}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {invoice.status}
                </TableCell>
                <TableCell className="text-right capitalize flex gap-1">
                  <Button
                    className="size-8"
                    onClick={() => {
                      setMode("edit"),
                        setEditData(invoice),
                        setOpenAddTaskModal(true);
                      setTitle("Edit Task");
                      setButtonName("Save");
                    }}
                  >
                    <Pen className="size-3" />
                  </Button>
                  <Button
                    className="size-8 bg-red-700 hover:bg-red-600"
                    onClick={() => {setOpenDeleteModal(true), setSelectedTask(invoice._id)}}
                  >
                    <Trash className="size-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="w-full">
              <TableCell colSpan={3}>Total Tasks</TableCell>
              <TableCell className="text-right">{taskData?.count}</TableCell>
              <div className="w-full flex gap-2">
                <Button
                  disabled={page <= 1}
                  onClick={() => {
                    setPage(--page);
                  }}
                >
                  Previous
                </Button>
                <Button
                  disabled={page >= Math.ceil(taskData?.count / 5)}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </TableRow>
          </TableFooter>
        </Table>
        <CommonDeleteModal 
        setDelModalOpen={setOpenDeleteModal}
        delModalOpen={openDeleteModal}
        handleEvent={handleDelete}
        dialogTitle={"Delete Task"} 
        dialogDescription={"Are you sure you want to delete this task?"}
        loading={loading} />
      </div>
    </div>
  );
}

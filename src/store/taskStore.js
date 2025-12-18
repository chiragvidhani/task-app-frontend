import { create } from "zustand";

const taskStore = create((set) => ({
  taskData: [],

  setTaskData: (tasks) =>
    set(() => ({
      taskData: tasks, // replace list
    })),

  addTask: (task) =>
    set((state) => ({
      taskData: [...state.taskData, task], // add one
    })),
}));

export default taskStore;

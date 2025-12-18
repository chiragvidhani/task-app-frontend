import { create } from "zustand";

const toggleSidebar = create((set) => ({
  isListingActive: false,
  isSidebarActive: false,
  listingToggleHandler: () =>
    set((state) => ({ isListingActive: !state.isListingActive })),
  SidebarToggleHandler: () =>
    set((state) => ({
      isSidebarActive: !state.isSidebarActive,
    })),
}));

export default toggleSidebar;

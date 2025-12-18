import {create} from "zustand";

const profileStore = create((set) => ({
  profileData: null,
  setProfileData: (data) =>
    set((state) => ({
      profileData: { ...state.profileData, ...data },
    })),
}));

export default profileStore;

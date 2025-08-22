import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserStore {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
  getFollowers: (userId: string) => User[];
  getFollowing: (userId: string) => User[];
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 1,
          email: 'alex@example.com',
          username: 'alexchen',
          name: { firstname: 'Alex', lastname: 'Chen' },
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          bio: 'Outdoor enthusiast. Coffee lover. Product reviewer.',
          address: {
            city: 'New York',
            street: '5th Ave',
            number: 123,
            zipcode: '10001',
            geolocation: { lat: '40.7128', long: '-74.0060' }
          },
          phone: '555-1234',
          followers: ['2'],
          following: ['2'],
          joined: '2024-01-10',
          isInfluencer: false
        },
        {
          id: 2,
          email: 'sarah@example.com',
          username: 'sarahj',
          name: { firstname: 'Sarah', lastname: 'Johnson' },
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400',
          bio: 'Fashion & lifestyle influencer. Sharing daily outfits.',
          address: {
            city: 'Los Angeles',
            street: 'Sunset Blvd',
            number: 456,
            zipcode: '90001',
            geolocation: { lat: '34.0522', long: '-118.2437' }
          },
          phone: '555-5678',
          followers: ['1'],
          following: ['1'],
          joined: '2023-11-20',
          isInfluencer: true
        }
      ],
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      followUser: (userId) => set((state) => {
        if (!state.currentUser) return {};
        if (state.currentUser.following.includes(userId)) return {};
        const updatedCurrent = {
          ...state.currentUser,
          following: [...state.currentUser.following, userId]
        };
        const updatedUsers = state.users.map(u =>
          u.id.toString() === state.currentUser!.id.toString()
            ? updatedCurrent
            : u.id.toString() === userId
              ? { ...u, followers: [...u.followers, state.currentUser!.id.toString()] }
              : u
        );
        return { currentUser: updatedCurrent, users: updatedUsers };
      }),
      unfollowUser: (userId) => set((state) => {
        if (!state.currentUser) return {};
        if (!state.currentUser.following.includes(userId)) return {};
        const updatedCurrent = {
          ...state.currentUser,
          following: state.currentUser.following.filter(id => id !== userId)
        };
        const updatedUsers = state.users.map(u =>
          u.id.toString() === state.currentUser!.id.toString()
            ? updatedCurrent
            : u.id.toString() === userId
              ? { ...u, followers: u.followers.filter(id => id !== state.currentUser!.id.toString()) }
              : u
        );
        return { currentUser: updatedCurrent, users: updatedUsers };
      }),
      getUserById: (userId) => get().users.find(u => u.id.toString() === userId),
      getFollowers: (userId) => {
        const user = get().users.find(u => u.id.toString() === userId);
        if (!user) return [];
        return get().users.filter(u => user.followers.includes(u.id.toString()));
      },
      getFollowing: (userId) => {
        const user = get().users.find(u => u.id.toString() === userId);
        if (!user) return [];
        return get().users.filter(u => user.following.includes(u.id.toString()));
      }
    }),
    { name: 'user-storage' }
  )
);

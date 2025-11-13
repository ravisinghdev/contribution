export type UserRole = "main_admin" | "parallel_admin" | "student" | "guest";

export interface Announcement {
  id: number;
  farewell_id: number;
  user_id: string;
  title: string;
  content: string;
  is_urgent: boolean;
  created_at: string;
}

export interface AnnouncementRead {
  id: number;
  announcement_id: number;
  user_id: string;
  read_at: string | null;
}

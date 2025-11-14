export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcement_reads: {
        Row: {
          announcement_id: number
          id: number
          metadata: Json | null
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: number
          id?: number
          metadata?: Json | null
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: number
          id?: number
          metadata?: Json | null
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string | null
          farewell_id: number
          id: number
          is_urgent: boolean | null
          pinned: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          farewell_id: number
          id?: number
          is_urgent?: boolean | null
          pinned?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          farewell_id?: number
          id?: number
          is_urgent?: boolean | null
          pinned?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      backup_recurring_contributions: {
        Row: {
          created_at: string | null
          executed: boolean | null
          frequency: string | null
          id: number | null
          schedule_date: string | null
          transaction_id: number | null
        }
        Insert: {
          created_at?: string | null
          executed?: boolean | null
          frequency?: string | null
          id?: number | null
          schedule_date?: string | null
          transaction_id?: number | null
        }
        Update: {
          created_at?: string | null
          executed?: boolean | null
          frequency?: string | null
          id?: number | null
          schedule_date?: string | null
          transaction_id?: number | null
        }
        Relationships: []
      }
      backup_transaction_audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: number | null
          metadata: Json | null
          performed_by: string | null
          transaction_id: number | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: number | null
          metadata?: Json | null
          performed_by?: string | null
          transaction_id?: number | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: number | null
          metadata?: Json | null
          performed_by?: string | null
          transaction_id?: number | null
        }
        Relationships: []
      }
      backup_transactions: {
        Row: {
          amount: number | null
          chargeback: boolean | null
          created_at: string | null
          currency: string | null
          farewell_id: number | null
          id: number | null
          is_dummy: boolean | null
          logged_by_admin_id: string | null
          metadata: Json | null
          notes: string | null
          parent_transaction_id: number | null
          payment_gateway_id: string | null
          receipt_url: string | null
          recipient_user_id: string | null
          refunded_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          chargeback?: boolean | null
          created_at?: string | null
          currency?: string | null
          farewell_id?: number | null
          id?: number | null
          is_dummy?: boolean | null
          logged_by_admin_id?: string | null
          metadata?: Json | null
          notes?: string | null
          parent_transaction_id?: number | null
          payment_gateway_id?: string | null
          receipt_url?: string | null
          recipient_user_id?: string | null
          refunded_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          chargeback?: boolean | null
          created_at?: string | null
          currency?: string | null
          farewell_id?: number | null
          id?: number | null
          is_dummy?: boolean | null
          logged_by_admin_id?: string | null
          metadata?: Json | null
          notes?: string | null
          parent_transaction_id?: number | null
          payment_gateway_id?: string | null
          receipt_url?: string | null
          recipient_user_id?: string | null
          refunded_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          room_id: number
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          room_id: number
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          room_id?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          room_id: number
          user_id: string
        }
        Insert: {
          room_id: number
          user_id: string
        }
        Update: {
          room_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          farewell_id: number | null
          id: number
          name: string | null
          room_type: Database["public"]["Enums"]["chat_room_type"]
        }
        Insert: {
          created_at?: string | null
          farewell_id?: number | null
          id?: number
          name?: string | null
          room_type: Database["public"]["Enums"]["chat_room_type"]
        }
        Update: {
          created_at?: string | null
          farewell_id?: number | null
          id?: number
          name?: string | null
          room_type?: Database["public"]["Enums"]["chat_room_type"]
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          farewell_id: number
          handled_by_admin_id: string | null
          id: number
          status: Database["public"]["Enums"]["complaint_status"]
          type: Database["public"]["Enums"]["complaint_type"]
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          farewell_id: number
          handled_by_admin_id?: string | null
          id?: number
          status?: Database["public"]["Enums"]["complaint_status"]
          type: Database["public"]["Enums"]["complaint_type"]
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          farewell_id?: number
          handled_by_admin_id?: string | null
          id?: number
          status?: Database["public"]["Enums"]["complaint_status"]
          type?: Database["public"]["Enums"]["complaint_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_handled_by_admin_id_fkey"
            columns: ["handled_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_handled_by_admin_id_fkey"
            columns: ["handled_by_admin_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contribution_rewards: {
        Row: {
          amount: number | null
          id: number
          issued_at: string | null
          issued_by: string
          reward_type: string
          transaction_id: number
        }
        Insert: {
          amount?: number | null
          id?: number
          issued_at?: string | null
          issued_by: string
          reward_type: string
          transaction_id: number
        }
        Update: {
          amount?: number | null
          id?: number
          issued_at?: string | null
          issued_by?: string
          reward_type?: string
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "contribution_rewards_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_rewards_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      duties: {
        Row: {
          assigned_by_admin_id: string
          created_at: string | null
          description: string | null
          farewell_id: number
          id: number
          title: string
        }
        Insert: {
          assigned_by_admin_id: string
          created_at?: string | null
          description?: string | null
          farewell_id: number
          id?: number
          title: string
        }
        Update: {
          assigned_by_admin_id?: string
          created_at?: string | null
          description?: string | null
          farewell_id?: number
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "duties_assigned_by_admin_id_fkey"
            columns: ["assigned_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duties_assigned_by_admin_id_fkey"
            columns: ["assigned_by_admin_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "duties_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
        ]
      }
      duty_assignments: {
        Row: {
          duty_id: number
          id: number
          student_id: string
        }
        Insert: {
          duty_id: number
          id?: number
          student_id: string
        }
        Update: {
          duty_id?: number
          id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duty_assignments_duty_id_fkey"
            columns: ["duty_id"]
            isOneToOne: false
            referencedRelation: "duties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duty_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duty_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      duty_submissions: {
        Row: {
          admin_notes: string | null
          amount_claimed: number
          created_at: string | null
          duty_id: number
          handled_by_admin_id: string | null
          id: number
          receipt_url: string
          related_transaction_id: number | null
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount_claimed: number
          created_at?: string | null
          duty_id: number
          handled_by_admin_id?: string | null
          id?: number
          receipt_url: string
          related_transaction_id?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
        }
        Update: {
          admin_notes?: string | null
          amount_claimed?: number
          created_at?: string | null
          duty_id?: number
          handled_by_admin_id?: string | null
          id?: number
          receipt_url?: string
          related_transaction_id?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duty_submissions_duty_id_fkey"
            columns: ["duty_id"]
            isOneToOne: false
            referencedRelation: "duties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duty_submissions_handled_by_admin_id_fkey"
            columns: ["handled_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duty_submissions_handled_by_admin_id_fkey"
            columns: ["handled_by_admin_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "duty_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duty_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      farewell_participants: {
        Row: {
          farewell_id: number
          id: number
          joined_at: string | null
          role: Database["public"]["Enums"]["farewell_role"]
          user_id: string
        }
        Insert: {
          farewell_id: number
          id?: number
          joined_at?: string | null
          role?: Database["public"]["Enums"]["farewell_role"]
          user_id: string
        }
        Update: {
          farewell_id?: number
          id?: number
          joined_at?: string | null
          role?: Database["public"]["Enums"]["farewell_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farewell_participants_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farewell_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farewell_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      farewells: {
        Row: {
          created_at: string | null
          event_year: number
          id: number
          invite_code: string | null
          name: string
          organizing_class: string | null
        }
        Insert: {
          created_at?: string | null
          event_year: number
          id?: number
          invite_code?: string | null
          name: string
          organizing_class?: string | null
        }
        Update: {
          created_at?: string | null
          event_year?: number
          id?: number
          invite_code?: string | null
          name?: string
          organizing_class?: string | null
        }
        Relationships: []
      }
      gallery_uploads: {
        Row: {
          caption: string | null
          created_at: string | null
          farewell_id: number
          id: number
          image_url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          farewell_id: number
          id?: number
          image_url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          farewell_id?: number
          id?: number
          image_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_uploads_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          farewell_id: number
          id: number
          payload: Json | null
          read: boolean | null
          type: string
        }
        Insert: {
          created_at?: string | null
          farewell_id: number
          id?: never
          payload?: Json | null
          read?: boolean | null
          type: string
        }
        Update: {
          created_at?: string | null
          farewell_id?: number
          id?: never
          payload?: Json | null
          read?: boolean | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          farewell_id: number
          id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          farewell_id: number
          id?: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          farewell_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          full_name: string
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      razorpay_orders: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          receipt: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          id: string
          metadata?: Json | null
          receipt?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          receipt?: string | null
          status?: string | null
        }
        Relationships: []
      }
      razorpay_payments: {
        Row: {
          amount: number
          bank: string | null
          captured: boolean | null
          created_at: string | null
          currency: string | null
          id: string
          method: string | null
          order_id: string | null
          raw: Json | null
          status: string | null
          vpa: string | null
        }
        Insert: {
          amount: number
          bank?: string | null
          captured?: boolean | null
          created_at?: string | null
          currency?: string | null
          id: string
          method?: string | null
          order_id?: string | null
          raw?: Json | null
          status?: string | null
          vpa?: string | null
        }
        Update: {
          amount?: number
          bank?: string | null
          captured?: boolean | null
          created_at?: string | null
          currency?: string | null
          id?: string
          method?: string | null
          order_id?: string | null
          raw?: Json | null
          status?: string | null
          vpa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "razorpay_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "razorpay_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_contributions: {
        Row: {
          created_at: string | null
          executed: boolean | null
          frequency: string
          id: number
          schedule_date: string
          transaction_id: number
        }
        Insert: {
          created_at?: string | null
          executed?: boolean | null
          frequency: string
          id?: number
          schedule_date: string
          transaction_id: number
        }
        Update: {
          created_at?: string | null
          executed?: boolean | null
          frequency?: string
          id?: number
          schedule_date?: string
          transaction_id?: number
        }
        Relationships: []
      }
      slams: {
        Row: {
          created_at: string | null
          farewell_id: number
          from_user_id: string
          id: number
          message: string
          to_user_id: string
        }
        Insert: {
          created_at?: string | null
          farewell_id: number
          from_user_id: string
          id?: number
          message: string
          to_user_id: string
        }
        Update: {
          created_at?: string | null
          farewell_id?: number
          from_user_id?: string
          id?: number
          message?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slams_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slams_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slams_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "slams_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slams_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string | null
          end_date: string | null
          frequency: string
          id: number
          plan_name: string
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          end_date?: string | null
          frequency: string
          id?: number
          plan_name: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          end_date?: string | null
          frequency?: string
          id?: number
          plan_name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transaction_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: number
          metadata: Json | null
          performed_by: string | null
          transaction_id: number | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: never
          metadata?: Json | null
          performed_by?: string | null
          transaction_id?: number | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: never
          metadata?: Json | null
          performed_by?: string | null
          transaction_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_audit_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_receipts: {
        Row: {
          id: number
          transaction_id: number | null
          uploaded_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          id?: never
          transaction_id?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          id?: never
          transaction_id?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_receipts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          chargeback: boolean | null
          created_at: string | null
          currency: string
          farewell_id: number
          id: number
          is_dummy: boolean | null
          logged_by_admin_id: string | null
          metadata: Json | null
          method: Database["public"]["Enums"]["transaction_method"]
          notes: string | null
          parent_transaction_id: number | null
          payment_gateway_id: string | null
          receipt_url: string | null
          recipient_user_id: string | null
          refunded_amount: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          total_amount: number | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          chargeback?: boolean | null
          created_at?: string | null
          currency?: string
          farewell_id: number
          id?: never
          is_dummy?: boolean | null
          logged_by_admin_id?: string | null
          metadata?: Json | null
          method?: Database["public"]["Enums"]["transaction_method"]
          notes?: string | null
          parent_transaction_id?: number | null
          payment_gateway_id?: string | null
          receipt_url?: string | null
          recipient_user_id?: string | null
          refunded_amount?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          total_amount?: number | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          chargeback?: boolean | null
          created_at?: string | null
          currency?: string
          farewell_id?: number
          id?: never
          is_dummy?: boolean | null
          logged_by_admin_id?: string | null
          metadata?: Json | null
          method?: Database["public"]["Enums"]["transaction_method"]
          notes?: string | null
          parent_transaction_id?: number | null
          payment_gateway_id?: string | null
          receipt_url?: string | null
          recipient_user_id?: string | null
          refunded_amount?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          total_amount?: number | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_admin_fkey"
            columns: ["logged_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_admin_fkey"
            columns: ["logged_by_admin_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_farewell_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_recipient_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_recipient_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tx_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_roles_view: {
        Row: {
          avatar_url: string | null
          farewell_id: number | null
          full_name: string | null
          role: Database["public"]["Enums"]["farewell_role"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farewell_participants_farewell_id_fkey"
            columns: ["farewell_id"]
            isOneToOne: false
            referencedRelation: "farewells"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_offline_payment: {
        Args: { p_admin: string; p_tx_id: number }
        Returns: Json
      }
      log_login_attempt: {
        Args: { email_in: string; ip_in: unknown; success: boolean }
        Returns: undefined
      }
      mark_last_login: { Args: { uid: string }; Returns: undefined }
    }
    Enums: {
      chat_room_type: "group" | "direct_message"
      complaint_status: "pending" | "resolved" | "rejected"
      complaint_type: "missing_chat_group" | "user_report"
      farewell_role:
        | "main_admin"
        | "parallel_admin"
        | "organizer"
        | "student"
        | "guest"
      submission_status: "pending" | "approved" | "rejected"
      transaction_method: "online" | "offline" | "cash" | "upi" | "other"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      transaction_type: "contribution" | "refund" | "adjustment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chat_room_type: ["group", "direct_message"],
      complaint_status: ["pending", "resolved", "rejected"],
      complaint_type: ["missing_chat_group", "user_report"],
      farewell_role: [
        "main_admin",
        "parallel_admin",
        "organizer",
        "student",
        "guest",
      ],
      submission_status: ["pending", "approved", "rejected"],
      transaction_method: ["online", "offline", "cash", "upi", "other"],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      transaction_type: ["contribution", "refund", "adjustment"],
    },
  },
} as const

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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      child_profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          full_name: string
          id: string
          jersey_number: string | null
          medical_notes: string | null
          parent_user_id: string
          position: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name: string
          id?: string
          jersey_number?: string | null
          medical_notes?: string | null
          parent_user_id: string
          position?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          full_name?: string
          id?: string
          jersey_number?: string | null
          medical_notes?: string | null
          parent_user_id?: string
          position?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      club_admins: {
        Row: {
          club_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_admins_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          league_id: string | null
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          child_member_id: string | null
          created_at: string
          event_id: string
          id: string
          marked_at: string | null
          marked_by: string | null
          notes: string | null
          status: string
          team_member_id: string | null
          updated_at: string
        }
        Insert: {
          child_member_id?: string | null
          created_at?: string
          event_id: string
          id?: string
          marked_at?: string | null
          marked_by?: string | null
          notes?: string | null
          status?: string
          team_member_id?: string | null
          updated_at?: string
        }
        Update: {
          child_member_id?: string | null
          created_at?: string
          event_id?: string
          id?: string
          marked_at?: string | null
          marked_by?: string | null
          notes?: string | null
          status?: string
          team_member_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_child_member_id_fkey"
            columns: ["child_member_id"]
            isOneToOne: false
            referencedRelation: "team_child_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          event_type: string
          external_id: string | null
          external_source: string | null
          id: string
          is_home_game: boolean | null
          location: string | null
          opponent: string | null
          start_time: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          is_home_game?: boolean | null
          location?: string | null
          opponent?: string | null
          start_time: string
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          is_home_game?: boolean | null
          location?: string | null
          opponent?: string | null
          start_time?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_recipients: {
        Row: {
          id: string
          is_read: boolean
          message_id: string
          read_at: string | null
          team_member_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_read?: boolean
          message_id: string
          read_at?: string | null
          team_member_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_read?: boolean
          message_id?: string
          read_at?: string | null
          team_member_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipients_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          is_group_message: boolean
          sender_id: string
          subject: string
          team_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_group_message?: boolean
          sender_id: string
          subject: string
          team_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_group_message?: boolean
          sender_id?: string
          subject?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string | null
          id: string
          paid_at: string | null
          status: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          assists: number | null
          created_at: string
          games_played: number
          goals: number | null
          id: string
          minutes_played: number | null
          red_cards: number | null
          season: string
          team_member_id: string
          yellow_cards: number | null
        }
        Insert: {
          assists?: number | null
          created_at?: string
          games_played?: number
          goals?: number | null
          id?: string
          minutes_played?: number | null
          red_cards?: number | null
          season: string
          team_member_id: string
          yellow_cards?: number | null
        }
        Update: {
          assists?: number | null
          created_at?: string
          games_played?: number
          goals?: number | null
          id?: string
          minutes_played?: number | null
          red_cards?: number | null
          season?: string
          team_member_id?: string
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_child_members: {
        Row: {
          child_id: string
          id: string
          is_active: boolean | null
          jersey_number: string | null
          joined_at: string
          position: string | null
          role: string
          team_id: string
        }
        Insert: {
          child_id: string
          id?: string
          is_active?: boolean | null
          jersey_number?: string | null
          joined_at?: string
          position?: string | null
          role?: string
          team_id: string
        }
        Update: {
          child_id?: string
          id?: string
          is_active?: boolean | null
          jersey_number?: string | null
          joined_at?: string
          position?: string | null
          role?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_child_members_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          is_active: boolean | null
          jersey_number: string | null
          joined_at: string
          position: string | null
          role: Database["public"]["Enums"]["app_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          jersey_number?: string | null
          joined_at?: string
          position?: string | null
          role: Database["public"]["Enums"]["app_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          jersey_number?: string | null
          joined_at?: string
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_resources: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          icon: string | null
          id: string
          is_pinned: boolean | null
          resource_type: string
          sort_order: number | null
          team_id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          icon?: string | null
          id?: string
          is_pinned?: boolean | null
          resource_type: string
          sort_order?: number | null
          team_id: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_pinned?: boolean | null
          resource_type?: string
          sort_order?: number | null
          team_id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_resources_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_stats: {
        Row: {
          created_at: string
          division: string | null
          goals_against: number | null
          goals_for: number | null
          id: string
          league_name: string | null
          league_rank: number | null
          losses: number
          season: string
          team_id: string
          ties: number
          updated_at: string
          wins: number
        }
        Insert: {
          created_at?: string
          division?: string | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          league_name?: string | null
          league_rank?: number | null
          losses?: number
          season: string
          team_id: string
          ties?: number
          updated_at?: string
          wins?: number
        }
        Update: {
          created_at?: string
          division?: string | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          league_name?: string | null
          league_rank?: number | null
          losses?: number
          season?: string
          team_id?: string
          ties?: number
          updated_at?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          age_group: string | null
          club_id: string
          created_at: string
          created_by: string
          gender: string | null
          id: string
          name: string
          sport: string | null
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          club_id: string
          created_at?: string
          created_by: string
          gender?: string | null
          id?: string
          name: string
          sport?: string | null
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          club_id?: string
          created_at?: string
          created_by?: string
          gender?: string | null
          id?: string
          name?: string
          sport?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_itinerary: {
        Row: {
          age_groups: string[] | null
          booking_reference: string | null
          booking_url: string | null
          cost_estimate: number | null
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          id: string
          item_type: string
          location: string | null
          notes: string | null
          sort_order: number | null
          start_time: string | null
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          age_groups?: string[] | null
          booking_reference?: string | null
          booking_url?: string | null
          cost_estimate?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          id?: string
          item_type: string
          location?: string | null
          notes?: string | null
          sort_order?: number | null
          start_time?: string | null
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          age_groups?: string[] | null
          booking_reference?: string | null
          booking_url?: string | null
          cost_estimate?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          id?: string
          item_type?: string
          location?: string | null
          notes?: string | null
          sort_order?: number | null
          start_time?: string | null
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_itinerary_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          created_by: string
          departure_date: string
          destination: string
          id: string
          meeting_location: string | null
          name: string
          notes: string | null
          return_date: string | null
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          departure_date: string
          destination: string
          id?: string
          meeting_location?: string | null
          name: string
          notes?: string | null
          return_date?: string | null
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          departure_date?: string
          destination?: string
          id?: string
          meeting_location?: string | null
          name?: string
          notes?: string | null
          return_date?: string | null
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_links: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          platform: string
          team_id: string
          thumbnail_url: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          platform: string
          team_id: string
          thumbnail_url?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          platform?: string
          team_id?: string
          thumbnail_url?: string | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_links_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_club_admin: {
        Args: { _club_id: string; _user_id: string }
        Returns: boolean
      }
      is_parent_of: {
        Args: { _child_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_manager: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "club_admin" | "team_manager" | "parent" | "player"
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
      app_role: ["club_admin", "team_manager", "parent", "player"],
    },
  },
} as const

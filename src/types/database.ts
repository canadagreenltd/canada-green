/**
 * Database types for Canada Green (profiles + payments + support).
 * Regenerate from Supabase CLI later if the schema grows.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PaymentStatus = "pending" | "active" | "declined";
export type TicketStatus = "open" | "closed";
export type ProfileRole = "user" | "admin";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: ProfileRole;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email?: string;
          role?: ProfileRole;
          referral_code: string;
          referred_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: ProfileRole;
          referral_code?: string;
          referred_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey";
            columns: ["referred_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_submissions: {
        Row: {
          id: string;
          user_id: string;
          amount_cad: number;
          receipt_path: string;
          status: PaymentStatus;
          decline_reason: string | null;
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          starts_at: string | null;
          ends_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_cad: number;
          receipt_path: string;
          status?: PaymentStatus;
          decline_reason?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_cad?: number;
          receipt_path?: string;
          status?: PaymentStatus;
          decline_reason?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payment_submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          status: TicketStatus;
          created_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          status?: TicketStatus;
          created_at?: string;
          closed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          status?: TicketStatus;
          created_at?: string;
          closed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          detail: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          detail?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          detail?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      referral_commissions: {
        Row: {
          id: string;
          beneficiary_id: string;
          source_user_id: string;
          payment_submission_id: string;
          level: number;
          rate: number;
          amount_cad: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          beneficiary_id: string;
          source_user_id: string;
          payment_submission_id: string;
          level: number;
          rate: number;
          amount_cad: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          beneficiary_id?: string;
          source_user_id?: string;
          payment_submission_id?: string;
          level?: number;
          rate?: number;
          amount_cad?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "referral_commissions_beneficiary_id_fkey";
            columns: ["beneficiary_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_commissions_source_user_id_fkey";
            columns: ["source_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_commissions_payment_submission_id_fkey";
            columns: ["payment_submission_id"];
            isOneToOne: false;
            referencedRelation: "payment_submissions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_rewards: {
        Row: {
          id: string;
          user_id: string;
          tier: string;
          note: string;
          granted_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier: string;
          note?: string;
          granted_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: string;
          note?: string;
          granted_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_rewards_granted_by_fkey";
            columns: ["granted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      get_my_referrer_id: { Args: Record<string, never>; Returns: string };
      get_my_team_profiles: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          full_name: string;
          referred_by: string | null;
          depth: number;
        }[];
      };
      distribute_referral_commissions: {
        Args: { p_payment_id: string };
        Returns: undefined;
      };
      ensure_my_profile: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          full_name: string;
          email: string;
          role: ProfileRole;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
        };
      };
      write_audit_log: {
        Args: {
          p_action: string;
          p_detail?: string;
          p_actor_id?: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
};

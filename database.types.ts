export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      context: {
        Row: {
          description: string;
          end_date: string | null;
          icon: string | null;
          id: number;
          label: string;
          localization: string;
          show_landing: boolean;
          start_date: string;
          type: number;
        };
        Insert: {
          description: string;
          end_date?: string | null;
          icon?: string | null;
          id?: number;
          label: string;
          localization: string;
          show_landing?: boolean;
          start_date: string;
          type: number;
        };
        Update: {
          description?: string;
          end_date?: string | null;
          icon?: string | null;
          id?: number;
          label?: string;
          localization?: string;
          show_landing?: boolean;
          start_date?: string;
          type?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'context_type_fkey';
            columns: ['type'];
            isOneToOne: false;
            referencedRelation: 'context_type';
            referencedColumns: ['id'];
          },
        ];
      };
      context_type: {
        Row: {
          id: number;
          label: string;
        };
        Insert: {
          id?: number;
          label: string;
        };
        Update: {
          id?: number;
          label?: string;
        };
        Relationships: [];
      };
      coworker: {
        Row: {
          avatar_bust: string | null;
          avatar_head: string | null;
          firstname: string;
          id: number;
          lastname: string | null;
          url: string | null;
        };
        Insert: {
          avatar_bust?: string | null;
          avatar_head?: string | null;
          firstname: string;
          id?: number;
          lastname?: string | null;
          url?: string | null;
        };
        Update: {
          avatar_bust?: string | null;
          avatar_head?: string | null;
          firstname?: string;
          id?: number;
          lastname?: string | null;
          url?: string | null;
        };
        Relationships: [];
      };
      personal_infos: {
        Row: {
          label: string;
          value: string;
        };
        Insert: {
          label: string;
          value: string;
        };
        Update: {
          label?: string;
          value?: string;
        };
        Relationships: [];
      };
      project: {
        Row: {
          abandoned: boolean;
          color: string;
          context: number;
          deployment: string | null;
          description: string | null;
          end_date: string | null;
          icon: string | null;
          id: number;
          label: string;
          participation: string | null;
          pinned: boolean;
          problematic: string | null;
          source: string | null;
          start_date: string | null;
          type: number | null;
          url: string;
        };
        Insert: {
          abandoned?: boolean;
          color?: string;
          context: number;
          deployment?: string | null;
          description?: string | null;
          end_date?: string | null;
          icon?: string | null;
          id?: number;
          label: string;
          participation?: string | null;
          pinned?: boolean;
          problematic?: string | null;
          source?: string | null;
          start_date?: string | null;
          type?: number | null;
          url: string;
        };
        Update: {
          abandoned?: boolean;
          color?: string;
          context?: number;
          deployment?: string | null;
          description?: string | null;
          end_date?: string | null;
          icon?: string | null;
          id?: number;
          label?: string;
          participation?: string | null;
          pinned?: boolean;
          problematic?: string | null;
          source?: string | null;
          start_date?: string | null;
          type?: number | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_context_fkey';
            columns: ['context'];
            isOneToOne: false;
            referencedRelation: 'context';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_type_fkey';
            columns: ['type'];
            isOneToOne: false;
            referencedRelation: 'project_type';
            referencedColumns: ['id'];
          },
        ];
      };
      project_coworker: {
        Row: {
          coworker_id: number;
          project_id: number;
          role: string | null;
        };
        Insert: {
          coworker_id: number;
          project_id?: number;
          role?: string | null;
        };
        Update: {
          coworker_id?: number;
          project_id?: number;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_coworker_coworker_id_fkey';
            columns: ['coworker_id'];
            isOneToOne: false;
            referencedRelation: 'coworker';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_coworker_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'project';
            referencedColumns: ['id'];
          },
        ];
      };
      project_illustration: {
        Row: {
          alt: string;
          id: number;
          position: number;
          project_id: number;
          url: string;
        };
        Insert: {
          alt: string;
          id?: number;
          position?: number;
          project_id: number;
          url: string;
        };
        Update: {
          alt?: string;
          id?: number;
          position?: number;
          project_id?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_illustration_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'project';
            referencedColumns: ['id'];
          },
        ];
      };
      project_role: {
        Row: {
          project: number;
          role: number;
        };
        Insert: {
          project: number;
          role: number;
        };
        Update: {
          project?: number;
          role?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'project_role_project_fkey';
            columns: ['project'];
            isOneToOne: false;
            referencedRelation: 'project';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_role_role_fkey';
            columns: ['role'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['id'];
          },
        ];
      };
      project_skill: {
        Row: {
          highlight: boolean;
          project_id: number;
          skill_id: number;
        };
        Insert: {
          highlight?: boolean;
          project_id: number;
          skill_id: number;
        };
        Update: {
          highlight?: boolean;
          project_id?: number;
          skill_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'project_skill_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'project';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_skill_skill_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skill';
            referencedColumns: ['id'];
          },
        ];
      };
      project_type: {
        Row: {
          id: number;
          label: string;
        };
        Insert: {
          id?: number;
          label: string;
        };
        Update: {
          id?: number;
          label?: string;
        };
        Relationships: [];
      };
      role: {
        Row: {
          id: number;
          label: string;
        };
        Insert: {
          id?: number;
          label: string;
        };
        Update: {
          id?: number;
          label?: string;
        };
        Relationships: [];
      };
      skill: {
        Row: {
          color: string;
          currently_learning: boolean;
          description: string | null;
          field: number;
          icon: string | null;
          id: number;
          label: string;
          landing_page: boolean;
          loved: boolean;
          main: boolean;
          mastery: number;
          type: number;
        };
        Insert: {
          color?: string;
          currently_learning?: boolean;
          description?: string | null;
          field: number;
          icon?: string | null;
          id?: number;
          label: string;
          landing_page?: boolean;
          loved?: boolean;
          main?: boolean;
          mastery?: number;
          type: number;
        };
        Update: {
          color?: string;
          currently_learning?: boolean;
          description?: string | null;
          field?: number;
          icon?: string | null;
          id?: number;
          label?: string;
          landing_page?: boolean;
          loved?: boolean;
          main?: boolean;
          mastery?: number;
          type?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'skill_type_fkey';
            columns: ['field'];
            isOneToOne: false;
            referencedRelation: 'skill_field';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skill_type_fkey1';
            columns: ['type'];
            isOneToOne: false;
            referencedRelation: 'skill_type';
            referencedColumns: ['id'];
          },
        ];
      };
      skill_field: {
        Row: {
          id: number;
          label: string;
        };
        Insert: {
          id?: number;
          label: string;
        };
        Update: {
          id?: number;
          label?: string;
        };
        Relationships: [];
      };
      skill_type: {
        Row: {
          icon: string;
          id: number;
          label: string;
          position: number;
        };
        Insert: {
          icon: string;
          id?: number;
          label: string;
          position: number;
        };
        Update: {
          icon?: string;
          id?: number;
          label?: string;
          position?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

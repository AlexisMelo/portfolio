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
          project_id: number;
          url: string;
        };
        Insert: {
          alt: string;
          id?: number;
          project_id: number;
          url: string;
        };
        Update: {
          alt?: string;
          id?: number;
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
      project_section: {
        Row: {
          position: number;
          project_id: number;
          section_id: number;
        };
        Insert: {
          position: number;
          project_id: number;
          section_id: number;
        };
        Update: {
          position?: number;
          project_id?: number;
          section_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'project_section_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'project';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_section_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'section';
            referencedColumns: ['id'];
          },
        ];
      };
      project_skill: {
        Row: {
          project_id: number;
          skill_id: number;
        };
        Insert: {
          project_id: number;
          skill_id: number;
        };
        Update: {
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
      section: {
        Row: {
          description: string;
          id: number;
          illustration: string;
          label: string;
          position: number | null;
          tags: string | null;
        };
        Insert: {
          description: string;
          id?: number;
          illustration: string;
          label: string;
          position?: number | null;
          tags?: string | null;
        };
        Update: {
          description?: string;
          id?: number;
          illustration?: string;
          label?: string;
          position?: number | null;
          tags?: string | null;
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

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

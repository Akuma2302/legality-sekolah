/**
 * No ORM is used (Supabase/Postgres handles schema + constraints — see supabase/schema.sql),
 * so this "model" just centralizes the enums the rest of the backend validates against.
 */
export const SCHOOL_TYPES = ['A', 'B', 'C', 'New'];

export const BRANCHES = ['Central', 'North', 'East Coast', 'Borneo'];

export const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak',
  'Perlis', 'Penang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
];

export const LEGALITY_STATUSES = ['Legal w/ BnW', 'Legal w/o BnW', 'Potentially Legal', 'Not Legal'];

/** Fields a PIC (regular user) is allowed to edit on their own school record. */
export const EDITABLE_SCHOOL_FIELDS = [
  'school_name', 'pic_name', 'type', 'branch', 'state',
  'email', 'contact_number', 'website', 'tiktok', 'instagram', 'note',
];

export enum AppRole {
  admin = 'admin',
  kepala = 'kepala-dinas',
  pengusaha = 'pengusaha',
}

export type UserObject = {
  id: number;
  nik: string | number;
  email: string;
  username: string | null;
  nomor_hp: string | null;
  jabatan: string;
  nama_lengkap: string;
  foto_profil: string | null;
};

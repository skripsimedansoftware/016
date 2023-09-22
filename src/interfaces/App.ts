export enum AppRole {
  admin = 'admin',
  kepala = 'kepala-dinas',
  pengusaha = 'pengusaha',
}

export interface UserObject {
  id: number;
  nik: string;
  email: string;
  username: string | null;
  password: string;
  nama_lengkap: string;
  foto_profil: string | null;
  nomor_hp: string;
  fotocopy_kk: string;
  fotocopy_ktp: string;
  fotocopy_npwp: string;
  jabatan: string;
  created_at: string;
  updated_at: string;
}

export interface IDaftarUsaha {
  id: number;
  nama: string | null;
  produk: string | null;
  jenis_usaha: string;
  sektor_usaha: string;
  fotocopy_keterangan_usaha: string | null;
  fotocopy_izin_usaha: string | null;
  foto_produksi: string | null;
  detail_usaha: string | null;
  provinsi: string;
  kabupaten_atau_kota: string;
  kecamatan: string;
  desa_atau_kelurahan: string;
  alamat: string | null;
  latitude: number;
  longitude: number;
  catatan: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  owner: number;
  pengusaha?: UserObject;
}

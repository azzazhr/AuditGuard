'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#e8edf2] flex">
      {/* Left Side - Image and Description */}
      <div className="hidden lg:flex lg:w-1/2 flex-col p-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[24px]">
              shield
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">AuditGuard</h1>
            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-[0.15em]">
              Kepatuhan Perusahaan
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-black mb-2">
            Visibilitas terpusat untuk audit sistem kritis
          </h2>
          <p className="text-2xl font-semibold text-black">
            dan deteksi anomali waktu nyata.
          </p>
        </div>

        {/* Image Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="bg-black rounded-3xl p-8 shadow-2xl">
              {/* Placeholder for network image */}
              <div className="aspect-square bg-gradient-to-br from-cyan-900 to-black rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-cyan-400 text-[120px] opacity-30">
                    hub
                  </span>
                </div>
              </div>
              
              {/* Analytics Bar */}
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">analytics</span>
                <div className="flex-1 mx-4 bg-gray-700 rounded-full h-1.5">
                  <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <span className="text-white text-sm font-medium">98% Aman</span>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-[20px]">
                  verified_user
                </span>
                <div className="text-[10px] text-gray-600">
                  <div className="font-semibold">PLATFORM BERSERTIFIKAT</div>
                  <div>SOC2 TYPE II</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">
              {isRegister ? "Buat Akun Baru" : "Selamat Datang"}
            </h2>
            <p className="text-[14px] text-gray-600">
              {isRegister 
                ? "Daftarkan akun Anda untuk mengakses dashboard audit." 
                : "Silakan masukkan kredensial Anda untuk mengakses dashboard audit."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Register Only) */}
            {isRegister && (
              <div className="space-y-2">
                <label 
                  className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                  htmlFor="name"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required={isRegister}
                    type="text"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label 
                className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                htmlFor="email"
              >
                Alamat Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                  id="email"
                  name="email"
                  placeholder="azzahraqina70@gmail.com"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {isRegister && (
              <div className="space-y-2">
                <label 
                  className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                  htmlFor="confirmPassword"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    lock_reset
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required={isRegister}
                    type="password"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login Only) */}
            {!isRegister && (
              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                    type="checkbox" 
                  />
                  <span className="text-gray-600">Ingat perangkat ini</span>
                </label>
                <a className="text-black hover:underline font-medium" href="#">
                  Lupa kata sandi?
                </a>
              </div>
            )}

            {/* Terms (Register Only) */}
            {isRegister && (
              <div className="flex items-start gap-2 pt-1">
                <input 
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer mt-0.5" 
                  type="checkbox" 
                  id="terms" 
                  required 
                />
                <label htmlFor="terms" className="text-[13px] text-gray-600 cursor-pointer">
                  Saya menyetujui{" "}
                  <a href="#" className="text-black hover:underline font-medium">
                    Syarat & Ketentuan
                  </a>
                  {" "}dan{" "}
                  <a href="#" className="text-black hover:underline font-medium">
                    Kebijakan Privasi
                  </a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-black text-white py-3.5 rounded-lg font-semibold text-[15px] hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                isRegister ? "Mendaftarkan..." : "Masuk..."
              ) : (
                <>
                  {isRegister ? "Daftar Sekarang" : "Masuk ke Dashboard"}
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>

            {/* Toggle Link */}
            <div className="text-center pt-4">
              <p className="text-[13px] text-gray-600">
                {isRegister ? "Sudah punya akun?" : "Belum memiliki akun?"}
                {" "}
                <button 
                  onClick={() => setIsRegister(!isRegister)} 
                  className="text-black font-semibold hover:underline"
                  type="button"
                >
                  {isRegister ? "Masuk" : "Register"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

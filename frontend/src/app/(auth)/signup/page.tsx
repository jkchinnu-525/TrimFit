"use client";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "./actions";

export default function SignUp() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f8fcfc] to-[#f0f9f9]" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 right-1/4 w-[800px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse, #3F8F8D 0%, rgba(63, 143, 141, 0.5) 40%, transparent 80%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-[600px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, #4FB3B0 0%, rgba(79, 179, 176, 0.3) 50%, transparent 80%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <header className="relative z-10 p-6 lg:p-8">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="bg-[50%_50%] bg-cover bg-no-repeat h-[28px] md:h-[32px] lg:h-[36px] w-[90px] md:w-[105px] lg:w-[120px] mr-2 md:mr-3 lg:mr-4"
            style={{ backgroundImage: "url(/Image.png)" }}
          />
        </Link>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <div className="flex justify-start items-center rounded-2xl gap-2 max-w-fit bg-[#31484D] p-2">
              <div className="relative flex justify-center items-center bg-stone-500/40 ml-1 rounded-full w-2 h-2">
                <div className="flex justify-center items-center bg-[#4FB3B0] rounded-full w-2 h-2 animate-ping">
                  <div className="flex justify-center items-center bg-white/50 rounded-full w-2 h-2 animate-ping"></div>
                </div>
                <div className="top-1/2 left-1/2 absolute flex justify-center items-center bg-[#4FB3B0]/80 rounded-full w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <p className="text-xs font-medium font-'Inter' pr-2 text-white">
                Join the TrimFit community
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0px_0px_30px_8px_rgba(120,177,175,0.15)] border border-[#3F8F8D]/20 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black font-'Inter' mb-2">
                Create Account
              </h1>
              <p className="text-[#666] font-'Inter' text-sm">
                Start your journey to better job applications
              </p>
            </div>

            <form action={formAction} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black font-'Inter' mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full px-4 py-3 rounded-2xl border border-[#3F8F8D]/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4FB3B0] focus:border-transparent transition-all duration-300 font-'Inter'"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black font-'Inter' mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="w-full px-4 py-3 rounded-2xl border border-[#3F8F8D]/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4FB3B0] focus:border-transparent transition-all duration-300 font-'Inter'"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black font-'Inter' mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#3F8F8D]/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4FB3B0] focus:border-transparent transition-all duration-300 font-'Inter'"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black font-'Inter' mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#3F8F8D]/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4FB3B0] focus:border-transparent transition-all duration-300 font-'Inter'"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black font-'Inter' mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#3F8F8D]/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4FB3B0] focus:border-transparent transition-all duration-300 font-'Inter'"
                  placeholder="Confirm your password"
                />
              </div>

              {state?.error ? (
                <div className=" text-center text-red-500 text-sm font-medium font-'Inter' p-2">
                  {state.error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-[#3F8F8D] to-[#4FB3B0] cursor-pointer text-white font-medium font-'Inter' py-3 px-6 rounded-2xl hover:from-[#368882] hover:to-[#46a8a5] focus:outline-none focus:ring-2 focus:ring-[#4FB3B0] focus:ring-offset-2 transition-all duration-300 shadow-[0px_4px_15px_rgba(63,143,141,0.3)]"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3F8F8D]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-[#666] font-'Inter'">
                  or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-[#3F8F8D]/30 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 font-'Inter'">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-black font-medium">
                  Continue with Google
                </span>
              </button>
            </div>

            <p className="text-center mt-8 text-sm text-[#666] font-'Inter'">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#1b788a] hover:text-[#3F8F8D] font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

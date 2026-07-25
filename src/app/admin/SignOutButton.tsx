"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "./actions";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOutAction()}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}

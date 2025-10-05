// app/admin/layout.tsx
import Link from "next/link";
import { LayoutDashboard, Store, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin</h1>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/restaurants" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
            <Store size={20} />
            <span>Restaurantes</span>
          </Link>
        </nav>
        <div className="mt-auto absolute bottom-4">
           {/* Futuramente, o botão de logout virá para cá */}
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
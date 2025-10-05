// app/page.tsx

"use client"

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      // 1. Pega a sessão do usuário logado
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Se não houver usuário logado, manda para a página de login
        router.replace('/login');
        return;
      }

      // 2. Busca o perfil do usuário na nossa tabela 'profiles'
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single(); // .single() pega apenas um resultado

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        // Em caso de erro, desloga o usuário por segurança
        await supabase.auth.signOut();
        router.replace('/login');
        return;
      }

      // 3. Redireciona com base no perfil ('role')
      if (profile) {
        switch (profile.role) {
          case 'admin':
            router.replace('/admin/dashboard');
            break;
          case 'client':
            router.replace('/client/dashboard');
            break;
          // Adicionar outros casos aqui (restaurante, entregador) no futuro
          default:
            router.replace('/login'); // Perfil desconhecido
        }
      }
    };

    checkUserRole();
  }, [router]);

  // Enquanto a verificação acontece, mostramos uma tela de carregamento
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Carregando...</p>
    </div>
  );
}

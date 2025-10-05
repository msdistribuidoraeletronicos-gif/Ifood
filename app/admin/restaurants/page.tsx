// app/admin/restaurants/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RestaurantsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Pega o ID do usuário logado para usar como 'owner_id'
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Você precisa estar logado para criar um restaurante.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("restaurants").insert({
      name: name,
      category: category,
      image_url: imageUrl,
      delivery_fee: parseFloat(deliveryFee),
      delivery_time_minutes: parseInt(deliveryTime),
      owner_id: user.id, // Associa o restaurante ao admin logado
    });

    if (error) {
      alert("Erro ao criar restaurante: " + error.message);
    } else {
      alert("Restaurante criado com sucesso!");
      // Limpa o formulário e atualiza a página
      setName('');
      setCategory('');
      setImageUrl('');
      setDeliveryFee('');
      setDeliveryTime('');
      router.refresh(); // Recarrega os dados da página
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciar Restaurantes</h1>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Adicionar Novo Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Restaurante</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Pizza, Japonês" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                  <Input id="deliveryFee" type="number" step="0.01" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Tempo de Entrega (min)</Label>
                  <Input id="deliveryTime" type="number" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required />
                </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Restaurante"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
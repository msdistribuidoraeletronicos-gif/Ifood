// app/admin/restaurants/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  delivery_fee: number;
}

export default function RestaurantsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Estados do formulário
  const [name, setName] = useState('');
  // ... (outros estados do formulário)
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  // Estados da tabela
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);

  const fetchRestaurants = async () => { /* ... (função igual a antes) */
    setLoadingTable(true);
    const { data, error } = await supabase.from("restaurants").select("id, name, category, delivery_fee");
    if (error) {
      console.error("Erro ao buscar restaurantes:", error);
    } else {
      setRestaurants(data);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => { /* ... (função igual a antes) */
    e.preventDefault();
    setLoadingForm(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Você precisa estar logado para criar um restaurante.");
      setLoadingForm(false);
      return;
    }
    const { error } = await supabase.from("restaurants").insert({
      name, category, image_url: imageUrl,
      delivery_fee: parseFloat(deliveryFee),
      delivery_time_minutes: parseInt(deliveryTime),
      owner_id: user.id,
    });
    if (error) {
      toast({ title: "Erro!", description: "Não foi possível criar o restaurante.", variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Restaurante criado com sucesso." });
      setName(''); setCategory(''); setImageUrl('');
      setDeliveryFee(''); setDeliveryTime('');
      await fetchRestaurants();
    }
    setLoadingForm(false);
  };

  // NOVA FUNÇÃO PARA EXCLUIR UM RESTAURANTE
  const handleDelete = async (restaurantId: string) => {
    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", restaurantId);

    if (error) {
      toast({ title: "Erro!", description: "Não foi possível excluir o restaurante.", variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Restaurante excluído." });
      // Atualiza a lista na tela removendo o item excluído
      await fetchRestaurants();
    }
  };

  return (
    <div>
      {/* ... (cabeçalho e formulário continuam iguais) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Restaurantes</h1>
      </div>

      <Card className="w-full max-w-2xl mb-8">
        <CardHeader><CardTitle>Adicionar Novo Restaurante</CardTitle></CardHeader>
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
            <Button type="submit" disabled={loadingForm}>
              {loadingForm ? "Salvando..." : "Salvar Restaurante"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Restaurantes Cadastrados</CardTitle></CardHeader>
        <CardContent>
          {loadingTable ? <p>Carregando...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Taxa de Entrega</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.category}</TableCell>
                    <TableCell>R$ {restaurant.delivery_fee.toFixed(2)}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      
                      {/* LÓGICA DO ALERTA DE EXCLUSÃO */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Excluir</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá permanentemente o restaurante.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(restaurant.id)}>
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// app/client/dashboard/page.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Clock, DollarSign } from "lucide-react"

interface Restaurant {
  id: string;
  name: string;
  image_url: string;
  category: string;
  delivery_fee: number;
  delivery_time_minutes: number;
}

export default function ClientDashboard() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('restaurants').select('*')

      if (error) {
        console.error("Erro ao buscar restaurantes:", error)
      } else {
        setRestaurants(data)
      }
      setLoading(false)
    }
    fetchRestaurants()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">Food Delivery</h1>
        <Button onClick={handleLogout} variant="destructive">
          Sair
        </Button>
      </header>

      <main className="p-4 md:p-8">
        <h2 className="text-3xl font-semibold mb-6">Restaurantes</h2>
        {loading ? (
          <p>Carregando restaurantes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{restaurant.delivery_time_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>Frete R$ {restaurant.delivery_fee.toFixed(2)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-4">{restaurant.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
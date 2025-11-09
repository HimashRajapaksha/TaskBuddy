"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Target } from "lucide-react"

interface StatsCardsProps {
  totalTodos: number
  pendingCount: number
  completedCount: number
}

export function StatsCards({ totalTodos, pendingCount, completedCount }: StatsCardsProps) {
  const completionRate = totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-xs text-white font-bold">%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completion</div>
        </CardContent>
      </Card>
    </div>
  )
}

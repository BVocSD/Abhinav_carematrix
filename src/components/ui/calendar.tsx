"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const monthName = currentMonth.toLocaleString('default', { month: 'long' }).toUpperCase()

  const totalDays = daysInMonth(year, month)
  const startDay = firstDayOfMonth(year, month)

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day: number) => {
    // Create date using local time at start of day
    const date = new Date(year, month, day)
    if (disabled && disabled(date)) return
    onSelect?.(date)
  }

  const isSelected = (day: number) => {
    if (!selected) return false
    return selected.getDate() === day && 
           selected.getMonth() === month && 
           selected.getFullYear() === year
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year
  }

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  return (
    <div className={cn("w-full bg-card p-2 text-card-foreground select-none", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePreviousMonth()
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-black tracking-widest">{monthName}</h2>
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleNextMonth()
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-[10px] font-bold text-muted-foreground text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty cells for start of month */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7 w-7" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          // Ensure we compare with start of day for robustness
          const dateStartOfDay = new Date(year, month, day)
          const isDisabled = disabled?.(dateStartOfDay)

          return (
            <button
              key={day}
              type="button"
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDateClick(day)
              }}
              className={cn(
                "h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-md transition-all cursor-pointer relative z-10",
                isSelected(day) 
                  ? "bg-primary text-primary-foreground font-bold shadow-sm scale-110" 
                  : isDisabled 
                    ? "opacity-20 cursor-not-allowed pointer-events-none" 
                    : "hover:bg-primary/20 hover:text-primary active:scale-95",
                isToday(day) && !isSelected(day) && "border border-primary text-primary"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

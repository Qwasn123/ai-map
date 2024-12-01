export interface TravelPreferences {
  destination: string
  duration: number
  budget: 'economic' | 'moderate' | 'luxury'
  interests: string[]
}

export interface Activity {
  time: string
  title: string
  description: string
  tips?: string
}

export interface DailyPlan {
  activities: Activity[]
}

export interface TravelPlan {
  destination: string
  duration: number
  budget: string
  interests: string[]
  dailyPlans: DailyPlan[]
} 
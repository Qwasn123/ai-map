<template>
  <div class="travel-plan">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在为您生成专属行程规划...</p>
    </div>
    
    <div v-else-if="plan" class="plan-content">
      <div class="plan-header">
        <h2>
          <span class="destination">{{ plan.destination }}</span>
          <span class="duration">{{ plan.duration }}日游</span>
        </h2>
        <div class="plan-meta">
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>预算: {{ getBudgetText(plan.budget) }}</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>兴趣: {{ getInterestsText(plan.interests) }}</span>
          </div>
        </div>
      </div>

      <div class="daily-plans">
        <div v-for="dailyPlan in plan.dailyPlans" :key="dailyPlan.day" class="daily-plan">
          <div class="day-header">
            <h3>第 {{ dailyPlan.day }} 天</h3>
            <div class="day-line"></div>
          </div>
          <div class="activities">
            <div v-for="(activity, index) in dailyPlan.activities" 
                 :key="index" 
                 class="activity"
            >
              <div class="activity-time">{{ activity.time }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-description">{{ activity.description }}</div>
                <div class="activity-tips" v-if="activity.tips">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ activity.tips }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Activity {
  time: string
  description: string
  location: string
  type: string
}

interface DailyPlan {
  day: number
  activities: Activity[]
}

interface TravelPlan {
  destination: string
  duration: number
  budget: string
  interests: string[]
  dailyPlans: DailyPlan[]
}

const props = defineProps<{
  plan: TravelPlan | null
  loading: boolean
}>()

const getBudgetText = (budget: string) => {
  const budgetMap = {
    economic: '经济型',
    moderate: '中等',
    luxury: '奢华'
  }
  return budgetMap[budget as keyof typeof budgetMap] || budget
}

const getInterestsText = (interests: string[]) => {
  const interestMap: { [key: string]: string } = {
    history: '历史文化',
    nature: '自然风光',
    food: '美食',
    shopping: '购物'
  }
  return interests.map(i => interestMap[i] || i).join(' · ')
}
</script>

<style scoped>
.travel-plan {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.loading-state {
  padding: 3rem;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.plan-content {
  padding: 2rem;
}

.plan-header {
  margin-bottom: 2rem;
  text-align: center;
}

.plan-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.destination {
  color: #3498db;
}

.duration {
  background: #f0f8ff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 1.25rem;
  color: #3498db;
}

.plan-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item .icon {
  width: 18px;
  height: 18px;
  color: #3498db;
}

.daily-plans {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.daily-plan {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.day-header h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
}

.day-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, #3498db, transparent);
}

.activities {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.activity::before {
  content: '';
  position: absolute;
  left: 3.5rem;
  top: 2.5rem;
  bottom: -1.5rem;
  width: 2px;
  background: #e1e8ed;
}

.activity:last-child::before {
  display: none;
}

.activity-time {
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  height: fit-content;
}

.activity-content {
  flex: 1;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.activity-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.activity-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.activity-tips {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
}

.activity-tips .icon {
  width: 16px;
  height: 16px;
  color: #f39c12;
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .plan-content {
    padding: 1rem;
  }

  .plan-header h2 {
    font-size: 1.5rem;
    flex-direction: column;
  }

  .plan-meta {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .activity {
    flex-direction: column;
    gap: 0.75rem;
  }

  .activity::before {
    display: none;
  }

  .activity-time {
    align-self: flex-start;
  }
}
</style> 
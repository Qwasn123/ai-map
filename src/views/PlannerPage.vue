<template>
  <div class="travel-planner">
    <div class="input-section">
      <h2>告诉我您的旅行偏好</h2>
      <form @submit.prevent="generatePlan">
        <div class="form-group">
          <label>目的地</label>
          <input v-model="preferences.destination" type="text" placeholder="例如: 北京">
        </div>
        
        <div class="form-group">
          <label>旅行天数</label>
          <input v-model="preferences.duration" type="number" min="1" max="30">
        </div>
        
        <div class="form-group">
          <label>预算范围</label>
          <select v-model="preferences.budget">
            <option value="economic">经济型</option>
            <option value="moderate">中等</option>
            <option value="luxury">奢华</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>兴趣偏好</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="preferences.interests" value="history">
              历史文化
            </label>
            <label>
              <input type="checkbox" v-model="preferences.interests" value="nature">
              自然风光
            </label>
            <label>
              <input type="checkbox" v-model="preferences.interests" value="food">
              美食
            </label>
            <label>
              <input type="checkbox" v-model="preferences.interests" value="shopping">
              购物
            </label>
          </div>
        </div>

        <button type="submit" class="submit-btn">生成行程</button>
      </form>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <TravelPlanDisplay 
      v-if="travelPlan || loading" 
      :plan="travelPlan" 
      :loading="loading"
      class="plan-display"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { generateTravelPlan } from '../services/aiService'
import TravelPlanDisplay from '../components/TravelPlanDisplay.vue'

// 添加类型定义
interface Activity {
  time: string
  title: string
  description: string
  tips: string
}

interface DailyPlan {
  activities: Activity[]
}

interface TravelPlan {
  destination: string
  duration: number
  budget: string
  interests: string[]
  dailyPlans: DailyPlan[]
}

interface TravelPreferences {
  destination: string
  duration: number
  budget: string
  interests: string[]
}

const preferences = reactive<TravelPreferences>({
  destination: '',
  duration: 1,
  budget: 'moderate',
  interests: []
})

const travelPlan = ref<TravelPlan | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const generatePlan = async () => {
  if (!preferences.destination) {
    alert('请输入目的地')
    return
  }
  if (preferences.interests.length === 0) {
    alert('请至少选择一个兴趣偏好')
    return
  }

  try {
    loading.value = true
    error.value = null
    const response = await generateTravelPlan(preferences)
    
    travelPlan.value = {
      destination: preferences.destination,
      duration: preferences.duration,
      budget: preferences.budget,
      interests: preferences.interests,
      dailyPlans: response.dailyPlans.map(plan => ({
        ...plan,
        location: preferences.destination
      }))
    }
  } catch (err) {
    console.error('生成计划失败:', err)
    error.value = '生成计划失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.travel-planner {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.input-section {
  margin-bottom: 2rem;
}

.input-section h2 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #34495e;
  font-size: 1rem;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.3s ease;
  background: #f8fafc;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin: 0;
  font-weight: normal;
}

.checkbox-group label:hover {
  background: rgba(52, 152, 219, 0.1);
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border: 2px solid #3498db;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #3498db;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.error-message {
  color: #e74c3c;
  padding: 1rem;
  margin: 1rem 0;
  background: #fdf0ed;
  border-radius: 12px;
  border-left: 4px solid #e74c3c;
  font-size: 0.95rem;
}

.plan-display {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .travel-planner {
    margin: 1rem;
    padding: 1.5rem;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }

  input[type="text"],
  input[type="number"],
  select {
    font-size: 16px; /* 防止 iOS 缩放 */
  }
}

/* 添加加载动画 */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.loading {
  animation: shimmer 1s linear infinite forwards;
  background: linear-gradient(
    to right,
    #f6f7f8 8%,
    #edeef1 18%,
    #f6f7f8 33%
  );
  background-size: 800px 104px;
}

/* 美化选择框 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

/* 添加输入框动画效果 */
@keyframes input-focus {
  0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
}

input:focus,
select:focus {
  animation: input-focus 0.8s ease-out;
}

/* 添加卡片悬浮效果 */
.travel-planner {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.travel-planner:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style> 
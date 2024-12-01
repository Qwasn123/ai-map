import axios from 'axios'
import type { TravelPreferences, TravelPlan } from '@/types'

// 调用通义千问 API 生成旅行计划
export const generateTravelPlan = async (preferences: TravelPreferences): Promise<TravelPlan> => {
  try {
    // 构建更详细的提示词
    const prompt = `作为一位专业的旅行规划师，请为我生成一个${preferences.destination}的${preferences.duration}天旅行计划。

旅行偏好：
- 预算类型：${preferences.budget === 'economic' ? '经济型' : preferences.budget === 'moderate' ? '中等' : '奢华'}
- 兴趣偏好：${preferences.interests.map(interest => 
      interest === 'history' ? '历史文化' :
      interest === 'nature' ? '自然风光' :
      interest === 'food' ? '美食' :
      interest === 'shopping' ? '购物' : ''
    ).join('、')}

请直接返回以下格式的JSON数据（不要包含其他任何文字说明）：
{
  "dailyPlans": [
    {
      "day": 1,
      "activities": [
        {
          "time": "09:00",
          "title": "景点名称",
          "description": "景点详细介绍，包括历史背景、特色等",
          "tips": "参观建议，包括门票信息、最佳游览路线等"
        }
      ]
    }
  ]
}`

    // 调用通义千问 API
    const response = await axios.post('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的旅行规划师。请只返回JSON格式的旅行计划，不要包含任何其他说明文字。确保返回的是有效的JSON数据。每个景点安排3小时以上的游览时间，每天安排2-3个主要景点。'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer sk-aded46a7eee4448a8d0e80055c5d090f`,
        'Content-Type': 'application/json'
      }
    })

    // 尝试解析 API 返回的 JSON 响应
    let aiResponse;
    try {
      const content = response.data.choices[0].message.content;
      // 移除可能存在的 markdown 标记和其他非 JSON 内容
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      aiResponse = JSON.parse(jsonStr);
    } catch (error) {
      console.error('解析 AI 响应失败:', error);
      throw new Error('生成的旅行计划格式无效');
    }
    
    // 构建返回的旅行计划
    return {
      destination: preferences.destination,
      duration: preferences.duration,
      budget: preferences.budget,
      interests: preferences.interests,
      dailyPlans: aiResponse.dailyPlans
    }
  } catch (error) {
    console.error('生成旅行计划时出错:', error);
    throw error;
  }
} 
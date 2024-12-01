<template>
  <div class="layout" :class="{ 'sidebar-collapsed': isCollapsed }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo" v-show="!isCollapsed">
          <h2>AI 旅游助手</h2>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" :class="{ 'rotate-180': isCollapsed }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>
      
      <nav class="nav-menu">
        <RouterLink to="/" class="nav-item" :title="isCollapsed ? '首页' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span v-show="!isCollapsed">首页</span>
        </RouterLink>
        <RouterLink to="/planner" class="nav-item" :title="isCollapsed ? '定制行程' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <span v-show="!isCollapsed">定制行程</span>
        </RouterLink>
      </nav>
    </aside>
    
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: linear-gradient(180deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 1.5rem 0.75rem;
  z-index: 100;
  overflow-y: auto;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sidebar-collapsed .sidebar {
  width: 64px;
  padding: 1.5rem 0.5rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  margin-bottom: 2rem;
}

.logo {
  flex: 1;
  text-align: center;
}

.logo h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.collapse-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.collapse-btn .icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.collapse-btn .icon.rotate-180 {
  transform: rotate(180deg);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
  text-decoration: none;
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-content {
  margin-left: 64px;
}

/* 添加响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .sidebar-collapsed .main-content {
    margin-left: 0;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem 0;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-collapsed .collapse-btn {
  padding: 0.5rem 0;
  width: 100%;
  justify-content: center;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  margin-bottom: 2rem;
}

.sidebar-collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}
</style> 
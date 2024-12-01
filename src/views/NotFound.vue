<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

h1 {
  font-size: 6rem;
  color: #ccc;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.home-link:hover {
  background: #45a049;
  text-decoration: none;
}
</style> 
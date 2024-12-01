<template>
  <div class="home">
    <div id="map" class="map-container"></div>

    <!-- 位置信息卡片 -->
    <div class="info-card location-info" v-if="currentLocation">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        当前位置
      </h3>
      <p>{{ currentLocation.address }}</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <div class="search-input-wrapper">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div class="search-input-container">
          <input id="searchInput" type="text" v-model="searchQuery" placeholder="搜索地点、景点、餐厅..."
            @input="handleSearchInput" @keyup.enter="handleSearch" @focus="showSuggestions = true" @blur="handleBlur">
          <!-- 搜索联想列表 -->
          <div class="search-suggestions" v-if="showSuggestions && searchSuggestions.length > 0">
            <div v-for="(suggestion, index) in searchSuggestions" :key="index" class="suggestion-item"
              @mousedown="selectSuggestion(suggestion)">
              <div class="suggestion-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="suggestion-content">
                <div class="suggestion-name">{{ suggestion.name }}</div>
                <div class="suggestion-address">{{ suggestion.district }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isSearching" class="search-loading">
          <div class="spinner"></div>
        </div>
        <button class="clear-btn" @click="clearSearch" v-if="searchQuery && !isSearching">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button class="search-btn" @click="handleSearch" :disabled="isSearching || !searchQuery">
          搜索
        </button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <button class="tool-btn" @click="getCurrentLocation" title="定位">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
      </button>
      <button class="tool-btn" @click="toggleNavigation" title="导航">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
        </svg>
      </button>
      <button class="tool-btn" @click="toggleCustomTrip" title="定制行程">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </button>
    </div>

    <!-- 搜索结果面板 -->
    <div id="search-panel" class="search-panel" v-show="showSearchPanel">
      <div id="my-panel"></div>
    </div>

    <!-- 在工具栏后面添加导航侧边栏 -->
    <div 
      class="navigation-panel" 
      :class="{
        'mobile': isMobile,
        'collapsed': isNavCollapsed,
        'left-side': true
      }"
      v-show="showNavigationPanel"
    >
      <div class="nav-header">
        <h3>路线规划</h3>
        <button class="close-btn" @click="toggleNavigation">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="nav-content">
        <!-- 起点输入 -->
        <div class="nav-input-group">
          <div class="nav-icon start">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
            </svg>
          </div>
          <input type="text" v-model="startPoint" placeholder="起点 (当前位置)" @focus="handleStartPointFocus">
          <button class="location-info-btn" v-if="startPoint" @click="handleShowLocationInfo('start', startPoint)"
            title="查看起点信息">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <!-- 终点输入 -->
        <div class="nav-input-group">
          <div class="nav-icon end">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
            </svg>
          </div>
          <input type="text" v-model="endPoint" placeholder="终点" @focus="handleEndPointFocus">
          <button class="location-info-btn" v-if="endPoint" @click="handleShowLocationInfo('end', endPoint)"
            title="查看终点信息">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <!-- 导航方式选择 -->
        <div class="nav-mode">
          <button v-for="mode in navigationModes" :key="mode.type"
            :class="['mode-btn', { active: currentNavMode === mode.type }]" @click="selectNavMode(mode.type)">
            <span class="mode-icon" v-html="mode.icon"></span>
            {{ mode.label }}
          </button>
        </div>

        <!-- 开始导航按钮 -->
        <button class="start-nav-btn" @click="startNavigation" :disabled="!startPoint || !endPoint">
          开导航
        </button>

        <!-- 导航路线信息 -->
        <div class="route-info" v-if="routeInfo">
          <div class="route-summary">
            <div class="route-distance">{{ routeInfo.distance }}</div>
            <div class="route-time">{{ routeInfo.time }}</div>
          </div>
          <div class="route-steps">
            <div v-for="(step, index) in routeInfo.steps" :key="index" class="route-step">
              {{ step.instruction }}
            </div>
          </div>
        </div>

        <!-- 添加路线展示面板 -->
        <div id="route-panel" class="route-panel"></div>
      </div>
    </div>

    <!-- 添加定制行程面板 -->
    <div class="custom-trip-panel" v-show="showCustomTripPanel">
      <div class="nav-header">
        <h3>定制行程</h3>
        <button class="close-btn" @click="showCustomTripPanel = false">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="nav-content">
        <!-- 起点 -->
        <div class="nav-input-group">
          <div class="nav-icon start">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
            </svg>
          </div>
          <input type="text" v-model="tripStartPoint" placeholder="起点">
        </div>

        <!-- 途经点列表 -->
        <div class="waypoints-list">
          <div v-for="(point, index) in waypoints" :key="index" class="waypoint-item">
            <div class="nav-input-group">
              <div class="nav-icon waypoint">
                <span class="waypoint-number">{{ index + 1 }}</span>
              </div>
              <input type="text" v-model="point.address" :placeholder="`途经点 ${index + 1}`">
              <button class="remove-btn" @click="removeWaypoint(index)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 添加途经点按钮 -->
        <button class="add-waypoint-btn" @click="addWaypoint">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加途经点
        </button>

        <!-- 终点 -->
        <div class="nav-input-group">
          <div class="nav-icon end">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
            </svg>
          </div>
          <input type="text" v-model="tripEndPoint" placeholder="终点">
        </div>

        <!-- 行程选项 -->
        <div class="trip-options">
          <div class="option-group">
            <label>出行方式</label>
            <div class="nav-mode">
              <button v-for="mode in navigationModes" :key="mode.type"
                :class="['mode-btn', { active: currentTripMode === mode.type }]" @click="selectTripMode(mode.type)">
                <span class="mode-icon" v-html="mode.icon"></span>
                {{ mode.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- 开始规划按钮 -->
        <button class="start-nav-btn" @click="planTrip" :disabled="!canPlanTrip">
          开始规划
        </button>

        <!-- 行程路线信息 -->
        <div class="trip-route-info" v-if="tripRouteInfo">
          <div class="route-header">
            <h4>最优路线</h4>
            <div class="route-summary">
              <div class="summary-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
                </svg>
                <span>{{ tripRouteInfo.totalTime }}</span>
              </div>
              <div class="summary-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{{ tripRouteInfo.totalDistance }}公里</span>
              </div>
            </div>
          </div>

          <div class="route-stops">
            <div class="stop-item start">
              <div class="stop-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <circle cx="12" cy="12" r="3" stroke-width="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                </svg>
              </div>
              <div class="stop-content">
                <div class="stop-name">起点</div>
                <div class="stop-address">{{ tripStartPoint }}</div>
              </div>
            </div>

            <div v-for="(stop, index) in tripRouteInfo.waypoints" :key="index" class="stop-item waypoint">
              <div class="stop-icon">
                <span class="waypoint-number">{{ index + 1 }}</span>
              </div>
              <div class="stop-content">
                <div class="stop-name">途经点 {{ index + 1 }}</div>
                <div class="stop-address">{{ stop.address }}</div>
                <div class="stop-time" v-if="stop.time">预计 {{ stop.time }}</div>
              </div>
            </div>

            <div class="stop-item end">
              <div class="stop-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                </svg>
              </div>
              <div class="stop-content">
                <div class="stop-name">终点</div>
                <div class="stop-address">{{ tripEndPoint }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'

interface Location {
  lat: number
  lng: number
  address?: string
}

interface TripRouteInfo {
  totalDistance: number
  totalTime: string
  waypoints: {
    address: string
    time?: string
    distance?: number
  }[]
}

const currentLocation = ref<Location | null>(null)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const showSearchPanel = ref(false)
const tripRouteInfo = ref<TripRouteInfo | null>(null)  // 添加这行

// 修改 map 的声明，使用 ref 来管理地图实例
const map = ref<AMap.Map | null>(null)
let marker: typeof AMap.Marker | null = null
let placeSearch: typeof AMap.PlaceSearch | null = null
let autoComplete: typeof AMap.AutoComplete | null = null
let driving: typeof AMap.Driving | null = null
let walking: typeof AMap.Walking | null = null
let riding: typeof AMap.Riding | null = null
let markers: typeof AMap.Marker[] = []

// 搜索建议列表
const searchSuggestions = ref<any[]>([])
let searchTimeout: NodeJS.Timeout | null = null

// 添加导航相关的状态
const showNavigationPanel = ref(false)
const startPoint = ref('')
const endPoint = ref('')
const currentNavMode = ref('drive')
const routeInfo = ref<any>(null)

// 定制行程相关的状态
const showCustomTripPanel = ref(false)
const tripStartPoint = ref('')
const tripEndPoint = ref('')
const currentTripMode = ref('drive')
const waypoints = ref<{ address: string }[]>([])

// 导航模式配置
const navigationModes = [
  {
    type: 'drive',
    label: '驾车',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 17h14m-7-3v3m3-7l2-4H7l2 4h6z"/></svg>'
  },
  {
    type: 'walk',
    label: '步行',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 4v16M7 4v16"/></svg>'
  },
  {
    type: 'ride',
    label: '骑行',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="15" r="3"/><circle cx="18" cy="15" r="3"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 15l3-6 6 3-3 3h6"/></svg>'
  }
]

// 计算属性：是否可以开始规划
const canPlanTrip = computed(() => {
  return tripStartPoint.value && tripEndPoint.value
})

// 修改地图初始化函数
const initMap = () => {
  console.log('开始初始化地图')
  try {
    // 创建地图实例
    map.value = new AMap.Map('map', {
      zoom: 11,
      center: [116.397428, 39.90923],
      viewMode: '3D',
      pitch: 45,
      features: ['bg', 'road', 'building', 'point'],
      showLabel: true,
      showIndoorMap: true,
      mapStyle: 'amap://styles/macaron'
    })

    // 初始化其他插件和功能
    AMap.plugin([
      'AMap.Scale',
      'AMap.ToolBar',
      'AMap.PlaceSearch',
      'AMap.Geolocation',
      'AMap.Weather',
      'AMap.CitySearch',
      'AMap.AutoComplete'
    ], () => {
      if (map.value) {
        // 添加地图控件
        map.value.addControl(new AMap.Scale())
        map.value.addControl(new AMap.ToolBar())

        // 初始化搜索服务
        placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          citylimit: true,
          map: map.value,
          panel: 'my-panel',
          autoFitView: true
        })

        // 初始化自动完成
        autoComplete = new AMap.AutoComplete({
          city: '全国',
          citylimit: false,
          input: 'searchInput'
        })

        // 获取当前城市
        const citySearch = new AMap.CitySearch()
        citySearch.getLocalCity((status: string, result: any) => {
          if (status === 'complete' && result.city) {
            console.log('当前城市：', result.city)
            // 设置搜索城市
            placeSearch?.setCity(result.adcode)
          }
        })

        // 添加地图点事件监听
        map.value.on('click', () => {
          const searchPanel = document.getElementById('search-panel')
          if (searchPanel) {
            searchPanel.style.display = 'none'
          }
        })

        // 初始化定位插件
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,  // 使用高精度定位
          timeout: 10000,           // 超时时间
          buttonPosition: 'RB',     // 定位按钮位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮偏移量
          zoomToAccuracy: true,     // 定位成功后是否自动调整地图视野到定位点
          extensions: 'all'         // 返回地址描述
        })

        map.value.addControl(geolocation)

        // 监听定位
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            const { position, formattedAddress } = result

            // 清除旧标记
            if (marker) {
              map.value.remove(marker)
            }
            map.value.clearMap()

            // 创建新标记
            marker = createMarker([position.lng, position.lat], map.value)

            // 更新位置信息
            currentLocation.value = {
              lat: position.lat,
              lng: position.lng,
              address: formattedAddress
            }

            // 调整地图视野
            map.value.setZoomAndCenter(16, [position.lng, position.lat], false, 500)

          } else {
            console.error('定位失败:', result)
            // 如果浏览器定位失败，尝试IP定位
            getLocationByIP()
          }
        })

        // 添加导航插件初始化
        initNavigationPlugins()
      }
    })

    console.log('地图初始化完成:', map.value)
  } catch (error) {
    console.error('地图初始化失败:', error)
  }
}

onMounted(() => {
  // 添加安全密钥配置
  window._AMapSecurityConfig = {
    securityJsCode: 'ea29b0a3e11455374c7eee689e557fa7'
  }

  // 加载高德地图
  const script = document.createElement('script')
  script.src = `https://webapi.amap.com/maps?v=2.0&key=95bd8673b892276ea74f852f98ca138d&plugin=AMap.Scale,AMap.ToolBar,AMap.Geolocation,AMap.PlaceSearch,AMap.Weather,AMap.CitySearch,AMap.AutoComplete&security=true`
  script.async = false
  script.crossOrigin = "anonymous"
  script.onload = () => {
    console.log('地图脚本加载完成')
    initMap()
  }
  script.onerror = (error) => {
    console.error('地图脚本加载失败:', error)
  }
  document.head.appendChild(script)

  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 在 onUnmounted 中移除监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 处理搜索输入
const handleSearchInput = () => {
  if (!searchQuery.value) {
    searchSuggestions.value = []
    return
  }

  // 使用防抖
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    if (autoComplete) {
      autoComplete.search(searchQuery.value, (status: string, result: any) => {
        if (status === 'complete' && result.tips) {
          searchSuggestions.value = result.tips
          showSuggestions.value = true
        }
      })
    }
  }, 300)
}

// 处理失去焦点
const handleBlur = () => {
  // 延迟隐藏建议列表，以便能够点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 选择建议项
const selectSuggestion = (suggestion: any) => {
  searchQuery.value = suggestion.name
  showSuggestions.value = false

  if (map && suggestion.location) {
    // 清除旧的标记
    if (marker) {
      map.value.remove(marker)
    }
    map.value.clearMap()

    // 添加新标记
    marker = createMarker([suggestion.location.lng, suggestion.location.lat], map.value)

    // 移动到选中位置
    map.value.setZoomAndCenter(16, [suggestion.location.lng, suggestion.location.lat], false, 500)

    // 显示信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div class="info-window">
          <h4>${suggestion.name}</h4>
          <p>${suggestion.district}</p>
          ${suggestion.address ? `<p>${suggestion.address}</p>` : ''}
        </div>
      `,
      offset: new AMap.Pixel(0, -30)
    })

    infoWindow.open(map.value, marker.getPosition())
  }
}

// 添加地理码函数
const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(`/_AMapService/v3/geocode/geo?address=${encodeURIComponent(address)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const location = data.geocodes[0].location.split(',')
      return {
        lng: Number(location[0]),
        lat: Number(location[1]),
        formattedAddress: data.geocodes[0].formatted_address,
        level: data.geocodes[0].level
      }
    }
    return null
  } catch (error) {
    console.error('地理编码失败:', error)
    return null
  }
}

// 修改搜索处理函数
const handleSearch = () => {
  if (!searchQuery.value || !placeSearch || !map.value) return

  isSearching.value = true
  showSearchPanel.value = true

  placeSearch.search(searchQuery.value, (status: string, result: any) => {
    isSearching.value = false
    if (status === 'complete') {
      searchResults.value = result.poiList?.pois || []

      // 显示搜索面板
      const searchPanel = document.getElementById('search-panel')
      if (searchPanel) {
        searchPanel.style.display = 'block'
      }

      // 如果有搜索结果
      if (result.poiList?.pois && result.poiList.pois.length > 0) {
        const firstPOI = result.poiList.pois[0]

        // 清除旧记
        if (marker) {
          map.value.remove(marker)
        }
        map.value.clearMap()

        // 创建新标记
        marker = createMarker([firstPOI.location.lng, firstPOI.location.lat], map.value)

        // 调整地图视野到第一搜索结果
        map.value.setZoomAndCenter(16, [firstPOI.location.lng, firstPOI.location.lat], false, 500)

        // 显示信息窗体
        const infoWindow = new AMap.InfoWindow({
          content: `
            <div class="info-window">
              <h4>${firstPOI.name}</h4>
              <p>${firstPOI.address}</p>
              ${firstPOI.type ? `<p class="type">${firstPOI.type}</p>` : ''}
            </div>
          `,
          offset: new AMap.Pixel(0, -30)
        })

        infoWindow.open(map.value, marker.getPosition())
      }
    } else {
      console.error('搜索失败:', result)
    }
  })
}

// 添加创建标记的函数
const createMarker = (position: [number, number], map: AMap.Map) => {
  // 清除现有标记
  markers.forEach(marker => {
    if (map.value) {
      map.value.remove(marker)
    }
  })
  markers = []

  // 创建新标记
  const marker = new AMap.Marker({
    position: new AMap.LngLat(position[0], position[1]),
    map: map,
    icon: new AMap.Icon({
      size: new AMap.Size(32, 32),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
      imageSize: new AMap.Size(32, 32)
    }),
    offset: new AMap.Pixel(-16, -32),
    animation: 'AMAP_ANIMATION_DROP'
  })

  markers.push(marker)
  return marker
}

// 只保留这一个完整的 showOptimizedRouteInfo 函数定义
const showOptimizedRouteInfo = (result: any, optimizedRoute: {
  waypoints: number[],
  totalTime: number,
  waypointAddresses: string[]
}) => {
  if (!map.value || !result.routes || !result.routes[0]) return

  // 清除现有标记
  markers.forEach(marker => {
    if (map.value) {
      map.value.remove(marker)
    }
  })
  markers = []

  // 添加起点标记
  const startMarker = new AMap.Marker({
    position: result.routes[0].origin,
    map: map.value,
    icon: new AMap.Icon({
      size: new AMap.Size(32, 32),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/start.png',
      imageSize: new AMap.Size(32, 32)
    }),
    offset: new AMap.Pixel(-16, -32)
  })
  markers.push(startMarker)

  // 添加途经点标记
  result.routes[0].waypoints.forEach((point: any, index: number) => {
    const marker = new AMap.Marker({
      position: point,
      map: map.value,
      icon: new AMap.Icon({
        size: new AMap.Size(32, 32),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/way_point.png',
        imageSize: new AMap.Size(32, 32)
      }),
      offset: new AMap.Pixel(-16, -32),
      label: {
        content: `途经点${index + 1}`,
        direction: 'top'
      }
    })
    markers.push(marker)
  })

  // 添加终点标记
  const endMarker = new AMap.Marker({
    position: result.routes[0].destination,
    map: map.value,
    icon: new AMap.Icon({
      size: new AMap.Size(32, 32),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/end.png',
      imageSize: new AMap.Size(32, 32)
    }),
    offset: new AMap.Pixel(-16, -32)
  })
  markers.push(endMarker)

  // 调整地图视野以包含所有标记
  map.value.setFitView(markers)

  // 更新路线信息
  const hours = Math.floor(optimizedRoute.totalTime / 3600)
  const minutes = Math.floor((optimizedRoute.totalTime % 3600) / 60)

  tripRouteInfo.value = {
    totalDistance: Math.round(result.routes[0].distance / 100) / 10,
    totalTime: hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`,
    waypoints: optimizedRoute.waypoints.map((index, i) => {
      const waypointTime = Math.floor(result.routes[0].time / (optimizedRoute.waypoints.length + 1) * (i + 1))
      const waypointHours = Math.floor(waypointTime / 3600)
      const waypointMinutes = Math.floor((waypointTime % 3600) / 60)

      return {
        address: optimizedRoute.waypointAddresses[index - 1],
        time: waypointHours > 0 ?
          `${waypointHours}小时${waypointMinutes}分钟` :
          `${waypointMinutes}分钟`,
        distance: Math.round(result.routes[0].distance / (optimizedRoute.waypoints.length + 1) * (i + 1) / 100) / 10
      }
    })
  }
}

// 添加 IP 定位函数
const getLocationByIP = async () => {
  try {
    const response = await fetch(`https://restapi.amap.com/v3/ip?key=95bd8673b892276ea74f852f98ca138d`)
    const data = await response.json()

    if (data.status === '1' && map.value) {
      const [lng, lat] = data.rectangle.split(';')[0].split(',')

      // 清除旧标记
      if (marker) {
        map.value.remove(marker)
      }
      map.value.clearMap()

      // 创建新标记
      marker = createMarker([Number(lng), Number(lat)], map.value)

      // 更新位置信息
      currentLocation.value = {
        lat: Number(lat),
        lng: Number(lng),
        address: `${data.province}${data.city}`
      }

      // 调整地图视野
      map.value.setZoomAndCenter(12, [Number(lng), Number(lat)], false, 500)
    }
  } catch (error) {
    console.error('IP定位失败:', error)
  }
}

// 修改定位函数，先尝试IP定位
const getCurrentLocation = () => {
  if (!map.value) return

  // 显示加载状态
  isSearching.value = true

  // 优先使用浏览器定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        if (!map.value) return

        // 清除旧标记
        if (marker) {
          marker.setMap(null)  // 使用 setMap(null) 替代 map.remove(marker)
        }
        map.value.clearMap()

        // 创建新标记
        marker = createMarker([longitude, latitude], map.value)

        // 使用高德地图逆地理编码获取地址信息
        AMap.plugin(['AMap.Geocoder'], () => {
          const geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })

          geocoder.getAddress([longitude, latitude], (status: string, result: any) => {
            if (status === 'complete') {
              currentLocation.value = {
                lat: latitude,
                lng: longitude,
                address: result.regeocode.formattedAddress
              }
            }
          })
        })

        // 调整地图视野
        map.value.setZoomAndCenter(16, [longitude, latitude], false, 500)

        isSearching.value = false
      },
      (error) => {
        console.error('浏览器定位失败:', error)
        fallbackToAMapGeolocation()
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  } else {
    fallbackToAMapGeolocation()
  }
}

// 回退到高德定位的函数
const fallbackToAMapGeolocation = () => {
  if (!map.value) return

  const geolocation = new AMap.Geolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    zoomToAccuracy: true,
    extensions: 'all'
  })

  geolocation.getCurrentPosition((status: string, result: any) => {
    if (status === 'complete' && map.value) {
      const { position, accuracy } = result

      // 清除旧的标记
      if (marker) {
        map.value.remove(marker)
      }
      map.value.clearMap()

      // 创建定位精度圈
      const circle = new AMap.Circle({
        center: new AMap.LngLat(position.lng, position.lat),
        radius: accuracy || 100, // 使用高德地图提供的精度值��如果没有则默认100米
        strokeColor: "#3498db",
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: "#3498db",
        fillOpacity: 0.1,
        zIndex: 10
      })

      // 创建新的标记
      marker = new AMap.Marker({
        position: [position.lng, position.lat],
        map: map.value,
        animation: 'AMAP_ANIMATION_DROP',
        icon: new AMap.Icon({
          size: new AMap.Size(32, 32),
          image: '//webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          imageSize: new AMap.Size(32, 32),
          imageOffset: new AMap.Pixel(0, 0)
        }),
        offset: new AMap.Pixel(-16, -32),
        zIndex: 11
      })

      map.value.add([circle, marker])
      map.value.setCenter([position.lng, position.lat])
      map.value.setZoom(16)

      currentLocation.value = {
        lat: position.lat,
        lng: position.lng,
        address: result.formattedAddress
      }
    } else {
      console.error('高德定位失败:', result)
    }
  })
}

// 添加清除搜索功能
const clearSearch = () => {
  searchQuery.value = ''
  showSearchPanel.value = false
  const searchPanel = document.getElementById('search-panel')
  if (searchPanel) {
    searchPanel.style.display = 'none'
  }
  if (placeSearch) {
    placeSearch.clear()
  }
  if (map.value) {
    map.value.clearMap()
  }
}

// 切换导航面板
const toggleNavigation = () => {
  showNavigationPanel.value = !showNavigationPanel.value
  if (showNavigationPanel.value) {
    isNavCollapsed.value = false
  }
}

// 选择导航模式
const selectNavMode = (mode: string) => {
  currentNavMode.value = mode
}

// 开始导航
const startNavigation = async () => {
  if (!map.value || !startPoint.value || !endPoint.value) return

  // 清除地图上的路线
  map.value.clearMap()

  const startLngLat = await getLocationFromAddress(startPoint.value)
  const endLngLat = await getLocationFromAddress(endPoint.value)

  if (!startLngLat || !endLngLat) {
    console.error('无法获取起点或终点的坐标')
    return
  }

  switch (currentNavMode.value) {
    case 'drive':
      driving?.search(startLngLat, endLngLat)
      break
    case 'walk':
      walking?.search(startLngLat, endLngLat)
      break
    case 'ride':
      riding?.search(startLngLat, endLngLat)
      break
  }
}

// 地址转坐标
const getLocationFromAddress = async (address: string): Promise<any> => {
  try {
    // 如果是当前位置
    if (address === '当前位置' && currentLocation.value) {
      return new AMap.LngLat(currentLocation.value.lng, currentLocation.value.lat)
    }

    // 使用地理编码服务获取坐标
    return new Promise((resolve) => {
      AMap.plugin(['AMap.Geocoder'], () => {
        const geocoder = new AMap.Geocoder()
        geocoder.getLocation(address, (status: string, result: any) => {
          if (status === 'complete' && result.geocodes.length) {
            const location = result.geocodes[0].location
            resolve(new AMap.LngLat(location.lng, location.lat))
          } else {
            console.error('地理编码失败:', status, result)
            resolve(null)
          }
        })
      })
    })
  } catch (error) {
    console.error('获取位置坐标失败:', error)
    return null
  }
}

// 处理起点输入框聚焦
const handleStartPointFocus = () => {
  if (!startPoint.value && currentLocation.value) {
    startPoint.value = currentLocation.value.address || '当前位置'
  }
}

// 处理终点输入框聚焦
const handleEndPointFocus = () => {
  // 可以在这里添加终点输入的相关逻辑
}

// 初始化导航插件
const initNavigationPlugins = () => {
  if (!map.value) return

  AMap.plugin(['AMap.Driving', 'AMap.Walking', 'AMap.Riding'], () => {
    // 初始化驾车导航
    driving = new AMap.Driving({
      map: map.value,
      panel: 'route-panel',
      hideMarkers: false,
      showTraffic: true,
      autoFitView: true
    })

    // 初始化步行导航
    walking = new AMap.Walking({
      map: map.value,
      panel: 'route-panel',
      hideMarkers: false,
      autoFitView: true
    })

    // 初始化骑行导航
    riding = new AMap.Riding({
      map: map.value,
      panel: 'route-panel',
      hideMarkers: false,
      autoFitView: true
    })
  })
}

// 切换定制行程面板
const toggleCustomTrip = () => {
  showCustomTripPanel.value = !showCustomTripPanel.value
  if (showCustomTripPanel.value) {
    // 清空之前的设置
    tripStartPoint.value = ''
    tripEndPoint.value = ''
    waypoints.value = []
    tripRouteInfo.value = null
  }
}

// 添加途经点
const addWaypoint = () => {
  waypoints.value.push({ address: '' })
}

// 移除途经点
const removeWaypoint = (index: number) => {
  waypoints.value.splice(index, 1)
}

// 选择行程出行方式
const selectTripMode = (mode: string) => {
  currentTripMode.value = mode
}

// 理起点输入框焦
const handleTripStartPointFocus = () => {
  if (!tripStartPoint.value && currentLocation.value) {
    tripStartPoint.value = currentLocation.value.address || '当前位置'
  }
}

// 添加路线优化相关的接口和类型
interface WaypointWithTime {
  address: string
  location?: AMap.LngLat
  timeFromStart?: number  // 从起点该点的时间（秒）
  timeMatrix?: number[]   // 到其他点的时间矩阵
}

// 修改优化路线顺序的函数
const optimizeRoute = (timeMatrix: number[][], waypointsCount: number) => {
  // 只优化途经点的顺序，起点和终点是固定的
  const n = waypointsCount  // 只考虑途经点的数量
  const INF = Number.MAX_SAFE_INTEGER

  // 如果没有途经点，直接返回
  if (n === 0) {
    return {
      waypoints: [],
      totalTime: timeMatrix[0][timeMatrix.length - 1]  // 直接从起点到终点的时间
    }
  }

  // dp[mask][i] 表示访问了 mask 中的点，且当前在点 i 的最短时间
  const dp = Array(1 << n).fill(0).map(() => Array(n).fill(INF))
  const parent = Array(1 << n).fill(0).map(() => Array(n).fill(-1))

  // 初始化：从起点到每个途经点的时间
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = timeMatrix[0][i + 1]  // +1 因为矩阵索引0是起点
  }

  // 遍历所有状态
  for (let mask = 0; mask < (1 << n); mask++) {
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) === 0) continue // 当前状态没有包含点i

      for (let j = 0; j < n; j++) {
        if ((mask & (1 << j)) !== 0) continue // 点j已经访问过了

        const nextMask = mask | (1 << j)
        const time = dp[mask][i] + timeMatrix[i + 1][j + 1]  // +1 因为矩阵中索引0是起点

        if (time < dp[nextMask][j]) {
          dp[nextMask][j] = time
          parent[nextMask][j] = i
        }
      }
    }
  }

  // 找到访问完所有点后，到终点的最短时间
  const finalMask = (1 << n) - 1  // 所有点都访问过的状态
  let minTotalTime = INF
  let lastPoint = -1

  for (let i = 0; i < n; i++) {
    const totalTime = dp[finalMask][i] + timeMatrix[i + 1][timeMatrix.length - 1]  // 加上到终点的时间
    if (totalTime < minTotalTime) {
      minTotalTime = totalTime
      lastPoint = i
    }
  }

  // 重建路径
  const path = []
  let currentMask = finalMask
  let current = lastPoint

  while (current !== -1) {
    path.unshift(current + 1)  // +1 转换回原始途经点的索引
    const nextMask = currentMask ^ (1 << current)
    current = parent[currentMask][current]
    currentMask = nextMask
  }

  return {
    waypoints: path,
    totalTime: minTotalTime
  }
}

// 修改计算时间矩阵的函数
const calculateTimeMatrix = async (points: AMap.LngLat[]): Promise<number[][]> => {
  const n = points.length
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))

  // 计算所有点对之间的时间
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue
      const time = await calculateRouteTime(points[i], points[j])
      matrix[i][j] = time
    }
  }

  return matrix
}

// 计算两点间的行驶时间
const calculateRouteTime = (start: AMap.LngLat, end: AMap.LngLat): Promise<number> => {
  return new Promise((resolve) => {
    if (currentTripMode.value === 'drive' && driving) {
      driving.search(start, end, (status: string, result: any) => {
        if (status === 'complete' && result.routes && result.routes[0]) {
          resolve(result.routes[0].time)
        } else {
          resolve(0)
        }
      })
    } else if (currentTripMode.value === 'walk' && walking) {
      walking.search(start, end, (status: string, result: any) => {
        if (status === 'complete' && result.routes && result.routes[0]) {
          resolve(result.routes[0].time)
        } else {
          resolve(0)
        }
      })
    } else if (currentTripMode.value === 'ride' && riding) {
      riding.search(start, end, (status: string, result: any) => {
        if (status === 'complete' && result.routes && result.routes[0]) {
          resolve(result.routes[0].time)
        } else {
          resolve(0)
        }
      })
    } else {
      resolve(0)
    }
  })
}

// 修改路线规划函数中的相关部分
const planTrip = async () => {
  if (!map.value || !tripStartPoint.value || !tripEndPoint.value) {
    console.error('请设置起点和终点')
    return
  }

  // 检查是否有空的途经点
  if (waypoints.value.some(point => !point.address)) {
    console.error('请填写所有途经点')
    return
  }

  // 清除地图上的路线
  map.value.clearMap()

  try {
    // 获取起坐标
    const startLngLat = await getLocationFromAddress(tripStartPoint.value)
    if (!startLngLat) throw new Error('无法获取起点坐标')

    // 获取终点坐标
    const endLngLat = await getLocationFromAddress(tripEndPoint.value)
    if (!endLngLat) throw new Error('无法获取终点坐标')

    // 获取所有途经点坐标
    const waypointsWithLocation: WaypointWithTime[] = await Promise.all(
      waypoints.value.map(async point => {
        const location = await getLocationFromAddress(point.address)
        if (!location) throw new Error(`无法获取途经点 "${point.address}" 的坐标`)
        return {
          address: point.address,
          location: location
        }
      })
    )

    // 计算包含起点、途经点和终点�����间矩阵
    const allPoints = [startLngLat, ...waypointsWithLocation.map(wp => wp.location!), endLngLat]
    const timeMatrix = await calculateTimeMatrix(allPoints)

    // 优化途经点的访问顺序
    const optimizedRoute = optimizeRoute(timeMatrix, waypointsWithLocation.length)

    // 重新排序途经点
    const orderedWaypoints = optimizedRoute.waypoints.map(index =>
      waypointsWithLocation[index - 1].location!
    )

    // 使用优化后的顺序规划路线
    switch (currentTripMode.value) {
      case 'drive':
        if (driving) {
          driving.search(
            startLngLat,
            endLngLat,
            {
              waypoints: orderedWaypoints
            },
            (status: string, result: any) => {
              if (status === 'complete') {
                console.log('规划成功:', result)
                showOptimizedRouteInfo(result, {
                  waypoints: optimizedRoute.waypoints,
                  totalTime: optimizedRoute.totalTime,
                  waypointAddresses: waypointsWithLocation.map(wp => wp.address)
                })
              } else {
                console.error('规划失败:', result)
              }
            }
          )
        }
        break
      case 'walk':
      case 'ride':
        // 步行和骑行模式下分段规划
        const allPoints = [startLngLat, ...orderedWaypoints, endLngLat]
        for (let i = 0; i < allPoints.length - 1; i++) {
          if (currentTripMode.value === 'walk' && walking) {
            walking.search(allPoints[i], allPoints[i + 1])
          } else if (currentTripMode.value === 'ride' && riding) {
            riding.search(allPoints[i], allPoints[i + 1])
          }
        }
        break
    }
  } catch (error) {
    console.error('行程规划失败:', error)
  }
}

// 在现有的变量声明后添加
const openPoiDetail = (poiId: string) => {
  const url = `https://uri.amap.com/poidetail?poiid=${poiId}&src=travel_planner&callnative=0`
  window.open(url, '_blank')
}

// 修改 getPlaceInfo 函数
const getPlaceInfo = async (keyword: string) => {
  return new Promise((resolve) => {
    if (!placeSearch) return resolve({})

    placeSearch.search(keyword, (status: string, result: any) => {
      if (status === 'complete' && result.poiList?.pois?.[0]) {
        const poi = result.poiList.pois[0]
        resolve({
          poiid: poi.id,
          description: poi.address || poi.name,
          tips: `营业时间：${poi.business || '暂无'}\n地址：${poi.address || '暂无'}`,
          image: poi.photos?.[0]?.url || '',
          type: poi.type,
          tel: poi.tel || '暂无'
        })
      } else {
        resolve({})
      }
    })
  })
}

// 修改信息窗体的创建部分
const createInfoWindow = (point: any, placeInfo: any) => {
  return new AMap.InfoWindow({
    content: `
      <div class="custom-info-window">
        <h3>${point.title}</h3>
        ${placeInfo.image ? `
          <div class="info-image">
            <img src="${placeInfo.image}" alt="${point.title}">
          </div>
        ` : ''}
        <div class="info-content">
          <p class="info-address">${placeInfo.description || '暂无描述'}</p>
          ${placeInfo.tel ? `
            <p class="info-tel">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              ${placeInfo.tel}
            </p>
          ` : ''}
          ${placeInfo.tips ? `
            <div class="info-tips">
              <h4>参观建议</h4>
              <p>${placeInfo.tips}</p>
            </div>
          ` : ''}
          <div class="info-actions">
            <button class="detail-btn" onclick="window.open('https://uri.amap.com/marker?position=${point.location.lng},${point.location.lat}&name=${encodeURIComponent(point.title)}&src=mypage', '_blank')">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              在高德地图中查看
            </button>
            ${placeInfo.poiid ? `
              <button class="detail-btn secondary" onclick="window.open('https://uri.amap.com/poidetail?poiid=${placeInfo.poiid}&src=mypage', '_blank')">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                查看详情
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `,
    offset: new AMap.Pixel(0, -32)
  })
}

// 在现有的变量声明后添加
const createCustomLabel = (position: [number, number], content: string, onClick?: () => void) => {
  if (!map.value) return null

  // 创建自定义标签的 DOM 元素
  const div = document.createElement('div')
  div.className = 'custom-label'
  div.style.position = 'relative'
  div.style.zIndex = '100'
  div.innerHTML = `
    <div class="label-content">
      ${content}
    </div>
  `

  // 创建标记
  const marker = new AMap.Marker({
    position: new AMap.LngLat(position[0], position[1]),
    content: div,
    anchor: 'bottom-center',
    offset: new AMap.Pixel(0, -10), // 调整偏移量
    zIndex: 100, // 设置 marker 的 zIndex
    map: map.value
  })

  // 添加点击事件
  if (onClick) {
    div.addEventListener('click', (e) => {
      e.stopPropagation() // 阻止事件冒泡
      onClick()
    })
  }

  // 添加鼠标悬停效果
  div.addEventListener('mouseover', () => {
    div.classList.add('hover')
  })

  div.addEventListener('mouseout', () => {
    div.classList.remove('hover')
  })

  return marker
}

// 修改现有的 addRouteLabels 函数
const addRouteLabels = (route: any) => {
  if (!map.value) return

  // 添加起点标签（绿色标签）
  createCustomLabel(
    [route.origin.lng, route.origin.lat],
    '<div class="label-start">起点</div>',
    () => {
      // 点击时显示信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: `
          <div class="route-info-window">
            <h4>起点信息</h4>
            <p class="address">${startPoint.value}</p>
            ${currentLocation.value?.address ?
            `<p class="current-location">当前位置: ${currentLocation.value.address}</p>`
            : ''
          }
            <div class="route-actions">
              <button class="action-btn" onclick="window.open('https://uri.amap.com/marker?position=${route.origin.lng},${route.origin.lat}&name=起点', '_blank')">
                在高德地图中查看
              </button>
            </div>
          </div>
        `,
        offset: new AMap.Pixel(0, -30),
        zIndex: 1000, // 添加 zIndex
        autoMove: true, // 自动调整置
        closeWhenClickMap: true // 点击地图其他区域关闭
      })
      infoWindow.open(map.value, new AMap.LngLat(route.origin.lng, route.origin.lat))
    }
  )

  // 添加终点标签
  createCustomLabel(
    [route.destination.lng, route.destination.lat],
    '<div class="label-end">终点</div>',
    () => {
      const infoWindow = new AMap.InfoWindow({
        content: `
          <div class="route-info-window">
            <h4>终点</h4>
            <p>${endPoint.value}</p>
          </div>
        `,
        offset: new AMap.Pixel(0, -30),
        zIndex: 1000, // 添加 zIndex
        autoMove: true, // 自动调整位置
        closeWhenClickMap: true // 点击地图其他区域关闭
      })
      infoWindow.open(map.value, new AMap.LngLat(route.destination.lng, route.destination.lat))
    }
  )

  // 添加转向点标签
  route.steps.forEach((step: any) => {
    if (step.instruction && step.action !== '直行') {
      createCustomLabel(
        [step.start_location.lng, step.start_location.lat],
        `<div class="label-turn">${step.action}</div>`,
        () => {
          const infoWindow = new AMap.InfoWindow({
            content: `
              <div class="route-info-window">
                <p>${step.instruction}</p>
              </div>
            `,
            offset: new AMap.Pixel(0, -30),
            zIndex: 1000, // 添加 zIndex
            autoMove: true, // 自动调整位置
            closeWhenClickMap: true // 点击地图其他区域���闭
          })
          infoWindow.open(map.value, new AMap.LngLat(step.start_location.lng, step.start_location.lat))
        }
      )
    }
  })
}

// 添加 AMap 类型定义
declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, options?: any)
    clearMap(): void
    remove(marker: Marker): void
    setZoomAndCenter(zoom: number, center: [number, number], immediately?: boolean, duration?: number): void
    addControl(control: any): void
    setCenter(position: [number, number]): void
    setZoom(zoom: number): void
    add(overlayers: any[]): void
  }

  class Marker {
    constructor(options: MarkerOptions)
    setMap(map: Map | null): void
    getPosition(): LngLat
    on(event: string, handler: Function): void
  }

  interface MarkerOptions {
    position: LngLat | [number, number]
    map?: Map
    icon?: Icon
    content?: HTMLElement | string
    offset?: Pixel
    anchor?: string
    animation?: string
    zIndex?: number
  }

  class Icon {
    constructor(options: IconOptions)
  }

  interface IconOptions {
    size: Size
    image: string
    imageSize: Size
  }

  class Size {
    constructor(width: number, height: number)
  }

  class Pixel {
    constructor(x: number, y: number)
  }

  class LngLat {
    constructor(lng: number, lat: number)
    getLng(): number
    getLat(): number
  }

  class PlaceSearch {
    constructor(options?: any)
    search(keyword: string, callback: (status: string, result: any) => void): void
    searchNearBy(keyword: string, center: LngLat, radius: number, callback: (status: string, result: any) => void): void
  }

  class Geocoder {
    constructor(options?: any)
    getLocation(address: string, callback: (status: string, result: any) => void): void
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions)
    open(map: Map, position: LngLat): void
  }

  interface InfoWindowOptions {
    content: string
    offset?: Pixel
    position?: LngLat
    closeWhenClickMap?: boolean
    autoMove?: boolean
    zIndex?: number
  }

  class Driving {
    constructor(options: any)
    search(start: LngLat, end: LngLat, options?: any, callback?: (status: string, result: any) => void): void
  }

  class Walking {
    constructor(options: any)
    search(start: LngLat, end: LngLat, callback?: (status: string, result: any) => void): void
  }

  class Riding {
    constructor(options: any)
    search(start: LngLat, end: LngLat, callback?: (status: string, result: any) => void): void
  }

  class AutoComplete {
    constructor(options?: any)
    search(keyword: string, callback: (status: string, result: any) => void): void
  }

  function plugin(plugins: string[], callback: () => void): void
}

// 修改获取地点图片的函数
const getPlaceImage = async (keyword: string) => {
  try {
    if (!placeSearch) return ''

    return new Promise((resolve) => {
      placeSearch.search(keyword, (status: string, result: any) => {
        if (status === 'complete' && result.poiList?.pois?.[0]?.photos?.[0]) {
          resolve(result.poiList.pois[0].photos[0].url)
        } else {
          // 如果没有找到图片，尝试搜索相关地点
          placeSearch.searchNearBy(keyword, new AMap.LngLat(116.397428, 39.90923), 50000, (status: string, result: any) => {
            if (status === 'complete' && result.poiList?.pois?.[0]?.photos?.[0]) {
              resolve(result.poiList.pois[0].photos[0].url)
            } else {
              resolve('')
            }
          })
        }
      })
    })
  } catch (error) {
    console.error('获取图片失败:', error)
    return ''
  }
}

// 修改显示位置信息弹窗的函数
const showLocationInfo = async (type: 'start' | 'end', address: string) => {
  try {
    if (!map.value) {
      console.error('地图实例未初始化')
      return
    }

    const position = await getLocationFromAddress(address)
    if (!position) {
      console.error('无法获取位置坐标')
      return
    }

    // 获取地点图片
    const imageUrl = await getPlaceImage(address)
    console.log('获取到的图片URL:', imageUrl)

    // 创建信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div class="route-info-window">
          <h4>${type === 'start' ? '起点' : '终点'}信息</h4>
          ${imageUrl ? `
            <div class="place-image">
              <img src="${imageUrl}" alt="${address}" onerror="this.style.display='none'" />
            </div>
          ` : ''}
          <p class="address">${address}</p>
          ${type === 'start' && currentLocation.value?.address ?
          `<p class="current-location">当前位置: ${currentLocation.value.address}</p>`
          : ''
        }
          <div class="route-actions">
            <button class="action-btn" onclick="window.open('https://uri.amap.com/marker?position=${position.getLng()},${position.getLat()}&name=${encodeURIComponent(type === 'start' ? '起点' : '终点')}', '_blank')">
              在高德地图中查看
            </button>
          </div>
        </div>
      `,
      offset: new AMap.Pixel(0, -30),
      closeWhenClickMap: true
    })

    // 打开信息窗体
    infoWindow.open(map.value, position)
  } catch (error) {
    console.error('显示信息窗体失败:', error)
  }
}

// 修改导航面板中的按钮点击事件处理函数
const handleShowLocationInfo = (type: 'start' | 'end', address: string) => {
  console.log('点击查看位置信息:', type, address)
  showLocationInfo(type, address)
}

// 添加新的响应式变量
const isMobile = ref(false)
const isNavCollapsed = ref(false)

// 添加检测屏幕宽度的函数
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isNavCollapsed.value = false
  }
}

// 在 onMounted 中添加窗口大小监听
onMounted(() => {
  // ... 现有代码 ...
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 在 onUnmounted 中移除监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.home {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.info-card,
.search-box,
.toolbar {
  z-index: 2;
  position: absolute;
}

.info-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(107, 155, 199, 0.15);
}

.location-info {
  position: absolute;
  top: 20px;
  left: 20px;
  min-width: 250px;
}

.location-info h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #6b9bc7;
}

.search-box {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.98);
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 4px 25px rgba(52, 152, 219, 0.15);
  transform: translateX(-50%) translateY(2px);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.3s ease;
  gap: 0.5rem;
}

.search-input-wrapper:focus-within {
  background: white;
  box-shadow: inset 0 0 0 2px #3498db;
}

.search-icon {
  color: #666;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
}

.search-icon .icon {
  width: 18px;
  height: 18px;
}

input {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  padding: 0.5rem 0;
  font-size: 1rem;
  color: #333;
  outline: none;
}

input::placeholder {
  color: #999;
}

.clear-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  margin-right: 0.25rem;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #666;
}

.clear-btn .icon {
  width: 16px;
  height: 16px;
}

.search-loading {
  margin-left: 0.5rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}


.toolbar {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tool-btn {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(107, 155, 199, 0.15);
  transition: all 0.3s ease;
}

.tool-btn:hover {
  background: #f0f8ff;
  color: #6b9bc7;
}

.icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .location-info {
    top: auto;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
  }

  .search-box {
    width: 90%;
    padding: 0.5rem;
  }

  .search-input-wrapper {
    padding: 0.4rem 0.75rem;
  }

  input {
    font-size: 0.95rem;
  }

  .search-btn {
    padding: 0.5rem 0.75rem;
    min-width: 60px;
    font-size: 0.9rem;
  }
}

/* 更新控件样式为蓝色主题 */
:deep(.amap-scale) {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(107, 155, 199, 0.1);
}

:deep(.amap-toolbar) {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(107, 155, 199, 0.1);
}

:deep(.amap-controlbar) {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(107, 155, 199, 0.1);
}

/* 自定义信息窗体样式 */
:deep(.amap-info-content) {
  padding: 0 !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001 !important;
}

:deep(.amap-info-outer) {
  z-index: 1001 !important;
}

:deep(.amap-info-sharp) {
  z-index: 1001 !important;
  background-color: white !important;
}

:deep(.info-window) {
  min-width: 200px;
}

:deep(.info-window h4) {
  margin: 0 0 0.5rem 0;
  color: #333;
}

:deep(.info-window p) {
  margin: 0.25rem 0;
  color: #666;
}

:deep(.info-window .type) {
  color: #1890ff;
  font-size: 0.9em;
}

.search-panel {
  position: absolute;
  top: 80px;
  right: 20px;
  width: 400px;
  max-height: calc(100vh - 100px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  display: none;
}

/* 自定义高德地图搜索结果面板样式 */
:deep(.amap-lib-placeSearch) {
  border: none !important;
}

:deep(.amap-lib-placeSearch .poibox) {
  border-bottom: 1px solid #eee;
  padding: 1rem;
}

:deep(.amap-lib-placeSearch .poibox:hover) {
  background-color: #f5f5f5;
}

:deep(.amap-lib-placeSearch .poibox .poi-title) {
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

:deep(.amap-lib-placeSearch .poibox .poi-info) {
  color: #666;
  font-size: 0.9rem;
}

:deep(.amap-lib-placeSearch .poibox .poi-more) {
  color: #1890ff;
}

:deep(.amap-lib-placeSearch .pageLink) {
  border: none;
  margin: 1rem;
  padding: 0.5rem;
}

:deep(.amap-lib-placeSearch .pageLink:hover) {
  background-color: #f5f5f5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-panel {
    width: 90%;
    left: 5%;
    right: 5%;
  }
}

/* 添加搜索按钮样式 */
.search-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 70px;
}

.search-btn:hover {
  background: #2980b9;
}

.search-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.search-input-container {
  position: relative;
  flex: 1;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.75rem;
}

.suggestion-item:hover {
  background: #f5f7fa;
}

.suggestion-icon {
  color: #3498db;
}

.suggestion-icon .icon {
  width: 16px;
  height: 16px;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.suggestion-address {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 自定义滚动条样式 */
.search-suggestions::-webkit-scrollbar {
  width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.search-suggestions::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 添加导航面板样式 */
.navigation-panel {
  position: absolute;
  top: 20px;
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: all 0.3s ease;
}

/* 添加左侧面板样式 */
.navigation-panel.left-side {
  left: 20px;
  transform: translateX(0);
}

/* 移动端样式 */
@media (max-width: 768px) {
  .navigation-panel.mobile {
    top: 0;
    left: 0;
    height: 100vh;
    margin: 0;
    border-radius: 0;
    width: 300px;
    transform: translateX(-100%);
  }

  .navigation-panel.mobile.collapsed {
    transform: translateX(-100%);
  }

  .navigation-panel.mobile:not(.collapsed) {
    transform: translateX(0);
  }

  /* 添加遮罩层 */
  .navigation-panel.mobile::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .navigation-panel.mobile:not(.collapsed)::before {
    opacity: 1;
    pointer-events: auto;
  }
}

/* 优化导航面板内容样式 */
.nav-content {
  padding: 1rem;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

/* 优化关闭按钮样式 */
.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.close-btn .icon {
  width: 20px;
  height: 20px;
}

/* 优化滚动条样式 */
.nav-content::-webkit-scrollbar {
  width: 6px;
}

.nav-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.nav-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.nav-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.nav-header h3 {
  margin: 0;
  color: #333;
}

.nav-input-group {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 0.5rem;
}

.nav-icon {
  padding: 0.5rem;
  color: #3498db;
}

.nav-input-group input {
  flex: 1;
  border: none;
  background: none;
  padding: 0.5rem;
  font-size: 0.95rem;
  color: #333;
}

.nav-mode {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: #e8f4fc;
  border-color: #3498db;
  color: #3498db;
}

.mode-icon {
  color: currentColor;
}

.start-nav-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-nav-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.route-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.route-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.route-steps {
  max-height: 300px;
  overflow-y: auto;
}

.route-step {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}

.route-step:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .navigation-panel {
    width: 90%;
    left: 5%;
    right: 5%;
  }
}

.route-panel {
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 自定义路线面板样式 */
:deep(.amap-lib-driving) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.amap-lib-driving .planTitle) {
  background: #f5f7fa;
  padding: 12px;
  color: #333;
}

:deep(.amap-lib-driving .plan) {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

:deep(.amap-lib-driving .plan:last-child) {
  border-bottom: none;
}

:deep(.amap-lib-driving .step) {
  padding: 8px 12px;
  color: #666;
}

/* 配移动端 */
@media (max-width: 768px) {
  .route-panel {
    max-height: 300px;
  }
}

/* 添加定制行程面板样式 */
.custom-trip-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: calc(100vh - 40px);
  /* 减去上下边距 */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 防止内容溢出 */
}

/* 头部固定 */
.nav-header {
  flex-shrink: 0;
  /* 防止头部被压缩 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: white;
  /* 确保头部不透明 */
  z-index: 1;
  /* 保持在滚动内容之上 */
}

/* 内容区域可滚动 */
.nav-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 自定义滚动条样式 */
.nav-content::-webkit-scrollbar {
  width: 6px;
}

.nav-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.nav-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.nav-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .custom-trip-panel {
    width: 90%;
    left: 5%;
    right: 5%;
    max-height: calc(100vh - 60px);
    top: 30px;
  }
}

.waypoints-list {
  margin: 1rem 0;
}

.waypoint-item {
  margin-bottom: 0.5rem;
}

.waypoint-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
}

.remove-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #e74c3c;
}

.add-waypoint-btn {
  width: 100%;
  padding: 0.75rem;
  background: #f5f7fa;
  border: 1px dashed #ccc;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
  transition: all 0.2s ease;
}

.add-waypoint-btn:hover {
  background: #e8f4fc;
  border-color: #3498db;
  color: #3498db;
}

.trip-options {
  margin: 1rem 0;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.option-group {
  margin-bottom: 1rem;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

/* 添加路线信息样式 */
.trip-route-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.route-header {
  margin-bottom: 1rem;
}

.route-header h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.route-summary {
  display: flex;
  gap: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.summary-item .icon {
  width: 16px;
  height: 16px;
  color: #3498db;
}

.route-stops {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stop-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stop-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #3498db;
}

.stop-icon .icon {
  width: 20px;
  height: 20px;
}

.stop-content {
  flex: 1;
}

.stop-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.stop-address {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stop-time {
  color: #3498db;
  font-size: 0.85rem;
}

.waypoint .stop-icon {
  background: #3498db;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
}

.stop-item.start {
  border-left: 3px solid #2ecc71;
}

.stop-item.end {
  border-left: 3px solid #e74c3c;
}

.stop-item.waypoint {
  border-left: 3px solid #3498db;
}

.readonly-input {
  background: #f0f2f5;
  cursor: not-allowed;
  color: #666;
}

.readonly-input::placeholder {
  color: #999;
}

.custom-info-window {
  padding: 1.25rem;
  max-width: 320px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.custom-info-window h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.info-image {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.info-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.info-image img:hover {
  transform: scale(1.05);
}

.info-content {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.info-address {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.info-address::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'/%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E");
}

.info-tel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #3498db;
}

.info-tel .icon {
  width: 16px;
  height: 16px;
  color: currentColor;
}

.info-tips {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-tips h4 {
  color: #2c3e50;
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.detail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

.detail-btn .icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.detail-btn:hover .icon {
  transform: translateX(4px);
}

.info-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.detail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-btn:not(.secondary) {
  background: #3498db;
  color: white;
}

.detail-btn.secondary {
  background: #f5f7fa;
  color: #666;
}

.detail-btn:hover {
  transform: translateY(-1px);
}

.detail-btn:not(.secondary):hover {
  background: #2980b9;
}

.detail-btn.secondary:hover {
  background: #e9ecef;
}

.detail-btn .icon {
  width: 16px;
  height: 16px;
}

.custom-info-window {
  min-width: 280px;
  max-width: 320px;
}

/* 在现有样式后添加 */
.custom-label {
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  /* 增加 z-index */
  position: relative;
  /* 添加相对定位 */
}

.custom-label:hover {
  transform: translateY(-2px);
}

.label-start {
  background: #2ecc71;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(46, 204, 113, 0.3);
  z-index: 101;
  /* 增加 z-index */
}

.label-end {
  background: #e74c3c;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(231, 76, 60, 0.3);
  z-index: 101;
  /* 增加 z-index */
}

.label-turn {
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  border: 1px solid #bdc3c7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 101;
  /* 增加 z-index */
}

.route-info-window {
  padding: 16px;
  max-width: 320px;
  /* 增加宽度以适应图片 */
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  z-index: 1001;
  position: relative;
}

.route-info-window h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.route-info-window .address {
  margin: 0 0 8px 0;
  color: #34495e;
  font-size: 14px;
  line-height: 1.4;
}

.route-info-window .current-location {
  margin: 0 0 12px 0;
  color: #7f8c8d;
  font-size: 13px;
  line-height: 1.4;
}

.route-actions {
  margin-top: 12px;
}

.action-btn {
  width: 100%;
  padding: 8px 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

/* 添加标签悬停效果 */
.label-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.4);
}

/* 添加全局样式以覆盖高德地图的默认样式 */
:deep(.amap-marker) {
  z-index: 100 !important;
}

:deep(.amap-info-sharp) {
  z-index: 1000 !important;
}

:deep(.amap-info-outer) {
  z-index: 1000 !important;
}

/* 确保标签内容在地图控件上方 */
.label-content {
  position: relative;
  z-index: 102;
}

/* 在现有样式中添加 */
.location-info-btn {
  position: relative;
  z-index: 102;
  background: none;
  border: none;
  padding: 6px;
  color: #666;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.location-info-btn:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  transform: scale(1.1);
}

.location-info-btn .icon {
  width: 18px;
  height: 18px;
}

/* 在现有样式中添加 */
.place-image {
  margin: 12px 0;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.place-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.place-image img:hover {
  transform: scale(1.05);
}
</style>
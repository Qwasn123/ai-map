declare namespace AMap {
  interface MapOptions {
    zoom?: number
    center?: [number, number]
    viewMode?: '2D' | '3D'
    pitch?: number
    features?: string[]
    showLabel?: boolean
    showIndoorMap?: boolean
    mapStyle?: string
    skyColor?: string
    buildingAnimation?: boolean
    canvasRenderOptions?: {
      willReadFrequently?: boolean
    }
  }

  interface MarkerOptions {
    position: [number, number]
    map?: Map
    animation?: string
    icon?: Icon
    zIndex?: number
    offset?: Pixel
    title?: string
    label?: {
      content: string
      direction?: string
    }
  }

  interface GeolocationOptions {
    enableHighAccuracy?: boolean
    timeout?: number
    zoomToAccuracy?: boolean
    buttonPosition?: string
    buttonOffset?: Pixel
    extensions?: string
  }

  interface PlaceSearchOptions {
    map?: Map
    pageSize?: number
    pageIndex?: number
    citylimit?: boolean
    autoFitView?: boolean
    type?: string
    city?: string
    panel?: string
  }

  type MapEventListener = (event: any) => void

  class Map {
    constructor(container: string, options: MapOptions)
    addControl(control: any): void
    setCenter(position: [number, number]): void
    setZoom(level: number): void
    add(overlay: any | any[]): void
    remove(overlay: any | any[]): void
    clearMap(): void
    setMapStyle(style: string): void
    setPitch(pitch: number): void
    setZoomAndCenter(zoom: number, center: [number, number], immediately?: boolean, duration?: number): void
    on(eventName: string, handler: MapEventListener): void
    off(eventName: string, handler: MapEventListener): void
    addListener(eventName: string, handler: MapEventListener): void
    removeListener(eventName: string, handler: MapEventListener): void
    emit(eventName: string, data?: any): void
  }

  class Marker {
    constructor(options: MarkerOptions)
    setPosition(position: [number, number]): void
    getPosition(): LngLat
  }

  class Geolocation {
    constructor(options: GeolocationOptions)
    getCurrentPosition(callback: (status: string, result: any) => void): void
  }

  class Pixel {
    constructor(x: number, y: number)
  }

  class Scale {
    constructor()
  }

  class ToolBar {
    constructor()
  }

  class ControlBar {
    constructor(options: { position: { top: string, right: string } })
  }

  class PlaceSearch {
    constructor(options: PlaceSearchOptions)
    search(keyword: string, callback: (status: string, result: SearchResult) => void): void
    clear(): void
    setCity(city: string): void
    setType(type: string): void
    setPageIndex(pageIndex: number): void
    setPageSize(pageSize: number): void
  }

  function plugin(plugins: string[], callback: () => void): void

  class Circle {
    constructor(options: {
      center: LngLat;
      radius: number;
      strokeColor: string;
      strokeOpacity: number;
      strokeWeight: number;
      fillColor: string;
      fillOpacity: number;
      zIndex?: number;
    })
  }

  class LngLat {
    constructor(lng: number, lat: number)
  }

  class Size {
    constructor(width: number, height: number)
  }

  class Icon {
    constructor(options: IconOptions)
  }

  class Weather {
    constructor()
    getLive(city: string, callback: (err: any, data: any) => void): void
  }

  class CitySearch {
    constructor()
    getLocalCity(callback: (status: string, result: any) => void): void
  }

  class MouseTool {
    constructor(map: Map)
    rule(): void
  }

  class HawkEye {
    constructor(options: {
      opened?: boolean
      mapStyle?: string
    })
  }

  interface AutoCompleteResult {
    info: string
    count: number
    tips: Array<{
      name: string
      district: string
      adcode: string
      location: {
        lng: number
        lat: number
      }
      address: string
      type: string
    }>
  }

  interface AutoCompleteOptions {
    city?: string
    citylimit?: boolean
    input?: string
    output?: string
    outPutDirAuto?: boolean
    closeResultOnScroll?: boolean
    lang?: string
  }

  class AutoComplete {
    constructor(options: AutoCompleteOptions)
    search(keyword: string, callback?: (status: string, result: AutoCompleteResult) => void): void
    setCity(city: string): void
    setCityLimit(limit: boolean): void
    on(event: string, handler: Function): void
    off(event: string, handler: Function): void
  }

  interface InfoWindowOptions {
    content: string
    offset?: Pixel
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions)
    open(map: Map, position: [number, number] | LngLat): void
  }

  interface SearchResult {
    poiList: {
      pois: Array<{
        name: string
        type: string
        address: string
        location: {
          lng: number
          lat: number
        }
        distance?: number
        tel?: string
        rating?: number
      }>
    }
  }

  interface IconOptions {
    size: Size
    image: string
    imageSize: Size
    imageOffset?: Pixel
  }

  interface IPLocationResult {
    status: string
    info: string
    infocode: string
    province: string
    city: string
    adcode: string
    rectangle: string  // 所在城市范围的经纬度信息
  }

  interface GeocodeResult {
    status: string
    info: string
    infocode: string
    count: string
    geocodes: Array<{
      formatted_address: string
      country: string
      province: string
      citycode: string
      city: string
      district: string
      township: string
      neighborhood: string
      building: string
      adcode: string
      street: string
      number: string
      location: string
      level: string
    }>
  }
}

interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string;
    serviceHost?: string;
  };
} 
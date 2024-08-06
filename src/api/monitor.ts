import request from "@/utils/request";

class MonitorAPI {
  /**
   * 获取当前用户的路由列表
   * <p/>
   * 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   *
   * @returns 路由列表
   */
  static getMonitorData() {
    return request<any, Section[]>({
      url: "/api/v1/monitor/data",
      method: "get",
    });
    // return request({
    //   url: window.location.origin + '/api/monitor.json',
    //   method: 'get'
    // })
  }

  static getStaticData(fetchStr:any, baseURL?:any) {
    baseURL = baseURL || import.meta.env.BASE_URL
    const res = request({
      baseURL,
      url: fetchStr,
      method: 'get'
    })
    return res.then(data => {
      return {
        code: 0,
        data: data,
        msg: 'success'
      }
    })
  }
}

export default MonitorAPI;

/** Monitor，路段对象 */
export interface Section {
  /** 路段ID */
  ID?: number;
  /** 路段名称 */
  Name?: string;
  /** 路段位置 */
  Location?: string;
  /** 监测点预警信息 */
  Monitors: Monitor[]
}

/** Monitor，监测点对象 */
export interface Monitor {
  /** 监测点ID */
  ID?: number;
  /** 监测点名称 */
  Name?: string;
  /** 监测点类型 */
  Type?: string;
  /** 监测点经度 */
  Longitude?: number;
  /** 监测点纬度 */
  Latitude?: number;
  /** 监测点描述 */
  Info?: string;
  /** 监测点预警信息 */
  Warnings: Warning[]
}

/** Warning，预警信息 */
export interface Warning {
  /** 预警ID */
  ID?: number;
  /** 预警名称 */
  Name?: string;
  /** 预警类型 */
  Type?: string;
  /** 预警点坐标 */
  Point?: Point;
  /** 预警参数 */
  Params?: string;
  /** 诊断结果 */
  Result?: string;
}

/** Point 预警点空间坐标*/
export interface Point {
  /** X坐标 */
  X?: number;
  /** Y坐标 */
  Y?: number;
  /** Z坐标 */
  Z?: number;
}
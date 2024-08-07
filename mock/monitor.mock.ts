import { defineMock } from "./base";

export default defineMock([
  {
    url: "monitor/data",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        {
          section_id: 1,
          section_name: "清云高速路段",
          location: "广东",
          slopes: [
            {
              slope_id: 1,
              slope_name: "K442",
              location: {lng: 112.84530189035773, lat: 23.679599360034878},
              milepost: "K442",
              slope_type: "填方边坡",
              slope_hight: 60,
              slope_length: 200,
              description: "位置：112.845°E 23.679°N",
              construction_date: "2015-2-19",
              status: "disease",
              alerts: []
            },
            {
              slope_id: 2,
              slope_name: "K469",
              location: {lng: 112.67669991732917, lat: 23.541150959026098},
              milepost: "K469",
              slope_type: "填方边坡",
              slope_hight: 60,
              slope_length: 200,
              description: "位置：112.676°E 23.541°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: []
            },
            {
              slope_id: 3,
              slope_name: "K490",
              location: {lng: 112.54999809638318, lat: 23.399405789913807},
              milepost: "K490",
              slope_type: "填方边坡",
              slope_hight: 60,
              slope_length: 200,
              description: "位置：112.549°E 23.399°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: []
            },
            {
              slope_id: 4,
              slope_name: "K505",
              location: {lng: 112.44330737056826, lat: 23.319109746270055},
              milepost: "K505",
              slope_type: "填方边坡",
              slope_hight: 60,
              slope_length: 200,
              description: "位置：112.443°E 23.319°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: []
            },
            {
              slope_id: 5,
              slope_name: "K533",
              location: {lng: 112.2599725808845, lat: 23.174021966509578},
              milepost: "K533",
              slope_type: "填方边坡",
              slope_hight: 60,
              slope_length: 200,
              description: "位置：112.259°E 23.175°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: [
                {
                  alert_id: 1,
                  alert_name: "沉降区域",
                  timestamp: "2024-7-6",
                  slope_id: 5,
                  alert_level: "高",
                  alert_prediction: "70%",
                  location: {lng:112.251938092557, lat:23.17341576175863, height:8},
                  description: "边坡出现沉降",
                  status: "未处理",
                  disease:{
                    detection_id: 1,
                    flight_id: 7,
                    slope_id: 5,
                    discovery_date: "2024-7-1",
                    image_url: ["./images/1.jpg","./images/Point4_Ground.jpg","./images/Point4_LiDAR.jpg"],
                    disease_type: "settle",
                    severity: "middle",
                    area: [[112.25210438127453,23.17364176347438,0.7],
                    [112.25163973933368,23.173402338969847,0.7 ],
                    [112.2517705932293,23.173186573504438,15.5],
                    [112.25223765700353,23.17343237030716,15.5]],
                    marks: [{lng:112.25223765700353,lat:23.17343237030716,height:15.228},
                      {lng:112.25212097267745,lat:23.17337000198085,height:14.929},
                      {lng:112.25200305906922,lat:23.173312987995597,height:15.439},
                      {lng:112.25187944262898,lat:23.173245447309956,height:15.319},
                      {lng:112.2517705932293,lat:23.173186573504438,height:15.458},
                      {lng:112.25219495514759,lat:23.1734953290640964,height:9.991},
                      {lng:112.25207537535925,lat:23.17344186741928,height:11.315},
                      {lng:112.25196614747804,lat:23.17337382418119,height:9.777},
                      {lng:112.25183773266045,lat:23.17331112458671,height:10.155},
                      {lng:112.25172740403818,lat:23.17325594599373,height:10.592},
                      {lng:112.25214521633426,lat:23.17357861193835,height:4.727},
                      {lng:112.25202271771276,lat:23.17352000034511,height:4.77},
                      {lng:112.2519117121814,lat:23.173464511289268,height:5.502},
                      {lng:112.25178717375717,lat:23.173397591779654,height:5.084},
                      {lng:112.2516779971058,lat:23.173341338675847,height:5.15},
                      {lng:112.25210438127453,lat:23.17364176347438,height:0.501},
                      {lng:112.2519840872913,lat:23.173582917645994,height:0.509},
                      {lng:112.25187210258449,lat:23.17352504389327,height:0.582},
                      {lng:112.25174519474416,lat:23.173460598844084,height:1.209},
                      {lng:112.25163973933368,lat:23.173402338969847,height:0.699},
                    ],
                    heights:[[15.188,15.195,15.210,15.215],
                    [14.893,14.899,14.908,14.929],
                    [15.371,15.394,15.4,15.409],
                    [15.286,15.288,15.298,15.319],
                    [15.420,15.433,15.435,15.44],
                    [9.955,9.965,9.976,9.991],
                    [11.276,11.286,11.301,11.307],
                    [9.707,9.730 ,9.742,9.777],
                    [10.111,10.125,10.130 ,10.145],
                    [10.554,10.558,10.579,10.582],
                    [4.691,4.705,4.709,4.717],
                    [4.732,4.741,4.749,4.760],
                    [5.417,5.426,5.454,5.502],
                    [5.044,5.057,5.061,5.084],
                    [5.111,5.124,5.129,5.150 ],
                    [0.465,0.488,0.488,0.501],
                    [0.469,0.471,0.496,0.503],
                    [0.508,0.523,0.578,0.582],
                    [1.172,1.183,1.197,1.209],
                    [0.660 ,0.664,0.675,0.699]
                    ],
                    description : "2024-7-15 0.1 \n2024-7-16 0.15 \n2024-7-17 0.2 \n2024-7-18 0.2 \n2024-7-19 0.3",
                    assessment: "存在沉降",
                    status: "未处理"
                  }
                },
                {
                  alert_id: 2,
                  alert_name: "土坡裂缝",
                  timestamp: "2024-7-6",
                  slope_id: 5,
                  alert_level: "高",
                  alert_prediction: "70%",
                  location: {lng:112.25249015358472, lat:23.17443965113885, height:-1},
                  description: "土坡出现裂缝",
                  status: "未处理",
                  disease:{
                    detection_id: 2,
                    flight_id: 7,
                    slope_id: 5,
                    discovery_date: "2024-7-1",
                    image_url: ["./images/2.jpg", "./images/Point1_Ground.jpg","./images/Point1_LiDAR.jpg"],
                    disease_type: "crack",
                    severity: "low",
                    area: [
                    [112.25251741840268,23.174423772692446,-0.7],
                    [112.25250635414872,23.17446987711204,-1.1],
                    [112.25246205769726,23.174453843416284,-0.7],
                    [112.25247478409098,23.17441111132803,-1.1]
                    ],
                    marks: [{lng:112.25249015358472, lat:23.17443965113885, height:0}],
                    description : "裂缝长度(m) 3 \n裂缝宽度(m) 3 \n裂缝深度(m) 0.5",
                    assessment: "存在裂缝",
                    status: "处理中"
                  }
                },
                {
                  alert_id: 3,
                  alert_name: "路面裂缝点1",
                  timestamp: "2024-7-6",
                  slope_id: 5,
                  alert_level: "高",
                  alert_prediction: "70%",
                  location: {lng:112.25208049296941, lat:23.173153817861568, height:15},
                  description: "路面出现裂缝",
                  status: "已处理",
                  disease:{
                    detection_id: 3,
                    flight_id: 7,
                    slope_id: 5,
                    discovery_date: "2024-7-1",
                    image_url: ["./images/3.jpg","./images/Point3_Ground.jpg","./images/Point3_LiDAR.jpg"],
                    disease_type: "crack",
                    severity: "low",
                    area: [[112.25217306675259,23.17323130373522,15.5],
                    [112.25220050948909,23.173189700514445,15.5],
                    [112.2519869420373,23.17307834845912,15.5],
                    [112.25196145376525,23.173115918583317,15.5]],
                    marks: [{lng:112.25208049296941, lat:23.173153817861568, height:16}],
                    description : "裂缝长度(m) 25.67 \n裂缝宽度(m) 0.08 \n裂缝深度(m) 0.12",
                    assessment: "存在裂缝",
                    status: "已处理"
                  }
                },
                {
                  alert_id: 4,
                  alert_name: "路面裂缝点2",
                  timestamp: "2024-7-6",
                  slope_id: 5,
                  alert_level: "高",
                  alert_prediction: "70%",
                  location: {lng:112.25277438757017, lat:23.173547565597758, height:15},
                  description: "路面出现裂缝",
                  status: "已处理",
                  disease:{
                    detection_id: 4,
                    flight_id: 7,
                    slope_id: 5,
                    discovery_date: "2024-7-1",
                    image_url: ["./images/4.jpg","./images/Point2_Ground.jpg","./images/Point2_LiDAR.jpg"],
                    disease_type: "crack",
                    severity: "low",
                    area: [[112.25284319796897,23.173614164854524,15.5],
                    [112.25286662447797,23.173572268467673,15.5],
                    [112.25270473047125,23.17348493639572,15.5],
                    [112.25268299746295,23.173518892583996,15.5]],
                    marks: [{lng:112.25277438757017, lat:23.173547565597758, height:16}],
                    description : "裂缝长度(m) 13.82 \n裂缝宽度(m) 0.08 \n裂缝深度(m) 0.16",
                    assessment: "存在裂缝",
                    status: "已处理"
                  }
                }
              ]
            },
            {
              slope_id: 6,
              slope_name: "K532",
              location: {lng: 112.26202071744656, lat: 23.1750103541934},
              milepost: "K532",
              slope_type: "填方边坡",
              slope_hight: 60,
              slope_length: 200,
              description: "位置：112.262°E 23.175°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: []
            }
          ]
        },
        {
          section_id: 2,
          section_name: "汕湛高速路段",
          location: "广东",
          slopes: [
            {
              slope_id: 8,
              slope_name: "K123",
              location: {lng: 111.10823, lat: 21.82166},
              milepost: "K123",
              slope_type: "填方边坡",
              slope_hight: 10,
              slope_length: 300,
              description: "位置：111.108°E 21.821°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: [
                {
                  alert_id: 1,
                  alert_name: "边坡预警1",
                  timestamp: "2024-7-6",
                  slope_id: 1,
                  alert_level: "高",
                  alert_prediction: "70%",
                  description: "路面出现裂缝",
                  status: "未处理",
                  disease:{
                    detection_id: 1,
                    flight_id: 7,
                    slope_id: 1,
                    discovery_date: "2024-7-1",
                    image_url: ["./images/5.jpg"],
                    disease_type: "裂缝",
                    severity: "low",
                    location: {lng: 111.098330878, lat: 21.819097437, height: 145},
                    description : "倾角最小值(°) 0.1 \n倾角最大值(°) 0.5 \n最大变化率(°/d) 1.34 \n累计裂缝最小值(mm) 86 \n累计裂缝最大值(mm) 147",
                    assessment: "存在裂缝",
                    status: "处理中"
                  }
                },
                {
                  alert_id: 2,
                  alert_name: "边坡预警2",
                  timestamp: "2024-7-6",
                  slope_id: 1,
                  alert_level: "高",
                  alert_prediction: "70%",
                  description: "边坡出现沉降",
                  status: "未处理",
                  disease:{
                    detection_id: 2,
                    flight_id: 7,
                    slope_id: 1,
                    discovery_date: "2024-7-1",
                    image_url: ["./images/5.jpg"],
                    disease_type: "沉降",
                    severity: "low",
                    location: {lng: 111.098430878, lat: 21.820157437, height: 135},
                    description : "倾角最小值(°) 0.1 \n倾角最大值(°) 0.5 \n最大变化率(°/d) 1.34 \n累计沉降最小值(mm) 86 \n累计沉降最大值(mm) 147",
                    assessment: "存在沉降",
                    status: "未处理"
                  }
                }
              ]
            }
          ]
        },
/*
        {
          section_id: 3,
          section_name: "广州市区路段",
          location: "广州",
          slopes: [
            {
              slope_id: 8,
              slope_name: "白沙河大桥",
              location: {lng: 113.22199, lat: 23.15377},
              milepost: "NONE",
              slope_type: "桥梁",
              slope_hight: 10,
              slope_length: 300,
              description: "位置：113.221°E 23.153°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: []
            },
            {
              slope_id: 9,
              slope_name: "广州大桥",
              location: {lng: 113.32227, lat: 23.11345},
              milepost: "NONE",
              slope_type: "桥梁",
              slope_hight: 10,
              slope_length: 300,
              description: "位置：113.322°E 23.113°N",
              construction_date: "2015-2-19",
              status: "normal",
              alerts: []
            }
          ]
        }
        */
      ],
      msg: "一切ok",
    },
  },
]);

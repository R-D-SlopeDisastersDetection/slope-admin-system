import { defineMock } from "./base";

export default defineMock([
  {
    url: "menus/routes",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        {
          path: "/slope",
          component: "Layout",
          redirect: "www.bimgle.com",
          name: "/slope",
          meta: {
            title: "边坡监测",
            icon: "document",
            hidden: false,
            alwaysShow: false,
            params: null,
          },
          children: [
            {
              path: "model",
              component: "demo/model",
              name: "Model",
              meta: {
                title: "实景模型",
                icon: "link",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
          ],
        },
      ],
      msg: "一切ok",
    },
  },
]);

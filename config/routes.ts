export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/user',
            component: '../layouts/UserLayout',
            routes: [
              {
                name: 'login',
                path: '/user/login',
                component: './User/Login',
              },
              {
                component: "./404"
              }
            ],
          },
          {
            path: '/manage',
            component: '../layouts/AddUpdateLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/manage/update-employee',
                name: 'update.employee',
                icon: 'team',
                component: './Employee/EmployeeForm',
              },
              {
                path: '/manage/add-employee',
                name: 'add.employee',
                icon: 'team',
                component: './Employee/EmployeeForm',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/employee',
              },
              {
                path: '/employee',
                name: 'employee',
                icon: 'team',
                component: './Employee',
              },
              {
                path: '/leave',
                name: 'leave',
                icon: 'export',
                component: './Leave',
              },
              {
                path: '/onboarding',
                name: 'onboarding',
                icon: 'file-protect',
                component: './Onboarding',
              },
              {
                path: '/appraisal',
                name: 'appraisal',
                icon: 'rise',
                component: './Appraisal',
              },
              {
                path: '/divisions',
                name: 'divisions',
                icon: 'switcher',
                component: './Division',
                routes: [
                  {
                    path: '/divisions/deployment',
                    name: 'deployment',
                    icon: 'file',
                    component: './Division/Deployment',
                  },
                  {
                    path: '/divisions/properties',
                    name: 'properties',
                    icon: 'file',
                    component: './Division/Properties',
                  },
                ],
              },
              {
                path: '/employment',
                name: 'employment',
                icon: 'solution',
                component: './Employment',
              },
              {
                path: '/overview',
                name: 'overview',
                icon: 'reconciliation',
                component: './Overview',
              },
              {
                path: '/calendar',
                name: 'calendar',
                icon: 'calendar',
                component: './Calendar',
              },
              {
                path: '/miscellaneous',
                name: 'miscellaneous',
                icon: 'setting',
                component: './Miscellaneous',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];

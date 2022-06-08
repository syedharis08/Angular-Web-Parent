---
title: Project Structure
---


The directory structure is as follows:

```
Angular4-BaseProject/
   ├──config/                    * webpack build configuration
   │   ├──head-config.common.js  * configuration for head elements in index.html
   │   │
   │   ├──helpers.js             * helper functions for our configuration files
   │   │
   │   ├──webpack.dev.js         * development webpack config
   │   │
   │   ├──webpack.prod.js        * production webpack config
   │   │
   │   ├──webpack.test.js        * testing webpack config
   │   │
   │   ├──electron/              * electron webpack config
   │   │
   │   └──html-elements-plugin/  * html elements plugin
   │
   ├──src/                       * source files that will be compiled to javascript
   │   ├──custom-typings.d.ts    * custom typings for third-party modules
   │   │
   │   ├──desktop.ts             * electron window initialization
   │   │
   │   ├──index.html             * application layout
   │   │
   │   ├──main.browser.ts        * entry file for our browser environment
   │   │
   │   ├──package.json           * electrons package.json
   │   │
   │   ├──polyfills.browser.ts   * polyfills file
   │   │
   │   ├──vendor.browser.ts      * vendors file
   │   │
   │   ├──app/                   * application code - our working directory
   │   │   │
   |   |   ├──auth               * application module instance
   |   |   |    |
   |   |   |    |──components/      * auth components
   |   |   |    |
   |   |   |    ├──model/           * auth model 
   |   |   |    |
   |   |   |    |──service/         * auth services
   |   |   |    |
   |   |   |    ├──state/           * auth state management with ngrx
   |   |   |    |   |
   |   |   |    |   |──auth.actions.ts    * auth  actions
   |   |   |    |   |
   |   |   |    |   ├──auth.effects.ts    * auth  effects
   |   |   |    |   |
   |   |   |    |   ├──auth.reducers.ts   * auth  reducers
   |   |   |    |   └──
   |   |   |    |──auth.module.ts     * auth  module
   |   |   |    └──
   |   |   |    
   |   |   |    
   |   |   |
   │   │   ├──app.component.ts   * main application component
   │   │   │
   │   │   ├──app.menu.ts        * menu pages routes     
   │   │   │ 
   │   │   ├──app.module.ts      * main application module
   |   |   |
   |   |   ├──app.store.ts       * defines states used and effects   
   │   │   │
   │   │   ├──app.routing.ts     * application routes
   │   │   │  
   │   │   ├──global.state.ts    * global application state for data exchange between components
   │   │   │
   │   │   ├──environment.ts     * environment provider
   │   │   │
   │   │   ├──app.scss           * application styles 
   |   |   |
   │   │   ├──pages/             * application pages components, place where you can create pages and fill them with components
   │   │   │
   │   │   ├──publicPages/       *  application publicPages
   │   │   │    |
   |   |   |    |──components/                  * publicPages components
   |   |   |    |
   |   |   |    |──publicPages.component.ts     * publicPages  main component
   │   │   |    |
   │   │   │    |──publicPages.module.ts        * publicPages  module
   │   │   |    |
   │   │   │    |──publicPages.routing.ts       * publicPages  routes
   │   │   |    └──
   |   |   |
   |   |   |   
   │   │   │
   │   │   │
   │   │   ├──services/          *  application services
   │   │   │
   │   │   ├──state/             * application actions,effects,reducers 
   │   │   │
   │   │   └──theme/             * template global components/directives/pipes and styles
   │   │
   │   └──assets/                * static assets are served here
   │
   │
   ├──tslint.json                * typescript lint config
   ├──typedoc.json               * typescript documentation generator
   ├──tsconfig.json              * config that webpack uses for typescript
   └──package.json               * what npm uses to manage it's dependencies
```

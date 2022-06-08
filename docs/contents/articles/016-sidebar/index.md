---
title: Sidebar
---

The sidebar provides a convenient way to navigate the application. 
Only one sidebar is supported per angular application. 
This means that the sidebar is basically a singleton object.
 
The Sidebar can be added to the page using the `BaSidebar` component:
```html
<ba-sidebar></ba-sidebar>
```

The sidebar contains a `<ba-menu></ba-menu>` component which defines and renders the application menu based on routes provided. Generally the `ba-menu` component can be used separately from `ba-sidebar`.
All menu items information is defined inside the `data` property of a route.

## Menu Configuration

All menu items are located inside the `src/app/app.routes.ts` file. Each route item can have a `menu` property under `data` defining a menu item:

```javascript
  {
    // first, router configuration
    path: 'dashboard',
    component: Dashboard,
    data: {
      // here additionaly we define how the menu item should look
      menu: {
        title: 'dashboard', // menu title
        icon: 'ion-android-home', // menu icon
        selected: false, // selected or not
        expanded: false, // expanded or not (if item has children)
        order: 0, // item order in the menu list,
        hidden: true // hide menu item from a list but keep related features (breadcrumbs, page title)
      }
    }
  }
```

You also can define a list of sub-menu items like this:
```javascript
  {     
        //parent route
        path: 'customer',
        data: {
          //parent menu configuration
          menu: {
            title: 'general.menu.Customers',
            icon: 'ion-person',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
           //children routes
           children: [  
           {
            path: 'allcustomers',
            data: {
              //children menu item configuration
              menu: {
                title: 'general.menu.allcustomers',
              }
            }
          },
        ]

       }
    
  
```
Set the  sidebar content  in `src/assets/i18n/US/en.json` like this:
```
  {
   "general": {
  
"menu": {
      "dashboard": "Dashboard",
      "Customers": "Customers",
      "allcustomers": "All Customers",
      "driver" : "Drivers"
}
}
}
```


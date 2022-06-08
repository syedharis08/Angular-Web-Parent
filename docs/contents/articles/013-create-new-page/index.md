---
title: Create New Page
---

We strongly recommend to follow this page structure in your application.

Basically any page is just a common Angular 4 Component with a route defined for it.

## For public page ( like login, register )
1. Create a new directory for new page inside of `src/app/publicPages/components` . Name the directory relevant to the page(for eg new)



#Components

Components are the most basic building block of an UI in an Angular application. An Angular application is a tree of Angular components.

2. Then let's create a blank angular 4 component for our page called 'new.component.ts' inside of `src/app/publicPages/components/new`:

```javascript
import { Component } from '@angular/core';
// apply styling to your component
import 'style-loader!./new-component.scss';

//Component decorator marks a class as an Angular component.
@Component({
// css selector that identifies this component in a template.
  selector: 'new',
//  inline-defined template for the view.
  template: `<strong>My page content here</strong>`
})
// define  your component class.
export class NewComponent {
  constructor() {}
}
```
<br><br>

3. After that we should create our component routing called `new.routing.ts` in the `new` directory.

```javascript
import { Routes, RouterModule }  from '@angular/router';
import { NewComponent } from './new.component';

const routes: Routes = [
  {
    path: '',
    component: NewComponent
  }
];

export const routing = RouterModule.forChild(routes);
```
<br>

4. And now we should create `new.module.ts` in `src/app/publicPagespages/new` directory and import `new.component.ts` and `new.routing.ts` in it as A component must belong to an NgModule in order for it to be usable by another component or application.

```javascript
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NewComponent } from './new.component';
import { routing } from './new.routing';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    NewComponent
  ]
})
export class NewModule {}
```
<br>

5. The penultimate thing we need to do is to declare a route in `src/app/publicPages/publicPages.routes.ts` And  let's import our component


```javascript
export const AuthRoutes: Routes = [
{


     path: 'new',
     component:NewComponent,
     canActivate: [AuthGuard]
  },
]
```

<br><br>

6. And in the end let's import our component in `src/app/publicPages/publicPages.module.ts` like this:

```javascript
declarations: [
    NewComponent
    Login,
    LogoutComponent,
    RecoverComponent,
    Register,
    ResetComponent,
  ],
```
<br>

And that's it! Now your page is available by the following this url [http://localhost:3000/#/new](http://localhost:3000/#/new).



## Let's create a blank page for private pages(eg. dashboard)

1) Create a new directory for our new page inside of `src/app/pages`. We can call the directory `new`.
<br><br>

2) Then let's create a blank angular 4 component for our page called 'new.component.ts' inside of `src/app/pages/new`:

```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'new',
  template: `<strong>My page content here</strong>`
})
export class NewComponent {
  constructor() {}
}
```
This will create a simple Angular 4 component.
<br><br>

3) After that we should create our component routing called `new.routing.ts` in the `new` directory.

```javascript
import { Routes, RouterModule }  from '@angular/router';
import { NewComponent } from './new.component';

const routes: Routes = [
  {
    path: '',
    component: NewComponent
  }
];

export const routing = RouterModule.forChild(routes);
```
<br>

4) And now we should create `new.module.ts` in `src/app/pages/new` directory and import `new.component.ts` and `new.routing.ts` in it.

```javascript
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NewComponent }  from './new.component';
import { routing }       from './new.routing';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    NewComponent
  ]
})
export class NewModule {}
```
<br>

5) The penultimate thing we need to do is to declare a route in `src/app/pages/pages.menu.ts`.
Typically all pages are children of the `/pages` route and defined under the `children` property of the root `pages` route like this:

```javascript
export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'new',  // path for our page
        data: { // custom menu declaration
          menu: {
            title: 'New Page', // menu title
            icon: 'ion-android-home', // menu icon
            pathMatch: 'prefix', // use it if item children not displayed in menu
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'dashboard',//path for dashboard page
        data: {
          menu: {
            title: 'Dashboard', // menu title
            icon: 'ion-android-home', // menu icon
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
    }
  }
]
```
If you’d like to highlight menu item when current URL path partially match the menu item
path - use pathMatch: ‘prefix’. In this case if the menu item has no children in the menu and
you navigated to some child route - the item will be highlighted.
<br><br>



7) And in the end let's import our component in `src/app/pages/pages.routing.ts` like this:

```javascript
const routes: Routes = [
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'new',  loadChildren: 'app/pages/new/new.module#NewModule' }
    ]
  }
];
```
<br>

And that's it! Now your page is available by the following this url [http://localhost:3000/#/pages/new](http://localhost:3000/#/pages/new).
Plus, your page is registered inside the sidebar menu. If you don't want to have a link
in the menu - just remove the `menu` declaration from the `pages.menu.ts` file.

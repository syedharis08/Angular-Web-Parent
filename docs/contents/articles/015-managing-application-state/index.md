---
title: Managing Application State
---
The components we build for our web applications often contain state. Connecting components can lead to sharing mutable state: this is difficult to manage and leads to inconsistency. As our apps grow, having multiple components managing  different parts of the state becomes cumbersome.

Therefore a data-architecture pattern called Redux is used which will store all of our state in a single place.All of the  application’s data is in a single data structure called the state which is held in the store.Our app reads the state from this store.ngrx/store is an implementation of Redux for Angular, using RxJS, that brings this powerful pattern into the Angular world.

We strongly recommend to follow ngrx structure in your application.

# Kindly note that components alter the application state through a stream of actions,do not mutate state directly.

Before using store in your application,define states and effects being used in `src/app/app.store.ts`like this:

  @NgModule({
  imports: [
    StoreModule.provideStore({
      app
    }),

   EffectsModule.run(AppEffects),
   ],

})


 Service Creation

a. Create a service for the following api in 'src/app/services' for private pages

b. Create a service for the following api in 'src/app/auth/services' for public pages


1. Define  action in `src/app/state/app.action.ts`

#Actions
Actions are payloads of information that send data from your application to your store. They are the only source of information for the store.

 ```javascript
 import { Action } from '@ngrx/store'

 export const actionTypes = {

  APP_GETTALL_USER_BY_ID:   'APP_GETTALL_USER_BY_ID'

 }

export class AppGetAllUserById implements Action {
  type = actionTypes.APP_GETTALL_USER_BY_ID
  constructor(public payload: credentials) {}
}
```


2. Define effect  in `src/app/state/app.effects.ts`

#Effects
Effects return Action Observables.



```javascript
     @Effect({ dispatch: false })
     getAllUserById = this.actions$
    .ofType('APP_GETTALL_USER_BY_ID')

    .do((action) => {
      //calling customer service where api gets hit
         this.customer_service.getAllUserById(action.payload.id)
          .subscribe((result) => {

               if(result.message === 'Success')
               {
                  // if success, then navigate to another page
                         this.router.navigate(['pages/'+action.payload.userType+'/byIdDetails']);

               }

                  }
                , (error) => {
                    //console.log(error)
                }
              );

    })


```
3. Define reducers  in 'src/app/state/app.reducers.ts'

#Reducer
A reducer is  a pure function which takes the old state and an action and returns a new state.

```javascript
   case 'APP_GETTALL_USER_BY_ID':
      return Object.assign({}, state)
```

## Modify your Application State by Dispatching Actions

1. Aquire the store in the component andß send the payload which is needed for api along with the state call in `src/pages/Bookings/booking.component.ts`.
Inside  the component

a) Action is dispatched using dispatch() function of store .Action has two fields:type and payload.The type will be an identifying string that describes the action like APP_GETALL_USERS_BY_ID.The payload can be an object of any kind.

b) Component subscribes to the state changes.

```javascript

// Now in the component, in store respone of api is available which can be used in views.
constructor(private store: Store<any>){
   			 this.store
		      .select('app')
		      .subscribe((res: any) => {
                  this.typeOfUser = res.userType

            if(res.userDetail){

                  this.customerData = res.userDetail.data.user;

            }


		      })

   }
// function called on detail button click
 showCustomerDetail(id){
    let payload={
          userType:this.userType,
          id:id
    }
    // action dispatch
    this.store.dispatch({ type: app.actionTypes.APP_GETTALL_USER_BY_ID, payload: payload })
  }



 ```








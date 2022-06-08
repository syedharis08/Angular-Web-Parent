import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


@Injectable()
export class PagesMenuService {
    PAGES_MENU = [];
    
    constructor(private store: Store<any>) {

    }

    pageMenu() {
        return this.PAGES_MENU = [
            {
                path: 'pages',
                children: [
                    {
                        path: 'home',
                        data: {
                            menu: {
                                title: 'HOME',
                                icon: 'icon-wrap fa fa-home',
                                selected: false,
                                expanded: false,
                                order: 0,
                                auth: ['USER']
                            }
                        }
                    },
                    {
                        path: 'users',
                        data: {
                            menu: {
                                title: 'USERS',
                                icon: 'icon-wrap fa fa-user-o',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['admin']
                            }
                        },
                        children: [
                            {
                                path: 'employers',
                                data: {
                                    menu: {
                                        title: 'EMPLOYERS',
                                    }
                                }
                            },
                            {
                                path: 'workers',
                                data: {
                                    menu: {
                                        title: 'WORKERS',
                                    }
                                }
                            },
                        ]
                    },
                    {
                        path: 'subscriptions',
                        data: {
                            menu: {
                                title: 'SUBSCRIPTIONS',
                                icon: 'icon-wrap fa fa-newspaper-o',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['admin']
                            }
                        },
                    },
                    {
                        path: 'jobs',
                        data: {
                            menu: {
                                title: 'JOBS',
                                icon: 'icon-wrap fa fa-tasks',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['USER']
                            }
                        },
                    },
                    {
                        path: 'labors',
                        data: {
                            menu: {
                                title: 'LABORS',
                                icon: 'icon-wrap fa fa-tasks',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['USER']
                            }
                        },
                    },
                    {
                        path: 'posts',
                        data: {
                            menu: {
                                title: 'MY POSTS',
                                icon: 'icon-wrap fa fa-tasks',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['USER']
                            }
                        },
                    },
                    {
                        path: 'requests',
                        data: {
                            menu: {
                                title: 'MY REQUESTS',
                                icon: 'icon-wrap fa fa-tasks',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['USER']
                            }
                        },
                    },
                    {
                        path: 'payments',
                        data: {
                            menu: {
                                title: 'PAYMENTS',
                                icon: 'icon-wrap fa fa-money',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['USER']
                            }
                        },
                    },
                    {
                        path: 'feedbacks',
                        data: {
                            menu: {
                                title: 'MY RATINGS',
                                icon: 'icon-wrap fa fa-comments-o',
                                selected: false,
                                expanded: false,
                                order: 100,
                            }
                        }
                    },
                    {
                        path: 'donations',
                        data: {
                            menu: {
                                title: 'DONATIONS',
                                icon: 'icon-wrap fa fa-tasks',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['USER']
                            }
                        },
                    },
                    {
                        path: 'helpcenter',
                        data: {
                            menu: {
                                title: 'CONTACT US',
                                icon: 'icon-wrap fa fa-question',
                                selected: false,
                                expanded: false,
                                order: 100,
                            }
                        }
                    },
                    {
                        path: 'appversion',
                        data: {
                            menu: {
                                title: 'SUPPORT',
                                icon: 'icon-wrap fa fa-code-fork',
                                selected: false,
                                expanded: false,
                                order: 100,
                            }
                        }
                    },
                    {
                        path: 'settings',
                        data: {
                            menu: {
                                title: 'PROFILE',
                                icon: 'icon-wrap fa fa-gear fa-spin',
                                selected: false,
                                expanded: false,
                                order: 100,
                                auth: ['admin']
                            }
                        },
                    },
                    {
                        path: 'profile',
                        data: {
                            menu: {
                                title: 'profile',
                                icon: 'icon-wrap fa fa-newspaper-o',
                                selected: false,
                                expanded: false,
                                order: 100,
                                // auth: ['admin']
                            }
                        },
                    },
                ]
            }
        ];
    }
}





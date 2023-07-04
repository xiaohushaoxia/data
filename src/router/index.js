/**
 * @author https://gitee.com/chu1204505056/vue-admin-better （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@/views/401'),
        hidden: true,
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404'),
        hidden: true,
    },
]

export const asyncRoutes = [
    // {
    //     path: '/',
    //     component: Layout,
    //     redirect: '/index',
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'Index',
    //             component: () => import('@/views/group/index.vue'),
    //             meta: {
    //                 title: '分组管理',
    //                 affix: false,
    //                 // icon: 'home',
    //                 permissions: ['1']
    //             },
    //         }
    //     ],
    // },
    // {
    //     path: '/domain',
    //     component: Layout,
    //     redirect: '/domain',
    //     children: [
    //         {
    //             path: 'domain',
    //             name: 'domain',
    //             component: () => import('@/views/domain/index.vue'),
    //             meta: {
    //                 title: '目标域名',
    //                 affix: false,
    //                 // icon: 'home',
    //                 permissions: ['1']
    //             },
    //         }
    //     ],
    // },
    // {
    //     path: '/message',
    //     component: Layout,
    //     redirect: 'noRedirect',
    //     name: 'instagram',
    //     meta: { title: '广告管理', permissions: ['1'] },
    //     children: [
    //         {
    //             path: 'task_message',
    //             name: 'task_message',
    //             component: () => import('@/views/message/task_message/index.vue'),
    //             meta: {
    //                 title: '话术管理',
    //                 // affix: false,
    //                 // icon: 'home',
    //                 // permissions: ['1', '3']
    //             },
    //         },
    //         {
    //             path: 'receive_fans',
    //             name: 'receive_fans',
    //             component: () => import('@/views/message/receive_fans/index.vue'),
    //             meta: { title: '接粉号' },
    //         },
    //     ],
    // },
    //Q
   
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        meta: { title: 'Q数据', permissions: ['1','2'] },
        children: [
           {
                path: 'index',
                name: 'index',
                component: () => import('@/views/domain/index.vue'),
                meta: {
                    title: '目标域名',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['2']
                },
                
            }, 
            {
                path: 'qdata/group',
                name: 'qdata/group',
                component: () => import('@/views/group/index.vue'),
                meta: {
                    title: '分组',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['2']
                },
                
            },
            {
                path: 'qdatas',
                name: 'qdatas',
                component: () => import('@/views/qdata/index.vue'),
                query: { id: 1 },
                meta: {
                    title: '数据',
                    query: { id: 1 }
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['1']
                },
                
            }
            
        ],
    },
    //B
    {
        path: '/bdata',
        component: Layout,
        redirect: '/bdata',
        meta: { title: 'B数据', permissions: ['1','2'] },
        children: [
           {
                path: 'bdata/domain',
                name: 'bdata/domain',
                component: () => import('@/views/domain/index.vue'),
                meta: {
                    title: '目标域名',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['2']
                },
                
            }, 
            {
                path: 'bdata/group',
                name: 'bdata/group',
                component: () => import('@/views/group/index.vue'),
                meta: {
                    title: '分组',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['2']
                },
                
            },
            {
                path: 'bdata',
                name: 'bdata',
                component: () => import('@/views/bdata/index.vue'),
                meta: {
                    title: '数据',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['1']
                },
                
            }
            
        ],
    },
    //s
    {
        path: '/sdata',
        component: Layout,
        redirect: '/sdata',
        meta: { title: 'S数据', permissions: ['1','2'] },
        children: [
           {
                path: 'sdata/domain',
                name: 'sdata/domain',
                component: () => import('@/views/domain/index.vue'),
                meta: {
                    title: '目标域名',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['2']
                },
                
            }, 
            {
                path: 'sdata/group',
                name: 'sdata/group',
                component: () => import('@/views/group/index.vue'),
                meta: {
                    title: '分组',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['2']
                },
                
            },
            {
                path: 'sdata',
                name: 'sdata',
                component: () => import('@/views/sdata/index.vue'),
                meta: {
                    title: '数据',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['1']
                },
                
            }
            
        ],
    },
   //6
   {
    path: '/sixdata',
    component: Layout,
    redirect: '/sixdata',
    meta: { title: '6数据', permissions: ['1','2'] },
    children: [
       {
            path: 'sixdata/domain',
            name: 'sixdata/domain',
            component: () => import('@/views/domain/index.vue'),
            meta: {
                title: '目标域名',
                // affix: false,
                // icon: 'home',
                // permissions: ['2']
            },
            
        }, 
        {
            path: 'sixdata/group',
            name: 'sixdata/group',
            component: () => import('@/views/group/index.vue'),
            meta: {
                title: '分组',
                // affix: false,
                // icon: 'home',
                // permissions: ['2']
            },
            
        },
        {
            path: 'sixdata',
            name: 'sixdata',
            component: () => import('@/views/sixdata/index.vue'),
            meta: {
                title: '数据',
                // affix: false,
                // icon: 'home',
                // permissions: ['1']
            },
            
        }
        
    ],
},  
 //c
 {
    path: '/cdata',
    component: Layout,
    redirect: '/cdata',
    meta: { title: 'C数据', permissions: ['1','2'] },
    children: [
       {
            path: 'sdata/domain',
            name: 'sdata/domain',
            component: () => import('@/views/domain/index.vue'),
            meta: {
                title: '目标域名',
                // affix: false,
                // icon: 'home',
                // permissions: ['2']
            },
            
        }, 
        {
            path: 'bdata/group',
            name: 'bdata/group',
            component: () => import('@/views/group/index.vue'),
            meta: {
                title: '分组',
                // affix: false,
                // icon: 'home',
                // permissions: ['2']
            },
            
        },
        {
            path: 'cdata',
            name: 'cdata',
            component: () => import('@/views/cdata/index.vue'),
            meta: {
                title: '数据',
                // affix: false,
                // icon: 'home',
                // permissions: ['1']
            },
            
        }
        
    ],
},
 //c
 {
    path: '/filterate',
    component: Layout,
    redirect: '/filterate',
    meta: { title: '数据过滤', permissions: ['1','2'] },
    children: [
       {
            path: 'filterate',
            name: 'filterate',
            component: () => import('@/views/filterate/index.vue'),
            meta: {
                title: '数据过滤',
                // affix: false,
                // icon: 'home',
                // permissions: ['2']
            },
            
        }
        
    ],
},
    {
        path: '*',
        redirect: '/404',
        hidden: true,
    },
]



const router = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
        y: 0,
    }),
    routes: constantRoutes,
})

export function resetRouter() {
    this.$router.push({
        name: 'qdatas',
        params: {
          id: 1
    }
  })
  this.$router.push({
    name: '/qdatda/qdatas',
    params: {
      id: 1
}
}) 
 
    location.reload()
}

export default router

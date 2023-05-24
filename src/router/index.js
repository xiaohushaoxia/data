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
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: 'Index',
                component: () => import('@/views/group/index.vue'),
                meta: {
                    title: '分组管理',
                    affix: false,
                    // icon: 'home',
                    permissions: ['1']
                },
            }
        ],
    },
    {
        path: '/qdata',
        component: Layout,
        redirect: '/qdata',
        children: [
            {
                path: 'qdata',
                name: 'qdata',
                component: () => import('@/views/task/index.vue'),
                meta: {
                    title: '目标域名',
                    affix: false,
                    // icon: 'home',
                    permissions: ['1']
                },
            }
        ],
    },

    {
        path: '/bdata2',
        component: Layout,
        redirect: '/bdata2',
        children: [
            {
                path: 'bdata2',
                name: 'bdata2',
                component: () => import('@/views/mailbox/index.vue'),
                meta: {
                    title: 'Q数据',
                    affix: false,
                    // icon: 'home',
                    permissions: ['1']
                },
            }
        ],
    },
 //分组管理
    // {
    //     path: '/group',
    //     component: Layout,
    //     redirect: 'noRedirect',
    //     name: 'group',
    //     meta: { title: '分组管理', permissions: ['1'] },
    //     children: [
    //         {
    //             path: 'ins_account_group',
    //             name: 'ins_account',
    //        
    //             meta: { title: '协议号分组' },
    //         },
    //         {
    //             path: 'ins_blogger_ggroup',
    //             name: 'ins_blogger_ggroup',
    //             component: () => import('@/'),
    //             meta: { title: '博主分组' },
    //         },
  
    //     ],
    // },


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
    location.reload()
}

export default router

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
                component: () => import('@/views/instagram/account/index.vue'),
                meta: {
                    title: '帐号管理',
                    affix: false,
                    // icon: 'home',
                    permissions: ['1', '3']
                },
            }
        ],
    },
 //分组管理
    {
        path: '/group',
        component: Layout,
        redirect: 'noRedirect',
        name: 'group',
        meta: { title: '分组管理', permissions: ['1'] },
        children: [
            {
                path: 'ins_account_group',
                name: 'ins_account',
                component: () => import('@/views/group/ins_account/index.vue'),
                meta: { title: '协议号分组' },
            },
            {
                path: 'ins_blogger_ggroup',
                name: 'ins_blogger_ggroup',
                component: () => import('@/views/group/ins_blogger_group/index.vue'),
                meta: { title: '博主分组' },
            },
            {
                path: 'ins_fans_group',
                name: 'ins_fans_group',
                component: () => import('@/views/group/ins_fans_group/index.vue'),
                meta: { title: '粉丝分组' },
            },
            {
                path: 'ins_tank_group',
                name: 'ins_tank_group',
                component: () => import('@/views/group/ins_tank_group/index.vue'),
                meta: { title: '话术分组' },
            },
            // {
            //     path: 'index',
            //     name: 'index',
            //     component: () => import('@/views/group/index.vue'),
            //     meta: { title: '原有' },
            // },
        ],
    },
//采集任务
{
    path: '/caiji',
    component: Layout,
    redirect: '/caiji',
    children: [
        {
            path: 'caiji',
            name: 'caiji',
            component: () => import('@/views/task/index.vue'),
            meta: {
                title: '采集任务',
                affix: false,
                // icon: 'home',
                permissions: ['1', '3']
            },
        }
    ],
},
//粉丝管理
{
    path: '/users',
    component: Layout,
    redirect: '/users',
    children: [
        {
            path: 'users',
            name: 'users',
            component: () => import('@/views/instagram/users/index.vue'),
            meta: {
                title: '粉丝管理',
                affix: false,
                // icon: 'home',
                permissions: ['1', '3']
            },
        }
    ],
},

//拉群任务  
{
    path: '/pulls',
    component: Layout,
    redirect: '/pulls',
    children: [
        {
            path: 'pulls',
            name: 'pulls',
            component: () => import('@/views/instagram/users/index.vue'),
            meta: {
                title: '拉群任务',
                affix: false,
                // icon: 'home',
                permissions: ['1', '3']
            },
        }
    ],
},

//广告管理
{
    path: '/advs',
    component: Layout,
    redirect: '/advs',
    children: [
        {
            path: 'advs',
            name: 'advs',
            component: () => import('@/views/instagram/users/index.vue'),
            meta: {
                title: '广告管理',
                affix: false,
                // icon: 'home',
                permissions: ['1', '3']
            },
        }
    ],
},
//博主管理
{
    path: '/blogger',
    component: Layout,
    redirect: '/blogger',
    children: [
        {
            path: 'blogger',
            name: 'blogger',
            component: () => import('@/views/instagram/blogger/index.vue'),
            meta: {
                title: '博主管理',
                affix: false,
                // icon: 'home',
                permissions: ['1', '3']
            },
        }
    ],
},

//任务管理
    {
        path: '/message',
        component: Layout,
        redirect: 'noRedirect',
        name: 'instagram',
        meta: { title: '消息管理', permissions: ['1'] },
        children: [
            {
                path: 'task_message',
                name: 'task_message',
                component: () => import('@/views/message/task_message/index.vue'),
                meta: {
                    title: '话术管理',
                    // affix: false,
                    // icon: 'home',
                    // permissions: ['1', '3']
                },
            },
            {
                path: 'receive_fans',
                name: 'receive_fans',
                component: () => import('@/views/message/receive_fans/index.vue'),
                meta: { title: '接粉号' },
            },
        ],
    },
//通用管理
    {
        path: '/common_management',
        component: Layout,
        redirect: 'noRedirect',
        name: 'common_management',
        meta: { title: '通用管理', permissions: ['1'] },
        children: [
            // {
            //     path: 'task_message',
            //     name: 'task_message',
            //     component: () => import('@/views/task_message/index.vue'),
            //     meta: { title: '消息管理'},
            // },
            // {
            //     path: 'task',
            //     name: 'task',
            //     component: () => import('@/views/task/index.vue'),
            //     meta: { title: '任务管理'},
            // },
            {
                path: 'mailbox',
                name: 'mailbox',
                component: () => import('@/views/mailbox/index.vue'),
                meta: { title: '邮箱管理' },
            },
            {
                path: 'config',
                name: 'config',
                component: () => import('@/views/config/index.vue'),
                meta: { title: '通用配置' },
            },

        ],
    },
    // {
    //     path: '/instagram',
    //     component: Layout,
    //     redirect: 'noRedirect',
    //     name: 'instagram',
    //     meta: { title: 'INSTAGRAM', icon: 'asterisk', permissions: ['1'] },
    //     children: [
    //         {
    //             path: 'account',
    //             name: 'account',
    //             component: () => import('@/views/instagram/account/index.vue'),
    //             meta: { title: 'instagram协议号' },
    //         },
    //         {
    //             path: 'instagram_users',
    //             name: 'instagram_users',
    //             component: () => import('@/views/instagram/users/index.vue'),
    //             meta: { title: 'instagram粉丝' },
    //         },
    //         {
    //             path: 'instagram_blogger',
    //             name: 'instagram_blogger',
    //             component: () => import('@/views/instagram/blogger/index.vue'),
    //             meta: { title: 'instagram博主' },
    //         },




    //     ],
    // },
    // {
    //     path: '/telegram',
    //     component: Layout,
    //     redirect: 'noRedirect',
    //     name: 'telegram',
    //     meta: { title: 'TELEGRAM', icon: 'ghost', permissions: ['1'] },
    //     children: [
    //         {
    //             path: 'sessions',
    //             name: 'sessions',
    //             component: () => import('@/views/telegramSession/index.vue'),
    //             meta: { title: '协议号管理' },
    //         },
    //         {
    //             path: 'toUsers',
    //             name: 'toUsers',
    //             component: () => import('@/views/telegramToUsers/index.vue'),
    //             meta: { title: '私发名单' },
    //         },
    //         // {
    //         //     path: 'sms',
    //         //     name: 'sms',
    //         //     component: () => import('@/views/telegram_sms/index.vue'),
    //         //     meta: { title: '短信管理'},
    //         // },
    //         {
    //             path: 'telegram_client',
    //             name: 'telegram_client',
    //             component: () => import('@/views/telegram_client/index.vue'),
    //             meta: { title: '客户端管理' },
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

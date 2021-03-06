import Vue from 'vue'
import Router from 'vue-router'

import indexC from "../components/index.vue"
//管理员
import loginadmin from '@/components/admin/login'
import index from "@/components/admin/index"
import test from "@/components/admin/page/test"
import teacherList from "@/components/admin/page/teacher/teacher"
import addTeacher from "@/components/admin/page/teacher/add"
import studentList from "@/components/admin/page/student/student"
import addStudent from "@/components/admin/page/student/add"
import expList from "@/components/admin/page/exp/exp"
import addexp from "@/components/admin/page/exp/add"
//公告信息
import addInfo from '@/components/admin/page/info/info'
import infoList from '@/components/admin/page/info/infolist'
//教师
import loginteacher from '@/components/teacher/login'
import teacherindex from '@/components/teacher/index'
import preview from '@/components/preview/preview';
//学生
import loginstudent from '@/components/student/login'
import studentindex from '@/components/student/index'



Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: '',
      component: indexC,
      hidden: true
    }, {
      path: '/admin',
      name: '',
      component: loginadmin,
      hidden: true
    },
    {
      path: '/index',
      component: index,
      name: '实验管理',
      iconCls: 'el-icon-message', //图标样式class
      children: [{
          path: '/admin/exp',
          component: expList,
          name: '实验列表'
        },
        {
          path: '/admin/addexp',
          component: addexp,
          name: '新增实验'
        }
      ]
    },
    {
      path: '/index',
      component: index,
      name: '学生管理',
      iconCls: 'el-icon-printer',
      children: [{
          path: '/admin/student',
          component: studentList,
          name: '学生列表'
        },
        {
          path: '/admin/addstudent',
          component: addStudent,
          name: '添加学生'
        }
      ]
    },
    {
      path: '/index',
      component: index,
      name: '教师管理',
      iconCls: 'el-icon-news',
      children: [{
          path: '/admin/teacher',
          component: teacherList,
          name: '教师列表'
        },
        {
          path: '/admin/addteacher',
          component: addTeacher,
          name: '添加教师'
        }
      ]
    },
    {
      path: '/index',
      component: index,
      name: '公告管理',
      iconCls: 'el-icon-news',
      children: [{
          path: '/admin/infolist',
          component: infoList,
          name: '公告列表'
        },
        {
          path: '/admin/info',
          component: addInfo,
          name: '添加公告'
        }
      ]
    },
    {
      path: '/teacher',
      name: '',
      component: loginteacher,
      hidden: true
    },
    {
      path: '/teacher/index',
      name: '',
      component: teacherindex,
      hidden: true
    },
    {
      path: '/teacher/preview',
      name: '',
      component: preview,
      hidden: true
    },
    {
      path: '/student',
      name: '',
      component: loginstudent,
      hidden: true
    },
    {
      path: '/student/index',
      name: '',
      component: studentindex,
      hidden: true
    }
  ]
})

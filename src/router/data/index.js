import HelloWorld from '@/components/HelloWorld'

const routes = [
  {
    path: '/',
    component: HelloWorld,
    meta: {
      titl: 'Hello one'
    }
  },
  {
    path: '/HelloWorld',
    component: HelloWorld,
    meta: {
      title: 'Hello two'
    }
  }
]

export default routes

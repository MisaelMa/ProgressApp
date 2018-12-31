<template>
  <v-app>
      <Menu></Menu>
      <router-view/>
  </v-app>
</template>

<script>
import Menu from './components/menu/Menu'
export default {
  components:{
    Menu
  },
  name: 'App',
  data () {
    return {
      dogs:[]
    }
  },
  mounted() {
      
      this.$db.collection('dogs').orderBy('created_at').onSnapshot((snapShot) => {
            this.dogs=[];
            snapShot.forEach((dog)  => {
                this.dogs.push({
                    created_at:dog.data().created_at,
                    info:dog.data().info
                })
            });
        });
    
  },
  methods:{
    add:function(){
      
      this.$db.collection('task').add(
          {
              
              favicon:'https://picsum.photos/200/300/?random',
              nombre:'Tienda', 
              modulos:0,
              porcentaje:30,
              created_at: new Date().getTime()
          }
      ).then(response=>{
       
       console.log(response)
      })  
    },
  }
}
</script>

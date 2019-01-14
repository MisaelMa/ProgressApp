<template>
<section>
  <v-content>
    
    <v-container fluid  grid-list-md text-xs-center>
      {{task}}
      <v-progress-linear
      color="secondary"
      height="50"
      :value="task.porcentaje"
    ></v-progress-linear>
      <v-layout row wrap>
    
        <v-flex xs3>
          <v-card  color="primary">

            <v-toolbar dark color="deep-purple darken-4" height="48">
              <v-toolbar-title>Modulos</v-toolbar-title>
              <v-spacer></v-spacer>
                  <v-btn fab flat outline small @click="dialog=true">
                  <v-icon
                  flat
                  icon
                  dark>add</v-icon>
                  </v-btn>
              
            </v-toolbar>
            
            <v-card-text class="pa-0">
               <v-list two-line dense>
                <template v-for="(item, index) in modules">
                  <v-list-tile
                    :key="item.title"
                    avatar
                    ripple
                    @click="selectModule(item)"
                  >
                    <v-list-tile-content class="pt-2">
                      <v-list-tile-title  class="title">{{ item.nombre }}</v-list-tile-title>
                      <v-list-tile-sub-title class="text--primary">{{item.porcentaje}} = 100%</v-list-tile-sub-title>
                      <v-list-tile-sub-title style="height: 30px;">
                        {{item.finalizadoTask}}
                         <v-progress-linear value="0"></v-progress-linear>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action >
                     <v-progress-circular
                      :rotate="360"
                      :size="40"
                      :width="5"
                      :value="item.finalizado"
                      color="teal"
                    >
                      {{item.finalizado}}
                    </v-progress-circular>
                    </v-list-tile-action>

                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < modules.length"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs9>
          <v-card  >
            <v-toolbar color="primary" dark height="48">
              <v-toolbar-title>{{ modulo.nombre }} {{modulo.finalizado}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn v-if="modulo.id!=null" icon outline @click="edit = !edit">
                <v-icon  class='hover'>edit</v-icon>
              </v-btn>
              <v-btn v-if="modulo.id!=null"  icon outline style="border-style: dashed ;" @click="DelRoute(modulo)">
                <v-icon  class='hover'>delete</v-icon>
              </v-btn>
            </v-toolbar>
              

              <v-text-field
                v-model="childTask"
                label="¿En que estas trabajando?"
                solo
                @keydown.enter="createChildTask"
                class="ma-0 pa-0"
              >
                <v-fade-transition slot="append">
                  <v-icon
                    v-if="childTasks"
                    @click="createChildTask"
                  >
                    add_circle
                  </v-icon>
                </v-fade-transition>
              </v-text-field>
            
              <v-divider></v-divider>
              <v-layout
                my-1
                align-center
              > 
                 <strong class="mx-3 info--text text--darken-3 headline">
                Tasks : {{ childTasks.length }}
                </strong>
                
                <v-divider vertical></v-divider>

                <strong class="mx-3 info--text text--darken-3 headline">
                  Remaining: {{ remainingTasks }}
                </strong>

                <v-divider vertical></v-divider>

                <strong class="mx-3 black--text headline">
                  Completed: {{ completedTasks }}
                </strong>
                <v-divider vertical></v-divider>

                <v-spacer></v-spacer>

                <v-progress-circular
                  :value="progress"
                  class="mr-2"
                  size="100"
                  width="15"
                >{{progress.toFixed(1)}}</v-progress-circular>
              </v-layout>

              <v-divider class="mb-3"></v-divider>

              <v-card v-if="childTasks.length > 0">
                <v-slide-y-transition
                  class="py-0"
                  group
                  tag="v-list"
                >

                <v-data-table
                    :items="childTasks"
                    class="elevation-1"
                    hide-actions
                    hide-headers
                    key="id"
                  >
                    <template slot="items" slot-scope="props">
                      <td>
                        <v-icon @click="updatedChildTaskDone(props.item.id,props.item.done)" v-if="props.item.done" color="info darken-3">check_box</v-icon>
                        <v-icon @click="updatedChildTaskDone(props.item.id,props.item.done)" v-if="!props.item.done">check_box_outline_blank</v-icon>
                      </td>
                      <td class="text-xs-right">{{ props.item.text }}</td>
                      <td class="text-xs-right">
                        
                      <v-scroll-x-transition>
                        <v-icon
                          v-if="props.item.done"
                          color="success"
                        >
                          check
                        </v-icon>
                      </v-scroll-x-transition>

                      </td>
                    </template>
                  </v-data-table>
               
                </v-slide-y-transition>
                </v-card>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>

   <v-dialog v-model="dialog" width="800px">
      <v-card>

        <v-toolbar color="primary" dark>
          <v-toolbar-title>Añadir usuario nuevo</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                prepend-icon="business"
                v-model="modulo.nombre"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancelModule">Cancel</v-btn>
          <v-btn flat @click="addModulesTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

                       
</section>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      task:{},
      dialog:false,
      edit:false,
      loading: false,
      search: null,
      select: null,
      idTask:this.$route.params.id,
      modules:[],
      total:0,
      modulo:{
        id:null,
        nombre:null,
        porcentaje:0,
        finalizadoTask:0
      },
      childTasks: [{
        text:'amir',
        done:false
      }],
      childTask: null
    }
  },
 watch: {
    modulo: {
     handler(val){
       
        console.log('Fin->'+val.finalizadoTask)
      },
      deep: true
    }
  },
  computed: {
      completedTasks () {
        return this.childTasks.filter(childTask => childTask.done).length
      },
      progress () {
        return this.completedTasks / this.childTasks.length * 100
      },
      remainingTasks () {
        return this.childTasks.length - this.completedTasks
      }
  },
  mounted: function () {
    this.getTask(this.idTask)
    this.getModulesTask(this.idTask)
  },
  methods: {
    getTask:function(){
       this.$db
        .collection('tasks')
          .doc(this.idTask)
            .get()
              .then(res=>{
                  this.task = res.data();
              }).catch(err=>{

              })
            
    },
    getModulesTask:function(id){
      this.$db
        .collection('tasks')
          .doc(id)
            .collection('modules')
              .onSnapshot((snapShot) => {
                this.modules=[];
                  snapShot.forEach((modulo)  => {
                      this.modules.push({
                              id:modulo.id,
                              nombre:modulo.data().nombre,
                              porcentaje: modulo.data().porcentaje,
                              finalizado: modulo.data().finalizado,
                              finalizadoTask: modulo.data().finalizadoTask
                      })
                  });
              });
    },
    addModulesTask:function(){

      var por = this.modules.length
      var porcentaje = 0
      if(por==0){
        porcentaje = 100
      }else{
        por +=1
        porcentaje = 100/por
        
        if(this.isFloat(porcentaje)){
          porcentaje = porcentaje.toFixed(1)
        }
        
      }
      this.$db
        .collection('tasks')
          .doc(this.idTask)
            .collection('modules')
              .add({
                nombre:this.modulo.nombre,
                porcentaje: porcentaje,
                finalizado:0,
                finalizadoTask:0
              }).then(response=>{
                var obj = {
                          modulos:this.modules.length,
                }
                this.updatedTaskObj(this.idTask,obj)
                for (let i = 0; i < this.modules.length; i++) {

                  var obj= {
                    porcentaje: porcentaje
                  }
                  this.updatedTaskModuelesObj(this.modules[i].id,obj);
                }
                this.cancelModule()
              }).catch(error=>{
                console.log(error)
              })  

    },
    selectModule:function(modulo){
      this.modulo = modulo

      this.$db
        .collection('tasks')
          .doc(this.idTask)
            .collection('modules')
              .doc(this.modulo.id)
                .collection('childTasks')
                  .onSnapshot((snapShot) => {
                    this.childTasks = []
                    snapShot.forEach((childTask)  => {
                            this.childTasks.push({
                              id:childTask.id,
                              done: childTask.data().done,
                              text: childTask.data().text
                            })
                    });
        });
        
    },
    cancelModule:function(){

      this.dialog = false
      this.modulo ={
        id:null,
        nombre:null,
        porcentaje:0
      }
    },
    createChildTask () {

       
        this.$db
         .collection('tasks')
          .doc(this.idTask)
            .collection('modules')
              .doc(this.modulo.id)
                .collection('childTasks')
                  .add({
                    done: false,
                    text: this.childTask
                  }).then(response=>{
                    
                    var x = (this.childTasks.filter(childTask => childTask.done).length) / this.childTasks.length * 100
                    
                     var obj = {
                      finalizado:this.FixedNumber(x)
                      }
                      console.log(obj)
                    this.updatedTaskModuelesObj(this.modulo.id,obj)
                  }).catch(error=>{
                     console.log(error)
                  })  
        this.childTask = null
    },
    updatedChildTaskDone: async  function(id,boolean){
      boolean = !boolean
        const index = this.childTasks.findIndex((e) => e.id === id);
        if (index === -1) {

        } else {
            this.childTasks[index].done = boolean;
        }
       var obj = {
         done: boolean
       }
       
       this.updatedChildTaskModuelesObj(id,obj)
       
       var cantida = 100/this.modules.length
       this.total=0
       for(let modulo of this.modules){

         await  this.sumarpor(modulo)
                            .then(res => {
                                
                              let can = cantida/res.length; 
                              var x = res.filter(childTask => childTask.done).length
                              let finalizado = x / res.length * 100
                     
                              let fin = can * x
                              
                              var obj = {
                                finalizado:finalizado,
                                finalizadoTask:  (this.FixedNumber(x) / res.length * 100) * modulo.porcentaje / 100
                              }
                              this.updatedTaskModuelesObj(modulo.id,obj)
                              this.total+=  fin
                              //this.setTotal(fin)
                              //console.log('amir :'+fin);
                            })
                            .catch(err => {
                                console.log(err);
                            })
         
       }
       console.log('total :'+this.getTotal());
       

       
       var obj = {
         porcentaje: this.total
       }
       this.updatedTaskObj(this.idTask,obj)
       this.getTask(this.idTask)
      

      
    },
    sumarpor: function(modulo){
       return new Promise((resolve, reject) => {
                      this.$db
                            .collection('tasks')
                              .doc(this.idTask)
                                .collection('modules')
                                  .doc(modulo.id)
                                    .collection('childTasks')
                                      .onSnapshot((snapShot) => {
                                        let modulesTaskChild = []
                                        snapShot.forEach((childTask)  => {
                                            modulesTaskChild.push({
                                                  done: childTask.data().done
                                                })
                                                
                                        });

                                        resolve(modulesTaskChild)
                                      
                            });
          })
    },
    setTotal:function(por){
      console.log(por);
      
      this.total+=por
    },
    getTotal:function(){
      return this.total
    },
    updatedTaskObj:function(idTasks,obj) {
        
        this.$db
          .collection("tasks").doc(idTasks).update(obj)
            .then(function() {
               console.log('updateTask')
            });

    },
    updatedChildTaskModuelesObj:function(id,obj){
        this.$db
         .collection('tasks')
          .doc(this.idTask)
            .collection('modules')
              .doc(this.modulo.id)
                .collection('childTasks')
                  .doc(id)
                    .update(obj).then(response=>{
                    }).catch(error=>{
                      console.log(error)
                    })  
    },    
    updatedTaskModuelesObj:function(id,obj){
        this.$db
         .collection('tasks')
          .doc(this.idTask)
            .collection('modules')
              .doc(id)
                .update(obj).then(response=>{
                  }).catch(error=>{
                     console.log(error)
                  })  
    },
    isFloat:function(n){
          return Number(n) === n && n % 1 !== 0;
    },
    FixedNumber:function(porcentaje){
      if(this.isFloat(porcentaje)){
          porcentaje = porcentaje.toFixed(1)
      }else{
          porcentaje = porcentaje
      }

      return porcentaje
    }
  }
  
}
</script>
<style>

</style>

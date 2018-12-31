<template>
<v-content dark>
    <v-container fluid>
        <v-card>
            <v-card-title>
                <v-btn round large color="primary" @click="dialog=true"  >
                    <v-icon>add</v-icon>
                    Agregar tarea
                </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
                solo
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            </v-card-title>
            <v-data-table
            :headers="headers"
            :items="tasks"
            :search="search"
            :pagination.sync="pagination"
            :rows-per-page-items="[ 7, 15, 25, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 } ]"
            >
            <template slot="items" slot-scope="props">
                <td style="">
                   <v-avatar :color="materialColor()" class="mr-3">
                        <img v-if="props.item.favicon!=''" :src="props.item.favicon" :alt="props.item.favicon">
                        <span v-else class="white--text headline">{{avatar(props.item.nombre )}}</span>
                   </v-avatar>
                   <span class="title">{{ props.item.nombre }}</span>
                </td>
                <td class="text-xs-left"> <span class="headline">{{ props.item.modulos }}</span></td>
                <td class="text-xs-center">

                   <v-progress-linear height="20" :value="props.item.porcentaje"></v-progress-linear>
                   {{ props.item.porcentaje+' %' }}

                </td>
                <td class="text-xs-center">{{ props.item.created_at }}</td>
                <td class="text-xs-letf">
                      <v-btn fab dark small  outline color="error">
                        <v-icon dark>delete</v-icon>
                      </v-btn>
                      <v-btn fab dark small outline color="primary" @click="addsub(props.item.id)">
                          <v-icon dark>edit</v-icon>
                      </v-btn>
                      <v-btn fab dark small outline color="info"  @click="modulos(props.item.id)">
                          <v-icon dark>remove_red_eye</v-icon>
                     </v-btn>

                </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
            </v-data-table>
            <div class="text-xs-center pt-2">
                <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
             </div>
        </v-card>
     </v-container>

     <v-dialog v-model="dialog" width="800px">
      <v-card>

        <v-toolbar color="primary" dark>
          <v-toolbar-title>Añadir usuario nuevo</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Nombre"
                  v-model="task.nombre"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="business"
                v-model="task.favicon"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancelTask">Cancel</v-btn>
          <v-btn flat @click="addTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-content>
</template>
<script>
export default {
   data () {
      return {
        dialog:false,
        search: '',
        pagination: {},
        headers: [
          { text: 'Nombre', value: 'email' },
          { text: 'Modulos', value: 'fat' },
          { text: 'Porcentajes', value: 'carbs',width: 500 },
          { text: 'Fecha', value: 'carbs' },
          { text: 'Accion' }
        ],
        tasks: [],
        task:{
          id:null,
          favicon:'https://picsum.photos/200/300/?random',
          nombre:null, 
          modulos:0,
          porcentaje:0,
        }
      }
    },
     computed: {
      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },
    mounted:function(){
        this.getUser();
    },
    methods:{
     addTask:function(){
       this.$db.collection('tasks').add({              
              favicon:this.task.favicon,
              nombre:this.task.nombre, 
              modulos:0,
              porcentaje:0,
              created_at: new Date().getTime()
      }).then(response=>{
          console.log(response)
          this.cancelTask()
      }).catch(error=>{

      })  

     },
     cancelTask:function(){
        this.dialog = false
        this.task = {
          id:null,
          favicon:'https://picsum.photos/200/300/?random',
          nombre:null, 
          modulos:0,
          porcentaje:0,
        }
     },
     getUser:function(){

       this.$db.collection('tasks').onSnapshot((snapShot) => {
         this.tasks=[];
            snapShot.forEach((task)  => {
                this.tasks.push({
                        id:task.id,
                        favicon: task.data().favicon,
                        nombre:task.data().nombre, 
                        modulos:task.data().modulos,
                        porcentaje:task.data().porcentaje,
                        created_at: this.formatDate(new Date(task.data().created_at),'d MMM yyyy',Date.UTC)
                })
            });
        });
     },
     modulos:function(id ){

       console.log(id)
       this.$router.push('/modulos/'+id)
       /*this.$db.collection('tasks').doc(id).collection('modulues').add({
          password: 'amr',
          name: 's',
          rollno: 0
        })*/
     },
    formatDate:function(date, format, utc){
        var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        function ii(i, len) { var s = i + ""; len = len || 2; while (s.length < len) s = "0" + s; return s; }

        var y = utc ? date.getUTCFullYear() : date.getFullYear();
        format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
        format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
        format = format.replace(/(^|[^\\])y/g, "$1" + y);

        var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
        format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
        format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
        format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
        format = format.replace(/(^|[^\\])M/g, "$1" + M);

        var d = utc ? date.getUTCDate() : date.getDate();
        format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
        format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
        format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
        format = format.replace(/(^|[^\\])d/g, "$1" + d);

        var H = utc ? date.getUTCHours() : date.getHours();
        format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
        format = format.replace(/(^|[^\\])H/g, "$1" + H);

        var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
        format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
        format = format.replace(/(^|[^\\])h/g, "$1" + h);

        var m = utc ? date.getUTCMinutes() : date.getMinutes();
        format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
        format = format.replace(/(^|[^\\])m/g, "$1" + m);

        var s = utc ? date.getUTCSeconds() : date.getSeconds();
        format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
        format = format.replace(/(^|[^\\])s/g, "$1" + s);

        var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
        format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])f/g, "$1" + f);

        var T = H < 12 ? "AM" : "PM";
        format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
        format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

        var t = T.toLowerCase();
        format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
        format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

        var tz = -date.getTimezoneOffset();
        var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
        if (!utc)
        {
            tz = Math.abs(tz);
            var tzHrs = Math.floor(tz / 60);
            var tzMin = tz % 60;
            K += ii(tzHrs) + ":" + ii(tzMin);
        }
        format = format.replace(/(^|[^\\])K/g, "$1" + K);

        var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
        format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
        format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

        format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
        format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

        format = format.replace(/\\(.)/g, "$1");

        return format;
    },
     avatar:function(avatar){
        var nameSplit = String(avatar).toUpperCase().split(' '),initials
        if (nameSplit.length == 1) {
            initials = nameSplit[0] ? nameSplit[0].charAt(0):'?';
        } else {
            initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
        }
        return initials;
     },
    pickRandomProperty:function (obj) {
            var result;
            var count = 0;
            for (var prop in obj)
                if (Math.random() < 1 / ++count)
                result = prop;
            return result;
      },
      materialColor:function () {
  // colors from https://github.com/egoist/color-lib/blob/master/color.json
        var colors = {
            "red": {
                "hex": "#f44336",
                "a100": "#ff8a80",
                "a200": "#ff5252",
                "a400": "#ff1744",
                "a700": "#d50000"
            },
            "pink": {
                "hex": "#e91e63",
                "a100": "#ff80ab",
                "a200": "#ff4081",
                "a400": "#f50057",
                "a700": "#c51162"
            },
            "purple": {
                "hex": "#9c27b0",
                "a100": "#ea80fc",
                "a200": "#e040fb",
                "a400": "#d500f9",
                "a700": "#aa00ff"
            },
            "deepPurple": {
                "hex": "#673ab7",
                "a100": "#b388ff",
                "a200": "#7c4dff",
                "a400": "#651fff",
                "a700": "#6200ea"
            },
            "indigo": {
                "hex": "#3f51b5",
                "a100": "#8c9eff",
                "a200": "#536dfe",
                "a400": "#3d5afe",
                "a700": "#304ffe"
            },
            "blue": {
                "hex": "#2196f3",
                "a100": "#82b1ff",
                "a200": "#448aff",
                "a400": "#2979ff",
                "a700": "#2962ff"
            },
            "cyan": {
                
                "hex": "#00bcd4",
                "a100": "#84ffff",
                "a200": "#18ffff",
                "a400": "#00e5ff",
                "a700": "#00b8d4"
            },
            "teal": {
                
                "hex": "#009688",
                "a100": "#a7ffeb",
                "a200": "#64ffda",
                "a400": "#1de9b6",
                "a700": "#00bfa5"
            },
            "green": {
                
                "hex": "#4caf50",
                "a100": "#b9f6ca",
                "a200": "#69f0ae",
                "a400": "#00e676",
                "a700": "#00c853"
            },
            "lime": {
                "hex": "#cddc39",
                "a100": "#f4ff81",
                "a200": "#eeff41",
                "a400": "#c6ff00",
                "a700": "#aeea00"
            },
            "yellow": {
               
                "hex": "#ffeb3b",
                "a100": "#ffff8d",
                "a200": "#ffff00",
                "a400": "#ffea00",
                "a700": "#ffd600"
            },
            "amber": {
                
                "hex": "#ffc107",
                "a100": "#ffe57f",
                "a200": "#ffd740",
                "a400": "#ffc400",
                "a700": "#ffab00"
            },
            "orange": {
                
                "hex": "#ff9800",
                "a100": "#ffd180",
                "a200": "#ffab40",
                "a400": "#ff9100",
                "a700": "#ff6d00"
            },
            "deepOrange": {
                
                "a100": "#ff9e80",
                "a200": "#ff6e40",
                "a400": "#ff3d00",
                "a700": "#dd2c00"
            },
            "brown": {
                "50": "#efebe9",
                "100": "#d7ccc8",
                "200": "#bcaaa4",
                "300": "#a1887f",
                "400": "#8d6e63",
                "500": "#795548",
                "600": "#6d4c41",
                "700": "#5d4037",
                "800": "#4e342e",
                "900": "#3e2723",
                "hex": "#795548"
            },
            "grey": {
                
                "600": "#757575",
                "700": "#616161",
                "800": "#424242",
                "900": "#212121",
                "hex": "#9e9e9e"
            },
            "blueGrey": {
              
                "500": "#607d8b",
                "600": "#546e7a",
                "700": "#455a64",
                "800": "#37474f",
                "900": "#263238",
                "hex": "#607d8b"
            }
            }
            // pick random property
            //var property = pickRandomProperty(colors);
                var colorList = colors[this.pickRandomProperty(colors)];
                var newColorKey = this.pickRandomProperty(colorList);
                var newColor = colorList[newColorKey];
                return newColor;
        }
    }
  }
</script>
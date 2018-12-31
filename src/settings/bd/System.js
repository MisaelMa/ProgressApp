import axios from 'axios'
export function GetApiCall() {
 return new Promise((resolve, reject) => {
  
     axios.get('http://187.217.205.58:3000/api/app')
              .then(response=>{
			       resolve(response.data)
			   })
  });
}
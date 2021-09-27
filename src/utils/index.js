import axios from 'axios';


// 获取当前定位城市
export function getCurrentCity() {
  const myCity = new window.BMapGL.LocalCity()

  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if (!localCity){
    return new Promise((resolve, reject)=>{
      myCity.get(async res => {
        try {
          const result = (await axios.get(`http://${window.location.hostname}:8080/area/info?name=${res.name}`))
          localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
          resolve(result.data.body)
        }
        catch(e){
          reject(e)
        }
      })
    })
  }else{
    return Promise.resolve(localCity)
  }
}




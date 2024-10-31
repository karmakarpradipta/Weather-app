const location_input = document.getElementsByClassName('location_auto_Suggation_input')[0]
const location_suggation_box = document.getElementsByClassName('location_suggation_box')[0]

const apiKey = 'AHfzPo9S5Av1PBEK1S9zTIvzuioV3ruH';

const fetchLocationData = async function (query){
    const url = `http://dataservice.accuweather.com/locations/v1/search?apikey=${apiKey}&q=${query}`;
    let data =  [];
    try {
        if(query!==""){
            const  response = await fetch(url);
            console.log("res: ",response)
            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }
            data =  await response.json();
        }
        return data;
      } catch (error) {
        console.error('Error:', error.message);
      }
}

const auto_suggetion_handel = async function(event){
    const suggetion = await fetchLocationData(event.target.value);
    location_suggation_box.innerHTML = "";
    if(suggetion.length==0){
        location_suggation_box.classList.remove('show_suggetion')
        return;
    }
    location_suggation_box.classList.add('show_suggetion');
    suggetion.forEach(item => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = "material-symbols-outlined my_location_icon";
        span.textContent = 'distance';
        let matchedIndex = item.LocalizedName.toLowerCase().indexOf(event.target.value.toLowerCase());
        if (matchedIndex !== -1) {
          let beforeMatch = item.LocalizedName.substring(0, matchedIndex);
          let match = item.LocalizedName.substring(matchedIndex, matchedIndex + event.target.value.length);
          let afterMatch = item.LocalizedName.substring(matchedIndex + event.target.value.length);
          li.innerHTML = `${beforeMatch}<b>${match}</b>${afterMatch}, ${item.AdministrativeArea.LocalizedName}, ${item.Country.LocalizedName}`;
        }else{
          li.innerHTML = `${item.LocalizedName}, ${item.AdministrativeArea.LocalizedName}, ${item.Country.LocalizedName}`;
        }
        li.prepend(span);
        location_suggation_box.appendChild(li);
    });
}

//debounced version of autosuggation
function function_debouncing(func,dely){
    let timer = null;
    return function(...args){
      if(timer !== null){
        clearTimeout(timer)
      }
      timer = setTimeout(()=>{
        func.apply(this,args);
      },dely);
    }
  }

const debounced_autosuggetion = function_debouncing(auto_suggetion_handel,300);

location_input.addEventListener('keyup',async event=>{
  debounced_autosuggetion(event)
  if(event.key === 'Enter'&event.target.value!==""){
    const data =  await fetchLocationData(event.target.value)
    console.log(data[0].GeoPosition);
  }
})

location_input.addEventListener('click',event=>{
    if(event.target.value!==""){
        location_suggation_box.classList.add('show_suggetion');
    }
})

location_input.addEventListener('blur',()=>location_suggation_box.classList.remove('show_suggetion'))


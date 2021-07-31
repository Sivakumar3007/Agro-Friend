import icons from 'url:../img/icons.svg';
import {data} from "./crops_API.js";
const recp=document.querySelector(".recipe");
const container=document.querySelector(".results")
const sucess_message="hello";
const search=document.querySelector(".search");
 
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const state={
  agri_data:{},
  search:{
    results:[]
  }
}
//generate private method
const generateMarkup=(data)=>{
  return `
<figure class="recipe__fig">
<img src="${data.image}" alt="${data.title}" class="recipe__img" />
<h1 class="recipe__title">
  <span>${data.title}</span>
</h1>
</figure>
<div class="recipe__details">
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-clock"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--minutes">${data.duration}</span>
  <span class="recipe__info-text">days</span>
</div>
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-users"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--people"></span>
  <span class="recipe__info-text"> per Acre</span>
  <div class="recipe__info-buttons">
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-minus-circle"></use>
      </svg>
    </button>
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-plus-circle"></use>
      </svg>
    </button>
  </div>
</div>
<button class="btn--round">
  <svg class="">
    <use href="${icons}#icon-bookmark-fill"></use>
  </svg>
</button>
</div>
<div class="recipe__ingredients">
<h2 class="heading--2">Importan Details</h2>
<ul class="recipe__ingredient-list">
${data.details.map((ing)=>{
  if(ing){
  return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div  class="recipe__quantity">${ing.Detail3}</div>
            <div class="recipe__description">
            <span class="recipe__unit">${ing.Detail2}</span>
              ${ing.Detail1}
            </div>
          </li>
      `;   
  }     
}).join("")}
</ul>
</div>
<div class="recipe__directions">
<h2 class="heading--2">Agriculture is mother of all Culture</h2>
<p class="recipe__directions-text">
  This Suggestion was carefully Suggested and tested by
  <span class="recipe__publisher">Professional</span>. Please check out
  directions at their website.
</p>
<a
  class="btn--small recipe__btn"
  href="${data.sourceUrl}"
  target="_blank"
>
  <span>Directions</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</a>
</div>
`;
}
const generateIngrdientMarkup=(ing)=>
{
      return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div  class="recipe__quantity">${ing.Detail3}</div>
            <div class="recipe__description">
            <span class="recipe__unit">${ing.Detail2}</span>
              ${ing.Detail1}
            </div>
          </li>
      `;          
      //ternary condition b.s some data does not have a quantity variable in there we want empty
}

const clear=()=>{
  //before we want to give empty
recp.innerHTML="";
}

//render error default message
const renderError=(message)=>{
const markup=`
<div class="error">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${message}</p>
</div>
`;
clear();
container.insertAdjacentHTML("afterbegin",markup);
}
//load recipes
const loadRecipes=(position)=>{
  localStorage.setItem("data",JSON.stringify(data));
  const value=JSON.parse(localStorage.getItem("data"));
  const datas=value.recipes
  console.log(datas[position])
  //const dat=datas.recipes.map((val)=>console.log(val))
  state.agri_data={
      id:datas[position].id,
      plant:datas[position].plant,
      title:datas[position].title,
      image:datas[position].image_url,
      duration:datas[position].duration,
      category:datas[position].category,
     details:datas[position].Details
  }
  return state.agri_data;
}

//render recipes
const render=(data)=>{
if(!data ||(Array.isArray(data) && data.length===0)) return this.renderError();
const markup=generateMarkup(data);
clear();
recp.insertAdjacentHTML("afterbegin",markup);
}

//sidebar show panel
const generatesidebar=(data)=>{
  data.forEach(dat=>{
    const markup= `
  <li class="preview" id="${dat.id}">
            <a class="preview__link preview__link--active" href="${dat.id}">
              <figure class="preview__fig">
                <img src="${dat.image}" alt="${data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${dat.title} ...</h4>
                <p class="preview__publisher">${dat.category}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}.svg#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
  </li>
  `  ;
  container.insertAdjacentHTML("afterbegin",markup);  
  })
  
}


//search bar panel searching filter
const search_generatesidebar=(data,str)=>
{
    container.innerHTML=""
    data.forEach(dat=>{
        if(dat.category===str || str===""){
        const markup= `
    <li class="preview" id="${dat.id}">
              <a class="preview__link preview__link--active" href="${dat.id}">
                <figure class="preview__fig">
                  <img src="${dat.image}" alt="${data.title}" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${dat.title} ...</h4>
                  <p class="preview__publisher">${dat.category}</p>
                  <div class="preview__user-generated">
                    <svg>
                      <use href="${icons}.svg#icon-user"></use>
                    </svg>
                  </div>
                </div>
              </a>
    </li>
    `  ;
    container.insertAdjacentHTML("afterbegin",markup);
        }
    })
  if(container.innerHTML==="") {
    renderError("No results found.Try some other keyword")
  }
}


//side bar render method
const sidebar_render=(data)=>{
  if(!data ||(Array.isArray(data) && data.length===0)) return this.renderError();
  generatesidebar(data);
  clear();
}

//convert into overall josn object
const loopsearches=()=>{
  const value=JSON.parse(localStorage.getItem("data"))
  state.search.results=value.recipes.map(val=>{
    return {
      id:val.id,
      plant:val.plant,
      title:val.title,
      image:val.image_url,
      category:val.category
    }
  })
}
loopsearches();
sidebar_render(state.search.results);


//add event listener method
const preview2=document.getElementById("2")

preview2.addEventListener("click",function(e){
  e.preventDefault();
  render(loadRecipes(2));
})

const preview0=document.getElementById("0")

preview0.addEventListener("click",function(e){
  e.preventDefault();
  render(loadRecipes(0));
})
const preview1=document.getElementById("1")

preview1.addEventListener("click",function(e){
  e.preventDefault();
  render(loadRecipes(1));
})
const preview3=document.getElementById("3")

preview3.addEventListener("click",function(e){
  e.preventDefault();
  render(loadRecipes(3));
})


//search button 
const search2 = document.querySelector(".search__btn"); 
search2.addEventListener("click",function(e){
  e.preventDefault();
  const search_str=document.querySelector(".search__field").value;
  search_generatesidebar(state.search.results,search_str);
})

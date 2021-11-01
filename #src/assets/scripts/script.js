/*_Function  support browser webp css_*/

// @@include('main/_header-burger.js');
let querSell = x => document.querySelector(x);


document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('resize' , debounce(resizePage,  11));
  
    resizePage()

    function resizePage(e){


      if(window.innerWidth > 992) {
        querSell('.first__inner').appendChild(querSell('.first__image'))
        }else{
        querSell('.first__title').after(querSell('.first__image'))
      }

    } 
  
  
    // Function debonce
    function debounce(callback , delay){
      let timer;
      return function(...args){
        clearTimeout(timer);
        timer = setTimeout(()=> {
          callback.apply(this , args)
        }, delay);
      }
    }
  
  })
/*_Function  support browser webp css_*/

// let querSell = x => document.querySelector(x);

// click putton burger
(function(){

	// querSell('.header__border-burger').addEventListener('click', function(){
        //   querSell('.sidebar').classList.toggle('sidebar-active');
       

        // querSell('.header__inner').classList.toggle('inner-left');

        // querSell('.main').classList.toggle('block-left');
        // querSell('.contacts').classList.toggle('block-left');


        // querSell('#button').classList.toggle('button-hidden');
        // querSell('.body').classList.toggle('lock');
     
	// });
// 
})()



// scroll fixed
let lastScroll = 150;
const scrollPosition = ()=>  window.pageYOffset;
// const containHeight =()=> querSell('.header__inner').classList.contains("header-active");

window.addEventListener("scroll", function(){


    // Scrill down
        // if(scrollPosition() >= lastScroll && !containHeight()){
        //     querSell('.header__inner').classList.add('header-active');


        // }else if(scrollPosition() <= lastScroll && containHeight()){
            
        //     querSell('.header__inner').classList.remove('header-active');
        
        // };
        
        // lastScroll = scrollPosition();
   
});
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
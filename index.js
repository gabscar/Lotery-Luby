(function (window,document){
    

   const lotery= (function(){
        const ajax = new XMLHttpRequest();
        
        let selectedNumbers =[]
        return{
            start: function(){
                this.gameSelect();
            },

            gameSelect: function(){
                ajax.open('GET','./games.json',true);
                ajax.send();
                ajax.addEventListener('readystatechange',this.getGameRule)
            },

            getGameRule:function(){
                
                if(this.status ===200 && this.readyState ===4){
                    let data = JSON.parse(this.responseText)
                    lotery.chooseMode(data.types,true);
                }
            },

            chooseMode: function(dataGame,active){
                const sectionBtnRules = document.querySelector(".gameMode");

                dataGame.map((item,index) => {
                    selectedNumbers = [];
                    let button =  document.createElement('button');
                    button.setAttribute('class','btn-game-mode');
                    button.setAttribute('active', 'false')
                    lotery.buttonGameStyle(button.style,item.color)
                    
                    
                    button.innerHTML = item.type;
                    button.addEventListener('click',(evt)=>{
                        evt.preventDefault();
                        console.log(evt.target)
                        button.style.backgroundColor = item.color;
                        button.style.color = '#fff';
                        button.setAttribute('active','true');
                        let listBtn = document.querySelectorAll('.btn-game-mode');
                        listBtn.forEach((item)=>{
                            if(item !== evt.target){
                                if(item.getAttribute('active') ==='true'){
                                    let background = item.style.color;
                                    item.style.color = item.style.backgroundColor;
                                    item.style.backgroundColor = background;
                                    item.setAttribute('active','false');
                                }
                               
                                //console.log(item)
                            }
                        })
                    })
                    
                    sectionBtnRules.appendChild(button);
                   
                    //console.log(item)
                });
            },

            buttonGameStyle:function(button,color){
                button.color = color;
                button.backgroundColor='#FFFFFF';
                button.border =`2px solid ${color}`;
                button.padding = "0.3rem 1.5rem";
                button.borderRadius = '6rem';
                button.marginLeft = '1.5rem';
               
                
            }
        }
    })();
    lotery.start();
})(window,document);
(function (window,document){
    

   const lotery= (function(){
        const numberBTNCollor ='#ADC0C4'; 
        const ajax = new XMLHttpRequest();
        let modelSelect;
        let selectedNumbers =[];
        let $totalPrice =0;
        
        return{
            start: function(){
                this.gameSelect();
            },

            gameSelect: function(){
                ajax.open('GET','./games.json');
                ajax.send();
                ajax.addEventListener('readystatechange',this.getGameRule);
                
            },
            getGameRule:function(){
                if(this.status ===200 && this.readyState ===4){
                    let data = JSON.parse(this.responseText);
                    lotery.setInicialActionsState(data.types);
                }
            },
            setInicialActionsState: function(dataGame){
                
                const sectionBtnRules = document.querySelector(".gameMode");
                const btnClear = document.querySelector("[data-js = btn-clear-game]");
                const btnRandGame = document.querySelector("[data-js = btn-random-game]");
                const btnCart = document.querySelector("[data-js=btn-add-cart]");
                this.generateInitialTextCart();
                lotery.selectModel(dataGame,sectionBtnRules);
                btnClear.addEventListener('click',this.clearBalls);
                btnRandGame.addEventListener('click',this.randomGame);
                btnCart.addEventListener('click',this.setProductsinCart);         
            },

            generateInitialTextCart: function(){
                const $sectionCart = document.querySelector('[data-js=cart-item]');
                const pToCartMessage = document.createElement('section');
                pToCartMessage.setAttribute('class','initialTextCard');
                pToCartMessage.innerHTML='Carrinho Vazio'
                $sectionCart.appendChild(pToCartMessage);
            },
            selectModel:function(dataGame,sectionBtnRules){
                
                dataGame.map((item,index) => {
                    selectedNumbers = [];
                    let $button =  document.createElement('button');
                    $button.setAttribute('class','btn-game-mode');
                    $button.setAttribute('selected', 'false');
                    lotery.buttonGameModeStyle($button.style,item.color);
                    if(index ==0){
                        $button.setAttribute('selected', 'true');
                        $button.setAttribute('selected', 'true')
                        $button.style.color = '#fff';
                        $button.style.backgroundColor = item.color;
                        modelSelect = item;
                        lotery.setDescriptionMode();
                        lotery.generateTableGame(item);
                    }
                    $button.innerHTML = item.type;
                    $button.addEventListener('click',(evt)=>{lotery.buttonActionSelectMode(evt,$button,item)});
                    sectionBtnRules.appendChild($button);
                });
                
            },
            buttonActionSelectMode:function(evt,$button,item){
                evt.preventDefault();            
                selectedNumbers = [];            
                $button.style.backgroundColor = item.color;
                $button.style.color = '#fff';
                $button.setAttribute('selected','true');
                let listBtn = document.querySelectorAll('.btn-game-mode');
                listBtn.forEach((item)=>{
                    if(item !== evt.target && item.getAttribute('selected') ==='true' ){
                        let background = item.style.color;
                        item.style.color = item.style.backgroundColor;
                        item.style.backgroundColor = background;
                        item.setAttribute('selected','false');                         
                    }
                })
                modelSelect = item;
                this.setDescriptionMode();
                lotery.generateTableGame(item);
            },
            
            setDescriptionMode: function(){
                const $ruleText = document.querySelector("[data-js = textRule]"); 
                $ruleText.innerHTML = modelSelect.description;
            },

            generateTableGame: function(element){                
                const $gameNumbers = document.querySelector("[data-js = gameNumbers]"); 
               
                $gameNumbers.innerHTML=""

                for(let i=1;i<=element.range;i++){
                    const $button  = document.createElement('button');
                    $button.setAttribute('selected','false');
                    $button.setAttribute('id',i);
                    $button.setAttribute('data-js','numbersBtn');
                    $button.innerHTML = i>9? i:"0"+i;
                    $button.addEventListener('click',()=>{
                        let limit = element['max-number'] - selectedNumbers.length;
                        
                        if($button.getAttribute('selected') === 'false' && limit!==0){                           
                            selectedNumbers.push(Number($button.getAttribute('id')));
                            $button.setAttribute('selected','true');
                            $button.style.backgroundColor = element.color;            
                        }else if($button.getAttribute('selected') === 'true'){
                            let removedIndex = selectedNumbers.indexOf(Number($button.getAttribute('id')));
                            selectedNumbers.splice(removedIndex,1);
                            $button.setAttribute('selected',false);
                            $button.style.backgroundColor =numberBTNCollor;
                            limit = element['max-number'] - selectedNumbers.length;
                        }
                        if(limit == 0 ){
                            window.alert(`número máximo de números (${element['max-number']}) selecionado`);
                        }
                        console.log(selectedNumbers);
                    });
                    $gameNumbers.appendChild($button);
                }
            },

            clearBalls:function(){
                if(selectedNumbers.length == 0){
                    window.alert("Selecione algum número para limpar");
                    return;
                }
                let buttons = document.querySelectorAll("[data-js = numbersBtn]");                    
                buttons.forEach((item)=>{
                    item.style.backgroundColor = numberBTNCollor;
                    item.setAttribute('selected','false');
                    selectedNumbers = [];
                });
            },

            randomGame:function(){
                let buttons = document.querySelectorAll("[data-js = numbersBtn]");    
                    if(modelSelect==undefined){
                        window.alert("Selecione um modo de jogo");
                        return;
                    }
                  
                    let limit = Number(modelSelect['max-number']) - selectedNumbers.length
                    if(limit===0){
                        lotery.clearBalls();
                        limit = Number(modelSelect['max-number']);
                    }
                       
                    let counter=0;
                    while(counter<limit){
                        let sort = Math.floor(Math.random() * (modelSelect.range - 1)+1);
                        if(selectedNumbers.indexOf(sort) == -1){
                            selectedNumbers.push(sort);
                            counter++;
                        }
                    }
                    
                    buttons.forEach((item)=>{
                        if(selectedNumbers.indexOf(Number(item.id)) !=-1){
                            item.style.backgroundColor = modelSelect.color;
                            item.setAttribute('selected','true');
                        }                        
                    });
            },

            setProductsinCart: function(){
                const $totalText =  document.querySelector('[data-js=cart-value-total]');
                const $sectionCart = document.querySelector('[data-js=cart-item]');
                const $sectionElement = document.createElement('section');
                const $rightDiv = document.createElement('section');
                const $image = document.createElement('img');
                const $btnDelete = document.createElement('button')
                const $pNumbers = document.createElement('p');
                const $pNameandValue = document.createElement('p');         
                const $pNameModeinCard = document.createElement('span');
                const $getNumbersectionElements = document.querySelectorAll('[data-js = section-card-in-cart]');

                if($getNumbersectionElements.length ==0){
                    let $textCart = document.querySelector('.initialTextCard');
                    $textCart.remove();
                }
               
                if(!modelSelect){
                    window.alert("Selecione um modo de jogo");
                    return;
                }
               
                let numbersInDescription = modelSelect.description.match(/\d+/g);
                let menor = Math.min(...numbersInDescription);
                let priceModel =modelSelect.price;
                if(selectedNumbers.length < menor ){
                    window.alert(`selecione de ${menor} até ${modelSelect['max-number']} números para colocar no carrinho`);
                    return;
                }
                
               
                lotery.cartCardStyle($sectionElement,$rightDiv,$image,$btnDelete,$pNumbers,$pNameandValue,$pNameModeinCard); 
                
                $totalPrice+=priceModel;
                $totalText.innerHTML = 'Total R$' + $totalPrice.toFixed(2).replace('.',',');
                $pNameModeinCard.innerHTML = modelSelect.type;             
                $sectionElement.setAttribute('data-js','section-card-in-cart');
                
                $pNumbers.innerHTML = selectedNumbers.join(', ');     
                $pNameandValue.innerHTML = $pNameModeinCard.outerHTML + " R$ " + String(priceModel.toFixed(2)).replace('.',',');
                               
                $rightDiv.appendChild($pNumbers);
                $rightDiv.appendChild($pNameandValue);
                $btnDelete.appendChild($image);

                $sectionElement.setAttribute('priceInSection',`${modelSelect.price}`);
                $sectionElement.appendChild($btnDelete);
                $sectionElement.appendChild($rightDiv);
                
                $sectionCart.appendChild($sectionElement);

                $btnDelete.addEventListener('click',(evt)=>lotery.deleteProductsInCart(evt));
                lotery.clearBalls();
            },

            deleteProductsInCart:function(evt){
                evt.preventDefault();
                const $totalText =  document.querySelector('[data-js=cart-value-total]');
                const $element = evt.target;
                const btn = $element.parentNode
                const $section = btn.parentNode;
                let $valor  = $section.getAttribute('priceInSection');
                $totalPrice -= $valor;
                $section.remove();
                const $getNumbersectionElements = document.querySelectorAll('[data-js = section-card-in-cart]');

                if($getNumbersectionElements.length ==0){
                   this.generateInitialTextCart();
                }
                $totalText.innerHTML = 'Total R$' + $totalPrice.toFixed(2).replace('.',',');
            },

            cartCardStyle:function($sectionElement,$rightDiv,$image,$btnDelete,$pNumbers,$pNameandValue,$pNameModeinCard){
                $sectionElement.style.alignItems='center';
               // $sectionElement.style.justifyContent='space-evenly';
                $sectionElement.style.flexDirection = 'row';
                $sectionElement.style.display='flex';                  
                $sectionElement.style.width ='100%';
                $sectionElement.style.marginTop = '1rem';
                $sectionElement.style.marginBottom = '1rem';
                
               
                $rightDiv.style.borderLeft = `4px solid ${modelSelect.color}`;
                $rightDiv.style.borderRadius = '4px 0px 0px 4px';
                $rightDiv.style.width = '234px';
                $rightDiv.style.marginLeft='14.4px';
               
                $rightDiv.style.display='flex';
                $rightDiv.style.flexDirection='column';
                

                $pNumbers.style.marginBottom = '6px';
                $pNumbers.style.marginLeft = '12px';

                $pNameandValue.style.marginLeft = '12px';
                $pNameandValue.style.flexDirection = 'row'
               
                $pNameModeinCard.style.color = modelSelect.color;
                $pNameModeinCard.style.fontWeight = 'bold';
                $pNameModeinCard.style.fontSize = '1rem'
               
                $image.src = './assets/trash.png';
                $image.style.width='25px';
                $image.style.marginLeft = '17px';
                $btnDelete.style.backgroundColor='#fff';
                $btnDelete.style.border='none';
            },
            buttonGameModeStyle:function(button,color){
                button.color = color;
                button.backgroundColor='#FFFFFF';
                button.border =`2px solid ${color}`;
                button.padding = "0.3rem 1.5rem";
                button.borderRadius = '6rem';
                button.marginLeft = '1.5rem';
                button.cursor = 'pointer';
            },

        }       
    })();
    lotery.start();
})(window,document);
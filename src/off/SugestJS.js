class SugestJS extends RabinKarp {
	
	constructor(){
		
		super();
		
		this.__word 	= null ;
		
		this.__config	= {
			part 	 : 1 ,
			order	 : 'asc',
			position : false
		};
		
		this.__Dic			= [];
		this.__Sug			= [];
		this.__DivPiv   	= null ;
		this.__BkPlan  		= null ;
		this.__LastOrd		= -1;	
		
		this.Method 		= {
			non 	: 'NonRecursive',
			rec 	: 'Recursive',
			dyna 	: 'Dynamic' 
		}
		
		
	}
	
	setWordPos( active = false ){
		this.__config.position = active;
	}
	
	setInput(word ){
		this.__word = word;
	}
	
	setOrder( order = 'asc'){
		 this.__config.order = order;
	}
	
	setDiccionary( $dic = [] , sort = true ){
		
		
		if(sort){
			switch(this.__config.order){
				case 'asc':
				case 'ASC': 
							this.__Dic = $dic.sort(function (a, b) {
								return a.localeCompare(b);
							});
						break;
				case 'desc':
				case 'DESC':
						this.__Dic = $dic.sort(function (a, b) {
								return b > a ;
							});
						break;
			}
		}
		else
			this.__Dic = $dic;
		
		return this;
		
	}
	
	sugestNonRecursive(){
		
		let i 		= 0 ; 
		let ws		= 0 ;
		let dic 	= Object.assign([] , this.__Dic);
		let find 	= false ;
		let result  = [];
		
		if(this.__word == null 
				|| this.__word == "" ) {
			return [];
		}
		
		if(dic == null ) {
			return [];
		}
		
		ws =  dic.length;
		
		for( i = 0 ; i < ws ; i++ ){
			if(!this.__config.position){
				find  = this.IsSearchKarpRabin(dic[i] , this.__word);
				if(find)
					result.push(dic[i]);
			}
			else{
				find = this.searchKarpRabin(dic[i] , this.__word);
				if(find != -1 )
					result.push({
						word : dic[i],
						pos  : find,
						len  : this.__word.length
					})
			}

		}
		
		
		return result;
	}
	
	sugestRecursive(result = [] , i = 0 ){
		
		if(this.__word == null 
				|| this.__word == "" ) {
			return [];
		}
		else if(this.__word.length == 1 )
			return [];
		
		let dic 	= Object.assign([] , this.__Dic);
		
		if(dic == null ) {
			return [];
		}
		
		let found = this.IsSearchKarpRabin(dic[i] , this.__word);
		
		if(found &&  i == (dic.length - 1)){
			 return result;
		}
		else if(found){
			 if(typeof result  !== 'object' || typeof result  !== 'array') result = [];
			 return this.sugestRecursive(result.push(dic[i]) , i++);
		}
		else {
			 return this.sugestNonRecursive(result , i++);
		}
		
	}
	
	sugest( method = 'NonRecursive' ){
		
		switch(method){
			case 'NonRecursive':
				return this.sugestNonRecursive();
			case 'Recursive':
				return this.sugestRecursive();
			case 'Dynamic' : 
				return this.sugestDinamic();
		}
		
	}
	
	sugestDinamic(dic = this.__DivPiv , itr = 0 , piv = []  , wordPos = false ){
		
		if(this.__word == null 
				|| this.__word == "" ) {
			this.__DivPiv = null;
			return [];
		}
	
	
		if( this.__LastOrd > -1 
				&& this.__word.length !== this.__LastOrd  
				&& this.__LastOrd > this.__word.length 
		){
			dic = Object.assign([] , this.__Dic);
		}
		
		if(dic == null ) {
			
			if(this.__Dic.length >= 5000 )
			{
				dic = [];
				for(let i = 0 ; i < this.__Dic.length ; i++ ){
					dic.push(this.__Dic[i]);
				}
			}else{
				dic = Object.assign([] , this.__Dic);
			}
		}
		
		
		
		if(dic !== null || typeof dic !== 'undefined'){
			
			if((dic.length ) == itr){
				this.__DivPiv = Object.assign([] , piv);
				if(this.__word.length == 1)
					return [];
				else 
					return piv;
			}
		}
		
		
		if(typeof dic[itr] === 'undefined' ) 
			return [];
		
		
		let wlen = this.__word.length;
		
		
		if(dic[itr].length < wlen ) {
			dic = this._delete(dic , itr);
			return this.sugestDinamic(dic , 0 , piv);
		}
		else{
			//let is = this._wordSearch(this.__word , dic[itr]);
			let is = this.IsSearchKarpRabin(dic[itr] , this.__word);
			switch(is){
				case true:
						piv.push(dic[itr]);
						this.__LastOrd = (this.__word.length);
						dic = this._delete(dic , itr);
						return this.sugestDinamic(dic , 0 , piv);
				case false :
						return this.sugestDinamic(dic , itr+1 , piv);
			}
		}
		
		
		return [];
		
	}

	sugestPos( dic = this.__DivPiv  ){
		return this.sugest(dic , 0 , [] , true );
	}

	_delete(dic , itr ){
		try{
			let index = dic.indexOf(dic[itr]);
			if(index > -1){
				dic.splice(index , 1);
			}
		}
		catch(e){}
		return dic;
	}
	
	_wordSearch(word , part){
		//Deprecate word search 
		try{
			if(String(part).search(word) !== -1 ){
				return true ;
			}
			else {
				return false;
			}
		}
		catch(e){ return true ;}
	}
	

	
}
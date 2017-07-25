class RabinKarp{
	
	constructor(){
		this.prime 			= 101;
		this._log  			= [];
		this._logActivate 	= false;
		this._StrictCases   = false ;
	}
	
	activateRabinLog( active = false ){
		this._logActivate = active;
	}
	
	Set_StrictCases(v = false ){ this._StrictCases = v ; }
	
	GetRabinLog(){
		return this._log;
	}
	
	searchKarpRabin(text , pattern ){
		
		let  m = pattern.length;
        let  n = text.length;
		
		if(this._StrictCases){
			text 		= String(text).toLowerCase();
			pattern		= String(pattern).toLowerCase();
		}
		
		let patternHash 		= this.__createHash(pattern, m - 1);
		let textHash 			= this.__createHash(text, m - 1);
	
	    let k = 0;
		for (let i = 1; i <= n - m + 1; i++) {
			
			k++;
            if(patternHash == textHash && this.__checkEqual(text, i - 1, i + m - 2, pattern, 0, m - 1)) {
				
				if(this._logActivate)
					this._log.push({
						text 		: text , 
						iteration 	: k ,
						pattern     : pattern ,
						state  		: 'FOUND'
					});
					
                return i - 1;
            }
            if(i < n - m + 1) {
                textHash = this.__recalculateHash(text, i - 1, i + m - 1, textHash, m);
            }
        }
		
		if(this._logActivate)
			this._log.push({
					text 		: text , 
					iteration 	: k ,
					pattern     : pattern ,
					state  		: 'NOT FOUND'
			});
		
        return -1;
		
	}
	
	IsSearchKarpRabin(text , pattern){
		if(this.searchKarpRabin(text , pattern ) >= 0)
			return true ;
		else 
			return false;
	}
	
	__checkEqual(str1,start1 = 0 , end1 = 0 , str2, start2 = 0 ,end2 = 0){
		
        if(end1 - start1 != end2 - start2) {
            return false;
        }
        while(start1 <= end1 && start2 <= end2){
            if(str1[start1] != str2[start2]){
                return false;
            }
            start1++;
            start2++;
        }
        return true;
    }
	
	__recalculateHash(str, oldIndex,  newIndex,oldHash,  patternLen) {
        let newHash = oldHash - String(str[oldIndex]).charCodeAt();
        newHash = newHash/this.prime;
        newHash += String(str[newIndex]).charCodeAt() *Math.pow(this.prime, patternLen - 1);
        return newHash;
    }
	
	__createHash( str , end = 0 ){
		let hash = 0;
		for ( let i = 0 ; i <= end; i++) {
            hash += String(str[i]).charCodeAt() * Math.pow(this.prime,i);
        }
		return hash;
	}
	
	
}




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
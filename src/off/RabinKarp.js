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


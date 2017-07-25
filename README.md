# CoorsJS

  Version 0.1.1 [stable]
  
   [![Build Status](https://secure.travis-ci.org/mde/timezone-js.png)](https://secure.travis-ci.org/mde/timezone-js)

  ## It was never so easy to create a list of suggestions
  
 
 ```js
   
        /*
            Create new Sugest 
        */
        
        var sugest  = new SugestJS();  //new instance to sugest 
        
        var words   = [ ".." , "..." , "...." , "....." , ... ];   //add o create wordlist to find   
        
        sugest.setDiccionary(words);    //set a new diccionary 
        sugest.setOrder("asc")          // order of word list "asc" or "desc" , remember asc = a to z  and desc = z to a 
        
        //optionals params 
        
        sugest.setWordPos(true); // into de find word add a initial position and len of word 
        
        
		sugest.Set_StrictCases(true); // if true ignore uppercases
        
        /***
            Return an arrayList the finder words 
            if setWordPos is true return an arraylist object 
            
            for example  [0] => {
                   word : 'string word',
                   pos  : 'int position',
                   len  : 'int word size '
            }
        
        **/
        
	
        var result = sugest.sugest(sugest.Method.rec); //selected a recursive method 
        
```
 ## sugest.Method 
     
     when create sugestJS includes some Methods to get the best time 
     in this case has 3 methods :
   
```js
    
    	sugest.Mehod.non   	
	// non recursive method , works fine less than 15,000 lines words equal 60,000 words 
	sugest.Method.rec  
	// recursive method , its more faster than non method and works fine more than 25,000 lines or more 
	sugest.Method.dyna 
	// dynamic recursive method , its very fast , but only support less than 8,000 lines , but if reduce 8,000 in 			   	 // in one line and create partitions, this method is the best.
```

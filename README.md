# CoorsJS

  Version 0.1.1 [stable]
  
   [![Build Status](https://secure.travis-ci.org/mde/timezone-js.png)](https://secure.travis-ci.org/mde/timezone-js)

  ## Create a list of sugest or find some into a word.
  
 
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
        
        var result = sugest.sugest(sugest.Method.rec);
        
   
    ```

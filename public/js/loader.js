function loadScripts(file, callback){  
    var loader = function(src, handler){  
        var script = document.createElement("script");
        script.type= 'text/javascript';
        script.src = src;
        var var_name = src.split("/").last().split(".").first();
        script.onload = script.onreadystatechange = function(){  
          script.onreadystatechange = script.onload = null;  
          if(/MSIE ([6-9]+\.\d+);/.test(navigator.userAgent))window.setTimeout(function(){handler(eval(var_name));},8,this);  
          else handler(eval(var_name));
        }  
        var head = document.getElementsByTagName("head")[0];  
        (head || document.body).appendChild( script );
        return script;
    };
    return loader(file, callback);  
} 

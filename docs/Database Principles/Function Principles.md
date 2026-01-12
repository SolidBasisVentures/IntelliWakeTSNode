Functions are a great way to provide additional logic into the database to improve performance of some operations.

There are a few things we would like to do when implementing a PostgreSQL routine.  Please consider the following example:

```
CREATE FUNCTION func_add_two(parm_value INTEGER) RETURNS INTEGER 
    LANGUAGE plpgsql  
AS  
$$  
DECLARE  
    var_new_value INTEGER;  
BEGIN  
	/**
	This function adds two to the provided value
	*/
	
    var_new_value := parm_value + 2;

	RETURN var_new_value;
END ;  
$$; 
```

## Prefix with `func_`
Prefixing with `func_` allows other system functions (that may be installed via packages) to be kept separate from your routines.

## Parameters prefix with `parm_`
It is super helpful in the body of the function to be able to spot parameters, and keep them separate from table names or column names.

## Variables prefix with `var_`
Similar to parameters, prefixing variables with `var_` help other developers to identify variables and parameters separate from tables and columns.

## Comment after BEGIN
After the BEGIN section header, please add a comment to describe the function.  By doing it after the BEGIN, the comment is stored with the function.
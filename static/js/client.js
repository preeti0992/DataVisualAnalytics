$(function(){
	$('button').click(function(){
		var user = $('#pred_date').val();
		$.ajax({
			url: '/get_pred',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
    			var responseObj= JSON.parse(response);    			
    			var status=responseObj.status;
    			var passError=responseObj.pass;
            if(status==='BAD')
            {
                $( '#errorMsg' ).text("Something went wrong");//TODO
            }

            else{
                    var pred_result=responseObj.result;
        			console.log(pred_result);        			
        			document.getElementById('signupform').reset();
        			
        		}
			},
			error: function(error){
				console.log(error);
			}
		});
	});
});
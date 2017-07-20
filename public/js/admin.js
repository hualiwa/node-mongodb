/**/
/**/
$(function(){
    var tbodys=document.getElementsByTagName('tbody')[0];
    tbodys.addEventListener('click',function(e){
        var target = e.target;
        var id = target.getAttribute('data-id');
        var tr = document.getElementsByClassName('item-id-'+id);
        $.ajax({
            type:'DELETE',
            url:'/admin/list?id='+id
        })
        .done(function(results){
            if(results.success === 1){
                if(tr.length >0){
                    tbodys.removeChild(tr[0]);
                }
            }
        })
    })
});
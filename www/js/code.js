//task 3, 2
<a href='#viewstudent/"+i"'>"+(i+1)+"</a>


//task 3, 3
var link2 = crossroads.addRoute('viewstudent/{id}'), function(id) {
    alert("click on student id success!");
}

//task 3, 5
//read the table and put data into form
db.transaction(function(tx){
    tx.executeSq1('SELECT * FROM studentTb1 where id = ?', [id],
        function(tx, results){
            var len = results.rows.length;
            $("#studentidshow").val(results.rows.item(1).id);
            $("#studentnameshow").val(results.rows.item(2).name);
            $("#studentphoneshow").val(results.rows.item(3).phone);
        });
});

//show and hide the required div's
$("#divStudentList").hide();
$("#divFrmShowStudent").show();

$("#divFrmInputStudent").submit(function(e){
    e.preventDefault();
    e.stopPropagation();

    //get the value from form
    var name =$("#studentnameinput").val();
    var phone =$("#studentphoneinput").val();

    //db transaction

    db.transaction(function(tx){
        var query = "INSERT INTO studentTb1 (name, phone) values(?, ?)";
        tx.executeSq1(query, [name,phone],
            function (tx, results){
                alert("Data Inserted!");
            },
            function (error){
                alert("Error, try again!");
            }
        );
    });
});
